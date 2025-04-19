import pickle
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import random
from fastapi.middleware.cors import CORSMiddleware

with open("sleep_apnea_model_simple.pkl", "rb") as f:
    model = pickle.load(f)

with open("sleep_apnea_encoder_simple.pkl", "rb") as f:
    encoder = pickle.load(f)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SleepData(BaseModel):
    age: float
    sleep_duration: float
    quality: float
    activity: float

def generate_tips(age, sleep_duration, quality, activity):
    tips = []
    if sleep_duration < 7:
        sleep_tips = [
            "Try to maintain a consistent sleep schedule, even on weekends.",
            "Reduce screen time an hour before bed.",
            "Establish a bedtime routine to improve sleep onset."
        ]
        tips.extend(random.sample(sleep_tips, k=min(2, len(sleep_tips))))

    if quality < 6:
        quality_tips = [
            "Avoid caffeine close to bedtime.",
            "Use blackout curtains to reduce light in your room.",
            "Make your bedroom cooler and quieter to improve sleep quality."
        ]
        tips.extend(random.sample(quality_tips, k=min(2, len(quality_tips))))

    if activity < 50:
        activity_tips = [
            "Try light exercises like yoga daily.",
            "Exercise improves sleep quality and duration.",
            "Aim for at least 30 minutes of moderate movement each day."
        ]
        tips.extend(random.sample(activity_tips, k=min(2, len(activity_tips))))

    if age > 50:
        age_tips = [
            "Limit long naps during the day to improve sleep.",
            "Stay mentally active to maintain healthy sleep patterns.",
            "Get daylight exposure to help regulate your circadian rhythm."
        ]
        tips.extend(random.sample(age_tips, k=min(2, len(age_tips))))

    if not tips:
        tips.append("You're on a great track! Keep maintaining your healthy habits.")
    random.shuffle(tips)
    return tips[:4]

# endpoint
@app.post("/predict")
def predict(data: SleepData):
    features = np.array([[data.age, data.sleep_duration, data.quality, data.activity]])
    prediction_encoded = model.predict(features)[0]
    prediction_label = encoder.inverse_transform([prediction_encoded])[0]
    tips = generate_tips(data.age, data.sleep_duration, data.quality, data.activity)
    return {
        "prediction": prediction_label,
        "tips": tips
    }

@app.post("/ml/tips")
def get_only_tips(data: SleepData):
    tips = generate_tips(data.age, data.sleep_duration, data.quality, data.activity)
    return {"tips": tips}