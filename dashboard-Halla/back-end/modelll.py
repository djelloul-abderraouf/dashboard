import pickle
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
import os
file_path = os.path.join(os.path.dirname(__file__), 'dataset.csv')


# 1️⃣ Charger et préparer les données
def load_data():
    """
    Charge le dataset, supprime les valeurs manquantes
    et sélectionne les variables explicatives et cible.
    """
    # Charger les données
    data = pd.read_csv(file_path)

    # Supprimer les lignes avec des valeurs manquantes
    data = data.dropna()

    # Sélectionner les variables explicatives et la cible
    features = data[['GPA', 'ParentalSupport', 'ParentalEducation', 'Tutoring', 'Extracurricular']]
    target = data['StudyTimeWeekly']

    return features, target

# 2️⃣ Entraîner le modèle
def train_model(features, target):
    """
    Entraîne un modèle de régression linéaire et l'enregistre avec pickle.
    """
    # Normaliser les features pour améliorer la performance
    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(features)

    # Diviser en ensemble d'entraînement et de test
    X_train, X_test, y_train, y_test = train_test_split(features_scaled, target, test_size=0.2, random_state=42)

    # Initialiser et entraîner le modèle
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Prédiction et évaluation
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    print(f' Mean Squared Error: {mse:.2f}')

    # Sauvegarder le modèle et le scaler
    import os

    model_path = os.path.join(os.path.dirname(__file__), 'student_performance_model3.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump((model, scaler), f)


    print(" Modèle sauvegardé sous 'student_performance_model3.pkl'.")

# 3️⃣ Charger le modèle
def load_model():
    """
    Charge le modèle entraîné depuis le fichier.
    """
    try:
        with open('student_performance_model3.pkl', 'rb') as f:
            model, scaler = pickle.load(f)
        print(" Modèle chargé avec succès.")
        return model, scaler
    except FileNotFoundError:
        print(" Modèle non trouvé. Entraîne-le d'abord.")
        return None, None

# 4️⃣ Faire une prédiction
def predict_study_time(features):
    """
    Prédit le temps d’étude hebdomadaire pour un étudiant donné.
    """
    model, scaler = load_model()
    if model:
        features_scaled = scaler.transform([features])  # Normaliser les nouvelles données
        prediction = model.predict(features_scaled)
        return prediction[0]
    else:
        return None
    


# 5️⃣ Lancer l'entraînement si le script est exécuté
if __name__ == "__main__":
    features, target = load_data()
    train_model(features, target)