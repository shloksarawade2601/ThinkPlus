from flask import Flask, jsonify
from flask_cors import CORS
import random
import csv
import os

app = Flask(__name__)
CORS(app)  # Allow requests from your website

# --- CONFIGURATION ---
CSV_FILE_PATH = 'questions.csv'  # Update this path to your CSV file location
TOTAL_QUESTIONS = 30
DIFFICULTY_ALLOCATION = {"Easy": 6, "Medium": 9, "Hard": 9, "Expert": 6}

# Global variable to store questions
questions_db = None

def load_questions_from_csv():
    """Load questions from CSV file into memory"""
    global questions_db
    
    try:
        questions_db = []
        
        # Read CSV file without pandas
        with open(CSV_FILE_PATH, 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            
            for row in csv_reader:
                if len(row) >= 7:  # Ensure row has all required columns
                    questions_db.append({
                        'id': row[0],
                        'topic': row[1],
                        'difficulty': row[2],
                        'question': row[3],
                        'options': row[4],
                        'answer': row[5],
                        'explanation': row[6]
                    })
        
        print(f"✅ Successfully loaded {len(questions_db)} questions from CSV")
        return True
        
    except FileNotFoundError:
        print(f"❌ Error: CSV file not found at {CSV_FILE_PATH}")
        print("Please ensure the CSV file is in the correct location.")
        return False
    except Exception as e:
        print(f"❌ Error loading CSV: {str(e)}")
        return False

def get_random_questions_by_difficulty(difficulty, count):
    """Get random questions of a specific difficulty level"""
    # Filter questions by difficulty (case-insensitive)
    filtered = [q for q in questions_db if q['difficulty'].lower() == difficulty.lower()]
    
    if len(filtered) < count:
        print(f"⚠️ Warning: Not enough {difficulty} questions. Need {count}, found {len(filtered)}")
        # Return all available questions if not enough
        return filtered
    
    # Randomly select required number of questions
    return random.sample(filtered, count)

def format_question(q_data, question_id):
    """Format question data into the required structure"""
    # Parse options - they're in format "['opt1', 'opt2', 'opt3', 'opt4']"
    options_str = q_data['options']
    
    # Remove brackets and quotes, then split by comma
    if isinstance(options_str, str):
        # Remove the outer brackets and split
        options_str = options_str.strip("[]'\"")
        options = [opt.strip().strip("'\"") for opt in options_str.split("','")]
    else:
        options = ["Option A", "Option B", "Option C", "Option D"]
    
    return {
        'id': question_id,
        'question': q_data['question'],
        'options': options,
        'answer': str(q_data['answer']).strip(),
        'topic': q_data['topic'],
        'difficulty': q_data['difficulty'],
        'explanation': str(q_data.get('explanation', 'No explanation provided.')).strip()
    }

@app.route('/generate-questions', methods=['GET'])
def generate_questions():
    """Generate 30 random exam questions from CSV"""
    
    # Load questions if not already loaded
    if questions_db is None:
        if not load_questions_from_csv():
            return jsonify({
                "success": False,
                "error": "Failed to load questions from CSV file",
                "message": f"Please ensure {CSV_FILE_PATH} exists and is properly formatted"
            }), 500
    
    try:
        all_questions = []
        
        # Get questions for each difficulty level
        for difficulty, count in DIFFICULTY_ALLOCATION.items():
            questions = get_random_questions_by_difficulty(difficulty, count)
            all_questions.extend(questions)
        
        # Check if we have enough questions
        if len(all_questions) < TOTAL_QUESTIONS:
            return jsonify({
                "success": False,
                "error": "Not enough questions in database",
                "message": f"Need {TOTAL_QUESTIONS} questions but only found {len(all_questions)}"
            }), 400
        
        # Shuffle questions to randomize order
        random.shuffle(all_questions)
        
        # Format questions with sequential IDs
        formatted_questions = [
            format_question(q, idx + 1) 
            for idx, q in enumerate(all_questions[:TOTAL_QUESTIONS])
        ]
        
        return jsonify({
            "success": True,
            "total_questions": len(formatted_questions),
            "questions": formatted_questions
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "An error occurred while generating questions"
        }), 500

@app.route('/reload-questions', methods=['GET'])
def reload_questions():
    """Reload questions from CSV (useful for updates)"""
    global questions_db
    questions_db = None
    
    if load_questions_from_csv():
        return jsonify({
            "success": True,
            "message": f"Successfully reloaded {len(questions_db)} questions from CSV"
        })
    else:
        return jsonify({
            "success": False,
            "message": "Failed to reload questions"
        }), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get statistics about available questions"""
    if questions_db is None:
        load_questions_from_csv()
    
    if questions_db is None:
        return jsonify({
            "success": False,
            "error": "Questions database not loaded"
        }), 500
    
    # Count questions by difficulty
    difficulty_counts = {}
    topic_counts = {}
    
    for q in questions_db:
        diff = q['difficulty']
        topic = q['topic']
        
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
        topic_counts[topic] = topic_counts.get(topic, 0) + 1
    
    return jsonify({
        "success": True,
        "total_questions": len(questions_db),
        "by_difficulty": difficulty_counts,
        "by_topic": topic_counts,
        "required_per_exam": DIFFICULTY_ALLOCATION
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "CSV-Based Exam Generator API is running!",
        "endpoints": {
            "/generate-questions": "Generate a new exam",
            "/reload-questions": "Reload questions from CSV",
            "/stats": "Get question database statistics"
        },
        "csv_file": CSV_FILE_PATH
    })

if __name__ == '__main__':
    # Load questions on startup
    print("🚀 Starting Exam Generator API...")
    print(f"📁 Looking for questions in: {CSV_FILE_PATH}")
    load_questions_from_csv()
    
    app.run(debug=True, host='0.0.0.0', port=5000)