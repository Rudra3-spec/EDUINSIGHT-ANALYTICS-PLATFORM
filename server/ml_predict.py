import sys
import pandas as pd
import joblib
import json
import os

# Get the directory where THIS script is located (server folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Point to the ML folder which is a sibling to server
# This goes: server -> up to final_proj -> down to ML
ML_FOLDER = os.path.join(BASE_DIR, "..", "ML")

# ... (keep your imports and BASE_DIR/ML_FOLDER setup) ...

def run_prediction(file_path):
    model = joblib.load(os.path.join(ML_FOLDER, 'completion_model.joblib'))
    
    df = pd.read_csv(file_path)

    # 1. Individual Predictions (What we already have)
    X = df[['chapter_order', 'time_spent', 'score']]
    probs = model.predict_proba(X)[:, 1]
    
    student_results = []
    for i in range(len(df)):
        prob = float(probs[i])
        # Define thresholds for Risk Levels
        if prob < 0.4:
           risk_label = "High"
        elif prob < 0.7:
           risk_label = "Medium"
        else:
           risk_label = "Low"

        student_results.append({
        "studentId": str(df.iloc[i].get('student_id', i)),
        "score": float(df.iloc[i]['score']),
        "riskLevel": risk_label,
        "completionProbability": round(prob, 2)
    })

    
    
    

    # 2. FEATURE #3: Chapter Difficulty Logic
    # We calculate average score and time spent per chapter
    chapter_analysis = df.groupby('chapter_order').agg({
        'score': 'mean',
        'time_spent': 'mean'
    }).reset_index()

    difficulty_data = []
    for i in range(len(chapter_analysis)):
        # Higher score = Lower difficulty (so we invert it)
        score = chapter_analysis.iloc[i]['score']
        diff_score = 100 - score 
        difficulty_data.append({
            "chapter": int(chapter_analysis.iloc[i]['chapter_order']),
            "difficulty": round(float(diff_score), 2),
            "avgTime": round(float(chapter_analysis.iloc[i]['time_spent']), 2)
        })

    # 3. FEATURE #4: Generate Insight Text
    hardest_chapter = max(difficulty_data, key=lambda x: x['difficulty'])
    insight = f"Chapter {hardest_chapter['chapter']} is the most difficult. Consider adding more resources there."

    # Return everything as one big JSON object
    final_output = {
        "students": student_results,
        "chapters": difficulty_data,
        "insight": insight
    }
    
    print(json.dumps(final_output))

# ... (keep the __main__ block the same) ...

if __name__ == "__main__":
    file_path = sys.argv[1]
    run_prediction(file_path)