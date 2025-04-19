from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Autorise les requêtes CORS pour que React puisse appeler l'API

### Chargement des modèles avec joblib ###
# 1. Modèle de régression StudyTimeWeekly
study_model, study_scaler = joblib.load('student_performance_model3.pkl')

# 2. Modèle de régression GPA
gpa_model = joblib.load('student_performance_model1.pkl')

# 3. Modèle de classification (pipeline)
classification_pipeline = joblib.load('student_activity_pipeline.pkl')

def orientation(physique, science, math):
    if math <= 20 and physique <= 20 and science <= 20:
        if physique > math and physique > science:
            return "math technique"
        elif math > physique and math > science:
            return "mathéléme"
        elif science > physique and science > math:
            return "scientifique"
        else:
            return "orientation vers son choix"
    return "données invalides"

### Route pour prédire à partir d'un fichier CSV ###
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier trouvé dans la requête'}), 400

    # Lire le fichier CSV envoyé depuis Node.js
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400      
    try:

        df = pd.read_csv(file)

        gpa_features = df[['StudyTimeWeekly', 'Absences', 'Gender', 'Tutoring', 'Sports', 'Music', 'Volunteering', 'Extracurricular', 'ParentalSupport']]
        gpa_predictions = gpa_model.predict(gpa_features)

        # ---------- StudyTimeWeekly Prediction ----------
        # Colonnes nécessaires :
        # ['GPA', 'ParentalSupport', 'ParentalEducation', 'Tutoring', 'Extracurricular']
        study_features_list = []
        for _, row in df.iterrows():
            study_features_list.append([
                row['GPA'],
                row['ParentalSupport'],
                row['ParentalEducation'],
                row['Tutoring'],
                row['Extracurricular']
            ])
        study_features_scaled = study_scaler.transform(study_features_list)
        study_predictions = study_model.predict(study_features_scaled)

        # ---------- Classification multi-label Prediction ----------
        # Colonnes nécessaires :
        # ['Age', 'Gender', 'StudyTimeWeekly', 'ParentalSupport', 'GPA']
        classification_features = df[['Age', 'Gender', 'StudyTimeWeekly', 'ParentalSupport', 'GPA']]
        classification_predictions = classification_pipeline.predict(classification_features).tolist()
        
        # ---------- Response JSON ----------
        results = []  # Initialisation de la liste des résultats
        for idx in range(len(df)):
            orientation_result = orientation(
                df.iloc[idx]['Physics'],
                df.iloc[idx]['Science'],
                df.iloc[idx]['Math']
            )
            activity_labels = ['Sports', 'Music', 'Volunteering', 'Extracurricular'] 
            predicted_activities = classification_predictions[idx]

            # Construction de la liste des activités
            activities = [activity_labels[i] for i, val in enumerate(predicted_activities) if val == 1]
            if not activities:
                activities = ['Aucune']
                
            student = {
                'StudentID': df.iloc[idx]['StudentID'],  # Utilise StudentID du fichier csv
                'PredictedGPA': round(gpa_predictions[idx], 2),
                'PredictedStudyTime': round(study_predictions[idx], 2),
                'PredictedActivities': activities,
                'Orientation': orientation_result,
            }
            
            # Ajouter l'étudiant à la liste des résultats
            results.append(student)

        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/', methods=['GET'])
def home():
    return '✅ Le backend Flask fonctionne !'

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong 🏓 Flask est vivant !'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)