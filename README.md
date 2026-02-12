# AI Medical Diagnosis Application 🏥

An intelligent web-based symptom checker that uses AI to analyze symptoms and provide possible diagnoses with health recommendations.

## 🌟 Features

- **AI-Powered Analysis**: Advanced symptom matching algorithm that considers multiple factors
- **Comprehensive Database**: Includes common medical conditions with detailed symptom mappings
- **User-Friendly Interface**: Clean, modern, and responsive design
- **Instant Results**: Get ranked diagnoses with match scores and confidence levels
- **Health Recommendations**: Receive actionable health advice for each possible diagnosis
- **Search Functionality**: Quickly find symptoms from an extensive list
- **Educational Tool**: Learn about various medical conditions and their symptoms

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/samyakkumarsingh/Uhack.git
cd Uhack
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

For development with debug mode:
```bash
FLASK_DEBUG=true python app.py
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

## 📖 How to Use

1. **Select Symptoms**: Browse or search through the symptom list and check all that apply to you
2. **Get Diagnosis**: Click the "Get AI Diagnosis" button to analyze your symptoms
3. **Review Results**: View possible conditions ranked by match score and confidence
4. **Read Recommendations**: Follow the health advice provided for each diagnosis
5. **Consult a Professional**: Always seek medical advice from a qualified healthcare provider

## 🏗️ Project Structure

```
Uhack/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── README.md                   # Project documentation
├── .gitignore                 # Git ignore rules
├── templates/                 # HTML templates
│   ├── index.html            # Home page with symptom checker
│   └── about.html            # About page
└── static/                    # Static assets
    ├── css/
    │   └── style.css         # Application styles
    └── js/
        └── main.js           # Client-side JavaScript
```

## 🧠 How It Works

The AI diagnosis system uses an intelligent matching algorithm that:

1. **Analyzes Symptoms**: Compares user-selected symptoms against a medical database
2. **Calculates Match Scores**: Determines what percentage of user symptoms match each condition
3. **Computes Confidence**: Evaluates how well the symptoms cover the known symptoms of each condition
4. **Ranks Results**: Orders diagnoses by overall score (combining match and confidence)
5. **Provides Recommendations**: Offers specific health advice for each possible diagnosis

### Algorithm Details

- **Match Score**: Percentage of user's symptoms that match a condition
- **Confidence Score**: Percentage of condition's symptoms that were reported by user
- **Overall Score**: Weighted combination (60% match + 40% confidence)

## 🗄️ Medical Database

Currently includes information about:
- Common Cold
- Influenza (Flu)
- Seasonal Allergies
- Migraine
- Gastroenteritis
- Anxiety
- Bronchitis
- Urinary Tract Infection

Each condition includes:
- Symptom list
- Severity level
- Detailed description
- Health recommendations

## ⚠️ Important Disclaimer

**This application is for educational and informational purposes only.**

- NOT a substitute for professional medical advice, diagnosis, or treatment
- Always seek advice from qualified healthcare providers
- Never disregard professional medical advice
- In case of emergency, call emergency services immediately

## 🛠️ Technology Stack

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with modern design patterns
- **Architecture**: MVC pattern with RESTful API

## 🔧 API Endpoints

### `GET /`
Home page with symptom checker interface

### `POST /diagnose`
Analyzes symptoms and returns diagnoses

**Request Body:**
```json
{
  "symptoms": ["fever", "cough", "fatigue"]
}
```

**Response:**
```json
{
  "symptoms": ["fever", "cough", "fatigue"],
  "diagnoses": [
    {
      "disease": "Common Cold",
      "match_score": 66.7,
      "confidence": 50.0,
      "overall_score": 60.0,
      "matched_symptoms": ["cough", "fatigue"],
      "severity": "Low",
      "description": "...",
      "recommendations": ["..."]
    }
  ]
}
```

### `GET /about`
Information about the application

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📝 License

This project is created for educational purposes as part of the Uhack hackathon.

## 👥 Authors

Uhack Team

## 🙏 Acknowledgments

- Built with Flask and modern web technologies
- Designed for the Uhack hackathon
- Created to demonstrate AI applications in healthcare

---

**Remember**: This is an educational tool. Always consult healthcare professionals for medical concerns.
