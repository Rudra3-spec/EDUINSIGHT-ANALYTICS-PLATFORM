"""
EduInsight Analytics — ML Prediction Script
Uses a rule-based scoring model (no sklearn/joblib/numpy) so it works
reliably across all Python environments without BLAS/MKL threading issues.

The completion probability is computed from a weighted combination of:
  - score         (higher score → more likely to complete)
  - time_spent    (moderate time → more likely to complete; too low is bad)
  - chapter_order (earlier chapters → less data, treated neutrally)
"""
import os
import sys
import json
import math

# ─── Set threading env vars early (belt-and-suspenders safety) ───────────────
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import pandas as pd

# ─── Required columns ────────────────────────────────────────────────────────
REQUIRED = {"student_id", "chapter_order", "time_spent", "score"}

# ─── File reader ─────────────────────────────────────────────────────────────
def read_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext in (".xlsx", ".xls"):
        return pd.read_excel(file_path)
    elif ext == ".csv":
        return pd.read_csv(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}. Please upload CSV or Excel.")

# ─── Column validation ───────────────────────────────────────────────────────
def validate(df):
    df.columns = df.columns.str.strip().str.lower()
    missing = REQUIRED - set(df.columns)
    if missing:
        raise ValueError(
            f"Missing required columns: {', '.join(sorted(missing))}. "
            f"Found: {', '.join(df.columns.tolist())}"
        )
    return df

# ─── Completion probability (rule-based, 0-1) ────────────────────────────────
def completion_prob(score, time_spent):
    """
    A transparent weighted model that approximates a Random Forest output:
      - Score is the strongest predictor (weight 0.7)
      - Time spent has a sweet-spot curve (weight 0.3)
        too little time (< 20 min) → penalised
        optimal range (40-90 min)  → boosted
        very long time (> 120 min) → slight penalty (struggling)
    Returns a float in [0, 1].
    """
    # Normalise score to 0-1 (assuming 0-100 scale)
    score_norm = max(0.0, min(float(score) / 100.0, 1.0))

    # Time sigmoid centred around 55 minutes
    t = float(time_spent)
    if t < 5:
        time_factor = 0.05
    elif t < 20:
        time_factor = 0.2 + (t - 5) * (0.4 / 15)   # ramp up
    elif t <= 90:
        time_factor = 0.6 + (t - 20) * (0.35 / 70)  # sweet-spot ramp
    elif t <= 120:
        time_factor = 0.95 - (t - 90) * (0.10 / 30) # slight decline
    else:
        time_factor = 0.85 - (t - 120) * (0.005)    # slow decline for very long
        time_factor = max(0.4, time_factor)

    prob = 0.70 * score_norm + 0.30 * time_factor

    # Add a small bonus for very high scores (≥80) to match RF behaviour
    if score_norm >= 0.80:
        prob = min(1.0, prob + 0.05)

    return round(max(0.01, min(0.99, prob)), 4)

# ─── Risk label ──────────────────────────────────────────────────────────────
def risk_label(prob):
    if prob < 0.40:
        return "High"
    if prob < 0.70:
        return "Medium"
    return "Low"

# ─── Main prediction ─────────────────────────────────────────────────────────
def run_prediction(file_path):
    df = read_file(file_path)
    df = validate(df)
    df = df.dropna(subset=["chapter_order", "time_spent", "score"])

    if len(df) == 0:
        raise ValueError("The uploaded file contains no valid data rows.")

    # Compute per-row probability
    df = df.copy()
    df["prob"] = df.apply(
        lambda r: completion_prob(r["score"], r["time_spent"]), axis=1
    )

    # ── Per-student aggregation ───────────────────────────────────────────────
    student_agg = (
        df.groupby("student_id")
        .agg(
            avg_score=("score", "mean"),
            avg_time=("time_spent", "mean"),
            completion_probability=("prob", "mean"),
        )
        .reset_index()
    )

    student_results = []
    for _, row in student_agg.iterrows():
        sid = row["student_id"]
        try:
            sid_str = str(int(float(sid)))
        except Exception:
            sid_str = str(sid)
        prob = float(row["completion_probability"])
        student_results.append({
            "studentId": sid_str,
            "score": round(float(row["avg_score"]), 2),
            "timeSpent": round(float(row["avg_time"]), 2),
            "riskLevel": risk_label(prob),
            "completionProbability": round(prob, 2),
        })

    # ── Per-chapter analysis ─────────────────────────────────────────────────
    chapter_agg = (
        df.groupby("chapter_order")
        .agg(
            avg_score=("score", "mean"),
            avg_time=("time_spent", "mean"),
            completion_rate=("prob", "mean"),
            student_count=("student_id", "count"),
        )
        .reset_index()
    )

    difficulty_data = []
    for _, row in chapter_agg.iterrows():
        avg_score = float(row["avg_score"])
        diff = round(100.0 - avg_score, 2)
        difficulty_data.append({
            "chapter": int(row["chapter_order"]),
            "difficulty": diff,
            "avgScore": round(avg_score, 2),
            "avgTime": round(float(row["avg_time"]), 2),
            "studentCount": int(row["student_count"]),
            "completionRate": round(float(row["completion_rate"]) * 100, 1),
        })
    difficulty_data.sort(key=lambda x: x["chapter"])

    # ── Insight ──────────────────────────────────────────────────────────────
    if difficulty_data:
        hardest = max(difficulty_data, key=lambda x: x["difficulty"])
        easiest = min(difficulty_data, key=lambda x: x["difficulty"])
        high_risk = sum(1 for s in student_results if s["riskLevel"] == "High")
        total = len(student_results)
        pct = round((high_risk / total) * 100) if total > 0 else 0
        insight = (
            f"Chapter {hardest['chapter']} is the most difficult "
            f"(difficulty: {hardest['difficulty']}%, avg score: {hardest['avgScore']}%). "
            f"Chapter {easiest['chapter']} is the easiest. "
            f"{high_risk} of {total} students ({pct}%) are at high risk of not completing. "
            f"Consider adding extra resources for Chapter {hardest['chapter']}."
        )
    else:
        insight = "No chapter data available."

    # ── Summary ──────────────────────────────────────────────────────────────
    total = len(student_results)
    high_n = sum(1 for s in student_results if s["riskLevel"] == "High")
    med_n = sum(1 for s in student_results if s["riskLevel"] == "Medium")
    low_n = sum(1 for s in student_results if s["riskLevel"] == "Low")
    avg_prob = (
        round(sum(s["completionProbability"] for s in student_results) / total * 100, 1)
        if total > 0 else 0
    )

    print(json.dumps({
        "students": student_results,
        "chapters": difficulty_data,
        "insight": insight,
        "summary": {
            "totalStudents": total,
            "highRisk": high_n,
            "mediumRisk": med_n,
            "lowRisk": low_n,
            "avgCompletionProbability": avg_prob,
        },
    }))


# ─── Entry point ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided."}))
        sys.exit(1)

    fp = sys.argv[1]
    if not os.path.exists(fp):
        print(json.dumps({"error": f"File not found: {fp}"}))
        sys.exit(1)

    try:
        run_prediction(fp)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)