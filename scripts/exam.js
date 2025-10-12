// Exam.js - Handle Exam Taking functionality

// Check if user is logged in
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/';
}

// Get exam ID from localStorage
const examId = localStorage.getItem('currentExamId');
if (!examId) {
    alert('No exam selected');
    window.location.href = '/dashboard';
}

// Sample exam questions (will be replaced with API call later)
const sampleQuestions = [
    {
        id: 1,
        question: "What is the value of x in the equation: 2x + 5 = 15?",
        options: ["x = 5", "x = 10", "x = 7.5", "x = 20"],
        correctAnswer: 0
    },
    {
        id: 2,
        question: "Which of the following is a prime number?",
        options: ["15", "17", "21", "27"],
        correctAnswer: 1
    },
    {
        id: 3,
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2
    },
    {
        id: 4,
        question: "Solve: 3² + 4² = ?",
        options: ["12", "25", "49", "7"],
        correctAnswer: 1
    },
    {
        id: 5,
        question: "What is 15% of 200?",
        options: ["20", "25", "30", "35"],
        correctAnswer: 2
    },
    {
        id: 6,
        question: "Which number is divisible by both 3 and 4?",
        options: ["18", "20", "24", "28"],
        correctAnswer: 2
    },
    {
        id: 7,
        question: "What is the perimeter of a rectangle with length 8 and width 5?",
        options: ["13", "26", "40", "80"],
        correctAnswer: 1
    },
    {
        id: 8,
        question: "Solve: 100 ÷ 4 × 2 = ?",
        options: ["12.5", "25", "50", "200"],
        correctAnswer: 2
    },
    {
        id: 9,
        question: "What is the area of a circle with radius 5? (Use π ≈ 3.14)",
        options: ["31.4", "78.5", "157", "314"],
        correctAnswer: 1
    },
    {
        id: 10,
        question: "Which of these fractions is equivalent to 0.75?",
        options: ["1/4", "2/3", "3/4", "4/5"],
        correctAnswer: 2
    },
    {
        id: 11,
        question: "What is 7 × 8?",
        options: ["54", "56", "63", "64"],
        correctAnswer: 1
    },
    {
        id: 12,
        question: "If a triangle has angles 60°, 60°, and 60°, what type of triangle is it?",
        options: ["Right triangle", "Equilateral triangle", "Isosceles triangle", "Scalene triangle"],
        correctAnswer: 1
    },
    {
        id: 13,
        question: "What is the next number in the sequence: 2, 4, 8, 16, __?",
        options: ["24", "28", "32", "64"],
        correctAnswer: 2
    },
    {
        id: 14,
        question: "What is 20% of 50?",
        options: ["5", "10", "15", "20"],
        correctAnswer: 1
    },
    {
        id: 15,
        question: "How many sides does a hexagon have?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1
    },
    {
        id: 16,
        question: "What is the value of π (pi) approximately?",
        options: ["2.14", "3.14", "4.14", "5.14"],
        correctAnswer: 1
    },
    {
        id: 17,
        question: "Solve: 45 - 18 = ?",
        options: ["23", "27", "33", "37"],
        correctAnswer: 1
    },
    {
        id: 18,
        question: "What is 5³ (5 cubed)?",
        options: ["15", "25", "75", "125"],
        correctAnswer: 3
    },
    {
        id: 19,
        question: "Convert 2.5 hours to minutes:",
        options: ["125 minutes", "130 minutes", "150 minutes", "250 minutes"],
        correctAnswer: 2
    },
    {
        id: 20,
        question: "What is the sum of angles in a triangle?",
        options: ["90°", "180°", "270°", "360°"],
        correctAnswer: 1
    }
];

// Exam state
let currentQuestionIndex = 0;
let userAnswers = new Array(sampleQuestions.length).fill(null);
let timeRemaining = 30 * 60; // 30 minutes in seconds
let timerInterval;

// Initialize exam
function initExam() {
    document.getElementById('totalQuestions').textContent = sampleQuestions.length;
    displayQuestion();
    startTimer();
    updateNavigationButtons();
}

// Display current question
function displayQuestion() {
    const question = sampleQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('questionContainer');
    
    const optionsHTML = question.options.map((option, index) => {
        const isSelected = userAnswers[currentQuestionIndex] === index;
        return `
            <div class="option ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${index})">
                <input type="radio" name="answer" value="${index}" ${isSelected ? 'checked' : ''}>
                <label>${option}</label>
            </div>
        `;
    }).join('');
    
    questionContainer.innerHTML = `
        <h2>Question ${currentQuestionIndex + 1}</h2>
        <p class="question-text">${question.question}</p>
        <div class="options-container">
            ${optionsHTML}
        </div>
    `;
    
    // Update progress
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    updateProgressBar();
}

// Select answer
function selectAnswer(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    displayQuestion(); // Re-render to show selection
}

// Make selectAnswer available globally
window.selectAnswer = selectAnswer;

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Warning when 5 minutes left
        if (timeRemaining === 300) {
            alert('Warning: Only 5 minutes remaining!');
        }
        
        // Auto-submit when time runs out
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Your exam will be submitted automatically.');
            submitExam();
        }
    }, 1000);
}

// Navigation buttons
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateNavigationButtons();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateNavigationButtons();
    }
});

// Update navigation buttons visibility
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
    
    // Show submit button on last question
    if (currentQuestionIndex === sampleQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Submit exam
document.getElementById('submitBtn').addEventListener('click', () => {
    const unansweredCount = userAnswers.filter(answer => answer === null).length;
    
    if (unansweredCount > 0) {
        const confirmSubmit = confirm(
            `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
        );
        if (!confirmSubmit) return;
    }
    
    submitExam();
});

// Submit exam function
function submitExam() {
    clearInterval(timerInterval);
    
    // Calculate score
    let correctAnswers = 0;
    sampleQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctAnswers++;
        }
    });
    
    const score = Math.round((correctAnswers / sampleQuestions.length) * 100);
    
    // Store results
    const examResults = {
        examId: examId,
        questions: sampleQuestions,
        userAnswers: userAnswers,
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: sampleQuestions.length,
        timeTaken: (30 * 60) - timeRemaining,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('lastExamResult', JSON.stringify(examResults));
    
    // Redirect to results page
    window.location.href = '/results.html';
}

// Prevent accidental page close
window.addEventListener('beforeunload', (e) => {
    if (timeRemaining > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Initialize exam when page loads
document.addEventListener('DOMContentLoaded', initExam);