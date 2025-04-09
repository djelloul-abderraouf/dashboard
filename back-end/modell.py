import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import classification_report
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pandas as pd
from sklearn.pipeline import Pipeline

import os
file_path = os.path.join(os.path.dirname(__file__), 'dataset.csv')


# Step 1: Load the data
try:
    data = pd.read_csv(file_path)
except FileNotFoundError:
    print("File not found. Please check the file name or path.")
    exit()

# Step 2: Rename columns for clarity (if needed)
if data.columns[0].startswith('Unnamed') or data.columns[0].isdigit():
    columns = [
        "StudentID", "Age", "Gender", "Ethnicity", "ParentalEducation",
        "StudyTimeWeekly", "Absences", "Tutoring", "ParentalSupport",
        "Extracurricular", "Sports", "Music", "Volunteering", "GPA", "GradeClass"
    ]
    data.columns = columns

# Step 3: Select features and targets
features = ['Age', 'Gender', 'StudyTimeWeekly', 'ParentalSupport', 'GPA']
X = data[features]
y = data[['Sports', 'Music', 'Volunteering', 'Extracurricular']]

# Step 4: Handle categorical variables
if X['Gender'].dtype == 'object' or len(X['Gender'].unique()) < 10:
    # Identify categorical and numerical columns
    categorical_features = ['Gender']
    numerical_features = ['Age', 'StudyTimeWeekly', 'ParentalSupport', 'GPA']
    
    # Create preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(drop='first', sparse_output=False), categorical_features)
        ])
else:
    # If Gender is already encoded as numeric
    preprocessor = StandardScaler()

# Step 5: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Step 6 & 7: Create a pipeline with preprocessing and model
# Option 1: Logistic Regression with class weights
base_model = LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced')

# Option 2: Random Forest Classifier (uncomment to use)
# base_model = RandomForestClassifier(random_state=42, class_weight='balanced')

# Create pipeline with preprocessing and model
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', MultiOutputClassifier(base_model))
])

# Fit the pipeline
pipeline.fit(X_train, y_train)

# Step 8: Make predictions on test data
y_pred = pipeline.predict(X_test)

# Step 9: Evaluate the model
for i, activity in enumerate(['Sports', 'Music', 'Volunteering', 'Extracurricular']):
    print(f"--- {activity} ---")
    print(classification_report(y_test.iloc[:, i], y_pred[:, i], zero_division=0))

# Step 10: Save the trained pipeline to a file


# Set the path for the model file
model_filename = os.path.join(os.path.dirname(__file__), 'student_activity_pipeline.pkl')

# Save the model using pickle
with open(model_filename, 'wb') as f:
    pickle.dump(pipeline, f)


print(f" Model and preprocessing pipeline saved to '{model_filename}'.")