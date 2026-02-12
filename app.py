"""
AI Diagnosis Application
A Flask-based web application for medical diagnosis based on symptoms
"""

from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Disease database with symptoms and possible diagnoses
DISEASE_DATABASE = {
    'Common Cold': {
        'symptoms': ['runny nose', 'sneezing', 'sore throat', 'cough', 'mild fever', 'fatigue'],
        'severity': 'Low',
        'description': 'A viral infection affecting the upper respiratory tract',
        'recommendations': [
            'Get plenty of rest',
            'Stay hydrated',
            'Use over-the-counter cold medications',
            'Consult a doctor if symptoms persist beyond 10 days'
        ]
    },
    'Influenza (Flu)': {
        'symptoms': ['high fever', 'body aches', 'fatigue', 'headache', 'cough', 'sore throat', 'chills'],
        'severity': 'Medium',
        'description': 'A viral infection that attacks the respiratory system',
        'recommendations': [
            'Rest and stay home',
            'Drink plenty of fluids',
            'Take antiviral medications if prescribed',
            'Seek medical attention if symptoms worsen'
        ]
    },
    'Seasonal Allergies': {
        'symptoms': ['sneezing', 'runny nose', 'itchy eyes', 'watery eyes', 'congestion'],
        'severity': 'Low',
        'description': 'Allergic reaction to pollen, dust, or other environmental allergens',
        'recommendations': [
            'Avoid allergen triggers',
            'Use antihistamines',
            'Keep windows closed during high pollen counts',
            'Consider seeing an allergist'
        ]
    },
    'Migraine': {
        'symptoms': ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances'],
        'severity': 'Medium',
        'description': 'A neurological condition causing intense headaches',
        'recommendations': [
            'Rest in a dark, quiet room',
            'Apply cold compress to head',
            'Take prescribed migraine medications',
            'Identify and avoid triggers'
        ]
    },
    'Gastroenteritis': {
        'symptoms': ['diarrhea', 'nausea', 'vomiting', 'stomach cramps', 'mild fever', 'fatigue'],
        'severity': 'Medium',
        'description': 'Inflammation of the digestive tract, often called stomach flu',
        'recommendations': [
            'Stay hydrated with clear fluids',
            'Eat bland foods when tolerated',
            'Rest',
            'Seek medical attention if severe dehydration occurs'
        ]
    },
    'Anxiety': {
        'symptoms': ['nervousness', 'rapid heartbeat', 'sweating', 'difficulty concentrating', 'restlessness', 'fatigue'],
        'severity': 'Medium',
        'description': 'Mental health condition characterized by excessive worry',
        'recommendations': [
            'Practice relaxation techniques',
            'Regular exercise',
            'Adequate sleep',
            'Consider therapy or counseling'
        ]
    },
    'Bronchitis': {
        'symptoms': ['persistent cough', 'mucus production', 'fatigue', 'shortness of breath', 'chest discomfort', 'mild fever'],
        'severity': 'Medium',
        'description': 'Inflammation of the bronchial tubes in the lungs',
        'recommendations': [
            'Rest and drink fluids',
            'Use a humidifier',
            'Avoid lung irritants',
            'See a doctor if symptoms persist'
        ]
    },
    'Urinary Tract Infection': {
        'symptoms': ['burning sensation during urination', 'frequent urination', 'cloudy urine', 'pelvic pain', 'strong-smelling urine'],
        'severity': 'Medium',
        'description': 'Bacterial infection affecting the urinary system',
        'recommendations': [
            'Drink plenty of water',
            'Take antibiotics as prescribed',
            'Urinate frequently',
            'Seek medical attention for proper diagnosis'
        ]
    }
}

# List of all possible symptoms
ALL_SYMPTOMS = sorted(list(set(
    symptom for disease in DISEASE_DATABASE.values() 
    for symptom in disease['symptoms']
)))


class AIDiagnosisSystem:
    """AI-powered diagnosis system that analyzes symptoms and suggests possible conditions"""
    
    def __init__(self, disease_database):
        self.disease_database = disease_database
    
    def diagnose(self, symptoms):
        """
        Analyze symptoms and return possible diagnoses ranked by match score
        
        Args:
            symptoms: List of symptom strings
            
        Returns:
            List of diagnosis dictionaries with disease info and match scores
        """
        if not symptoms:
            return []
        
        diagnoses = []
        symptoms_lower = [s.lower().strip() for s in symptoms]
        
        for disease_name, disease_info in self.disease_database.items():
            disease_symptoms = [s.lower() for s in disease_info['symptoms']]
            
            # Calculate match score
            matched_symptoms = [s for s in symptoms_lower if s in disease_symptoms]
            
            if matched_symptoms:
                # Match percentage based on user's symptoms
                match_score = (len(matched_symptoms) / len(symptoms_lower)) * 100
                
                # Confidence score considering disease symptom coverage
                confidence = (len(matched_symptoms) / len(disease_symptoms)) * 100
                
                # Combined score
                overall_score = (match_score * 0.6 + confidence * 0.4)
                
                diagnoses.append({
                    'disease': disease_name,
                    'match_score': round(match_score, 1),
                    'confidence': round(confidence, 1),
                    'overall_score': round(overall_score, 1),
                    'matched_symptoms': matched_symptoms,
                    'severity': disease_info['severity'],
                    'description': disease_info['description'],
                    'recommendations': disease_info['recommendations']
                })
        
        # Sort by overall score
        diagnoses.sort(key=lambda x: x['overall_score'], reverse=True)
        
        return diagnoses


# Initialize AI diagnosis system
ai_diagnosis_system = AIDiagnosisSystem(DISEASE_DATABASE)


@app.route('/')
def index():
    """Home page with symptom checker"""
    return render_template('index.html', symptoms=ALL_SYMPTOMS)


@app.route('/diagnose', methods=['POST'])
def diagnose():
    """Process symptoms and return diagnosis"""
    data = request.get_json()
    symptoms = data.get('symptoms', [])
    
    if not symptoms:
        return jsonify({'error': 'Please select at least one symptom'}), 400
    
    # Get diagnosis from AI system
    diagnoses = ai_diagnosis_system.diagnose(symptoms)
    
    return jsonify({
        'symptoms': symptoms,
        'diagnoses': diagnoses
    })


@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')


if __name__ == '__main__':
    # Create templates and static directories if they don't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    # Use environment variable for debug mode (default to False for security)
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
