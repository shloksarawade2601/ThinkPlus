from flask import Flask, jsonify
from flask_cors import CORS
import random
import csv
import os
import re

app = Flask(__name__)
CORS(app)  # Allow requests from your website

# --- CONFIGURATION ---
CSV_FILE_PATH = 'C:\TP\qgenerate\BLOCK_2_NumberSystem_Arranged.csv'  # Update this path to your CSV file location
TOTAL_QUESTIONS = 30
DIFFICULTY_ALLOCATION = {"Very Easy": 6, "Easy": 6, "Medium": 9, "Hard": 9}

# Global variable to store questions
questions_db = None

def parse_options(options_text):
    """
    Parse options from format like:
    "(a) 0 (b) 9 (c) 7 (d) 2"
    Returns: ['0', '9', '7', '2']
    """
    if not options_text or options_text == '-':
        return []
    
    # Pattern to match (a) text (b) text (c) text (d) text
    pattern = r'\([a-d]\)\s*([^(]+?)(?=\s*\([a-d]\)|$)'
    matches = re.findall(pattern, options_text, re.IGNORECASE)
    
    # Clean up each option
    options = [match.strip() for match in matches if match.strip()]
    
    return options

def parse_correct_answer(answer_text):
    """
    Parse correct answer from format like:
    "(a)" or "a" or "(a) 0"
    Returns: The option letter like 'a'
    """
    if not answer_text:
        return None
    
    # Extract letter from formats like "(a)" or "a" or "(a) Some text"
    match = re.search(r'\(?([a-d])\)?', answer_text.lower())
    if match:
        return match.group(1)
    
    return None

def load_questions_from_csv():
    """Load questions from CSV file into memory"""
    global questions_db
    
    try:
        questions_db = []
        
        # Read CSV file
        with open(CSV_FILE_PATH, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                # Map new CSV columns to our structure
                question_id = row.get('ID', '').strip()
                block = row.get('Block', '').strip()
                topic = row.get('Chapter / Subtopic', '').strip()
                question_type = row.get('Question Type', '').strip()
                question_text = row.get('Question Text', '').strip()
                data_paragraph = row.get('Data / Paragraph', '').strip()
                options_text = row.get('Options / Answer Choices', '').strip()
                correct_answer_raw = row.get('Correct Answer', '').strip()
                difficulty = row.get('Difficulty Level', '').strip()
                
                # Skip empty rows
                if not question_id or not question_text:
                    continue
                
                # Parse options and correct answer
                options = parse_options(options_text)
                correct_answer_letter = parse_correct_answer(correct_answer_raw)
                
                # Convert answer letter to actual option text
                answer_map = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
                if correct_answer_letter and correct_answer_letter in answer_map:
                    answer_index = answer_map[correct_answer_letter]
                    correct_answer = options[answer_index] if answer_index < len(options) else None
                else:
                    correct_answer = None
                
                # Build full question text (include data/paragraph if present)
                full_question = question_text
                if data_paragraph and data_paragraph != '-':
                    full_question = f"{data_paragraph}\n\n{question_text}"
                
                # Ensure we have exactly 4 options
                if len(options) < 4:
                    print(f"⚠️ Warning: Question {question_id} has only {len(options)} options")
                    while len(options) < 4:
                        options.append(f"Option {len(options) + 1}")
                elif len(options) > 4:
                    options = options[:4]
                
                question_obj = {
                    'id': question_id,
                    'block': block,
                    'topic': topic,
                    'question_type': question_type,
                    'difficulty': difficulty,
                    'question': full_question,
                    'options': options,
                    'answer': correct_answer,
                    'explanation': ''  # Can be added later if needed
                }
                
                questions_db.append(question_obj)
        
        print(f"✅ Successfully loaded {len(questions_db)} questions from CSV")
        
        # Print difficulty distribution
        difficulty_counts = {}
        for q in questions_db:
            diff = q['difficulty']
            difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
        
        print("📊 Questions by difficulty:")
        for diff, count in sorted(difficulty_counts.items()):
            print(f"   {diff}: {count}")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ Error: CSV file not found at {CSV_FILE_PATH}")
        print("Please ensure the CSV file is in the correct location.")
        return False
    except Exception as e:
        print(f"❌ Error loading CSV: {str(e)}")
        import traceback
        traceback.print_exc()
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
    return {
        'id': question_id,
        'question': q_data['question'],
        'options': q_data['options'],
        'answer': q_data['answer'],
        'topic': q_data['topic'],
        'difficulty': q_data['difficulty'],
        'explanation': q_data.get('explanation', 'No explanation provided.')
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
        import traceback
        traceback.print_exc()
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
    block_counts = {}
    
    for q in questions_db:
        diff = q['difficulty']
        topic = q['topic']
        block = q['block']
        
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
        topic_counts[topic] = topic_counts.get(topic, 0) + 1
        block_counts[block] = block_counts.get(block, 0) + 1
    
    return jsonify({
        "success": True,
        "total_questions": len(questions_db),
        "by_difficulty": difficulty_counts,
        "by_topic": topic_counts,
        "by_block": block_counts,
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
        "csv_file": CSV_FILE_PATH,
        "csv_format": {
            "columns": [
                "ID",
                "Block",
                "Chapter / Subtopic",
                "Question Type",
                "Question Text",
                "Data / Paragraph",
                "Options / Answer Choices",
                "Correct Answer",
                "Difficulty Level"
            ],
            "example": "Q001, Numbers, Number System, MCQ, Last digit of 81×82×83×…×89, -, (a) 0 (b) 9 (c) 7 (d) 2, (a), Very Easy"
        }
    })

if __name__ == '__main__':
    # Load questions on startup
    print("🚀 Starting Exam Generator API...")
    print(f"📁 Looking for questions in: {CSV_FILE_PATH}")
    load_questions_from_csv()
    
    app.run(debug=True, host='0.0.0.0', port=5000)