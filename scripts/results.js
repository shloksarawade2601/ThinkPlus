// Result.js - Display Exam Results

// Check if user is logged in
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/';
}

// Get exam results from localStorage
const examResults = JSON.parse(localStorage.getItem('lastExamResult'));

if (!examResults) {
    alert('No exam results found');
    window.location.href = '/dashboard';
}

// Sample exam names mapping (will be replaced with API data later)
const examNames = {
    '1': 'Mathematics - Algebra Basics',
    '2': 'Physics - Newton\'s Laws',
    '3': 'Chemistry - Organic Chemistry',
    '4': 'Biology - Cell Structure',
    '5': 'English - Grammar & Comprehension',
    '6': 'History - World War II'
};

// Handle logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    });
}

// Function to format time in MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Function to determine result status
function getResultStatus(score) {
    if (score >= 90) return { text: 'Excellent!', class: 'excellent' };
    if (score >= 75) return { text: 'Passed!', class: 'passed' };
    if (score >= 60) return { text: 'Average', class: 'average' };
    return { text: 'Failed', class: 'failed' };
}

// Display results
function displayResults() {
    const { score, correctAnswers, totalQuestions, timeTaken, examId } = examResults;
    
    // Display score with animation
    const scoreValue = document.getElementById('scoreValue');
    const scorePercent = document.querySelector('.score-percent');
    const resultStatus = document.getElementById('resultStatus');
    const scoreCircle = document.querySelector('.score-circle');
    
    // Animate score counting up
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
        if (currentScore <= score) {
            scoreValue.textContent = currentScore;
            currentScore++;
        } else {
            clearInterval(scoreInterval);
        }
    }, 20);
    
    // Set result status with color
    const status = getResultStatus(score);
    resultStatus.textContent = status.text;
    resultStatus.className = `result-status ${status.class}`;
    
    // Color the score circle based on performance
    if (score >= 75) {
        scoreCircle.style.borderColor = '#4CAF50'; // Green
    } else if (score >= 60) {
        scoreCircle.style.borderColor = '#FFA726'; // Orange
    } else {
        scoreCircle.style.borderColor = '#EF5350'; // Red
    }
    
    // Display correct answers
    document.getElementById('correctAnswers').textContent = `${correctAnswers}/${totalQuestions}`;
    
    // Display time taken
    document.getElementById('timeTaken').textContent = formatTime(timeTaken);
    
    // Display exam name
    const examName = examNames[examId] || 'Unknown Exam';
    document.getElementById('examName').textContent = examName;
    
    // Store result in exam history (for insights page later)
    storeExamHistory();
}

// Store exam result in history
function storeExamHistory() {
    const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
    
    const resultSummary = {
        examId: examResults.examId,
        examName: examNames[examResults.examId] || 'Unknown Exam',
        score: examResults.score,
        correctAnswers: examResults.correctAnswers,
        totalQuestions: examResults.totalQuestions,
        timeTaken: examResults.timeTaken,
        timestamp: examResults.timestamp,
        date: new Date(examResults.timestamp).toLocaleDateString()
    };
    
    history.push(resultSummary);
    
    // Keep only last 20 results
    if (history.length > 20) {
        history.shift();
    }
    
    localStorage.setItem('examHistory', JSON.stringify(history));
}

// Add confetti effect for excellent performance
function showConfetti() {
    if (examResults.score >= 90) {
        // Simple confetti effect (you can enhance this)
        const resultCard = document.querySelector('.result-card');
        resultCard.style.animation = 'celebrate 1s ease-in-out';
    }
}

// Initialize results display
document.addEventListener('DOMContentLoaded', () => {
    displayResults();
    showConfetti();
});

// Future: Function to submit results to API
async function submitResultsToAPI() {
    try {
        const response = await fetch('/api/exam/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(examResults)
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Results submitted successfully:', data);
        } else {
            console.error('Failed to submit results');
        }
    } catch (error) {
        console.error('Error submitting results:', error);
    }
}

// Future: Function to fetch detailed analytics
async function fetchDetailedAnalytics() {
    try {
        const response = await fetch(`/api/exam/${examResults.examId}/analytics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const analytics = await response.json();
            return analytics;
        }
    } catch (error) {
        console.error('Error fetching analytics:', error);
    }
}