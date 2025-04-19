import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

# load dataset
df = pd.read_csv("sleep_apnea_data2.csv")
features = ['Age', 'Sleep Duration', 'Quality of Sleep', 'Physical Activity Level']
X = df[features]
y = df['Sleep Apnea']

encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

with open("sleep_apnea_model_simple.pkl", "wb") as f:
    pickle.dump(model, f)

with open("sleep_apnea_encoder_simple.pkl", "wb") as f:
    pickle.dump(encoder, f)

from sklearn.metrics import accuracy_score

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"\n Model Accuracy on Test Set: {accuracy:.2f}")