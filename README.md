![Logo](logo.png)

REMSync is a web-based sleep tracking app designed to help users improve their sleep hygiene through consistent logging, feedback, and gamifaction. The app integrates healthcare standards using FHIR, and also includes ML powered algorithms, analyzing sleep data.

## Features

### Core Functionality
- User Accounts: Register or log in to create a personalized sleep dashboard
- Sleep Logging: Record sleep duration and quality
- Dashboard: View last sleep sessions with real-time stats
- Recaps: Visualizations and graphs covering user's sleep activity

### ML Insights
- Machine Learning algorithms to analyze sleep data and select personalized stats
- Analysis on sleep data, trends, and overall healthcare

### FHIR Integration
- FHIR Observation Generation: User sleep logs are turned into valid FHIR Observation objects
- Download or Sync to Server: App can either download the Observation JSON to the local machine, or sync up with a test FHIR server to demonstrate functionality

### Gamification
- Badges: Users can earn badges by logging consistent sleep 
- Ranks: Included ranking systems to motivate user to strive for healthy sleep habits

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database - Postgresql
- ML - Python
- Health interpolation - HL7 FHIR Observation

## Deployment 
- Frontend: Vercel
- Backend: Railway
- Database: Neon DB

## Authors

- [Sam Warner](https://github.gatech.edu/swarner37) - Full Stack Development, Frontend + Backend Dev, UI Design, ML modeling, FHIR integration
- Rui He - ML
- Vanshika Reddy - Frontend
- Yi Zhu - ML
# View the site here: [REMSync](https://rem-sync-deploy.vercel.app/)
