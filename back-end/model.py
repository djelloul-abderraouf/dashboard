import pickle
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import os

file_path = os.path.join(os.path.dirname(__file__), 'dataset.csv')


# Load and preprocess the dataset
def load_data():
    """
    Load the dataset, preprocess it by dropping missing values,
    and selecting the features and target variable.
    """
    # Load the CSV dataset
    data = pd.read_csv(file_path)

    # Drop rows with missing values
    data = data.dropna()

    # Select features (input variables) and target (output variable)
    features = data[['StudyTimeWeekly', 'Absences', 'Gender', 'Tutoring', 'Sports', 'Music', 'Volunteering', 'Extracurricular', 'ParentalSupport']]  # Adjust columns based on your dataset
    target = data['GPA']  # Column you want to predict (e.g., final_score or performance)

    return features, target


# Train the model
def train_model(features, target):
    """
    Train a Linear Regression model on the given features and target.
    """
    # Initialize the model
    model = LinearRegression()

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    # Train the model on the training data
    model.fit(X_train, y_train)

    # Evaluate the model on the testing data
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    print(f'Mean Squared Error: {mse}')

    # Save the trained model to the same directory as the script
    model_filename = os.path.join(os.path.dirname(__file__), 'student_performance_model1.pkl')
    with open(model_filename, 'wb') as f:
        pickle.dump(model, f)

    print("Model saved to 'student_performance_model1.pkl'.")


# Load the trained model
def load_model():
    """
    Load the trained model from the saved file.
    """
    try:
        # Define the model file path
        model_filename = os.path.join(os.path.dirname(__file__), 'student_performance_model1.pkl')

        with open(model_filename, 'rb') as f:
            model = pickle.load(f)

        print("Model loaded successfully.")
    except FileNotFoundError:
        # If the model doesn't exist, print an error message
        print("Model file not found. Please train the model first.")
        model = None
    return model


# Make a prediction using the trained model
def predict_performance(features):
    """
    Make a prediction based on the provided features using the trained model.
    """
    model = load_model()
    if model:
        prediction = model.predict([features])
        return prediction[0]
    else:
        print("Model not available for prediction.")
        return None


# Main function to train the model if it doesn't exist
if __name__ == "__main__":
    features, target = load_data()  # Load and preprocess the data
    train_model(features, target)  # Train and save the model
