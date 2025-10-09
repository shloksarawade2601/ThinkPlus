// User data (stored in memory)
let userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  totalExams: 12,
  completedExams: 8,
  avgScore: 85,
  totalTime: "4.5h",
  recentActivity: [
    { title: "JavaScript Basics", score: 92, date: "2 days ago" },
    { title: "HTML & CSS Quiz", score: 88, date: "5 days ago" },
    { title: "Node.js Fundamentals", score: 76, date: "1 week ago" }
  ]
};

// Available exams with more details
const availableExams = [
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    description: "Master the basics of JavaScript programming",
    questions: 20,
    duration: "30 minutes",
    passingScore: 70,
    difficulty: "easy"
  },
  {
    id: "react-advanced",
    title: "React Advanced Concepts",
    description: "Deep dive into React hooks, context, and patterns",
    questions: 25,
    duration: "45 minutes",
    passingScore: 75,
    difficulty: "medium"
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Comprehensive test on DSA concepts",
    questions: 30,
    duration: "60 minutes",
    passingScore: 80,
    difficulty: "hard"
  },
  {
    id: "html-css",
    title: "HTML & CSS Mastery",
    description: "Test your web design fundamentals",
    questions: 20,
    duration: "30 minutes",
    passingScore: 70,
    difficulty: "easy"
  },
  {
    id: "nodejs",
    title: "Node.js Backend Development",
    description: "Server-side JavaScript with Node.js",
    questions: 25,
    duration: "40 minutes",
    passingScore: 75,
    difficulty: "medium"
  },
  {
    id: "python-basics",
    title: "Python Programming Basics",
    description: "Introduction to Python programming",
    questions: 20,
    duration: "30 minutes",
    passingScore: 70,
    difficulty: "easy"
  }
];

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  loadAvailableExams();
  setupEventListeners();
});

// Initialize dashboard data
function initializeDashboard() {
  // Update welcome message
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
  }

  // Update user avatar
  const userAvatar = document.getElementById('userAvatar');
  if (userAvatar) {
    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    userAvatar.textContent = initials;
  }

  // Update stats
  updateStats();
}

// Update statistics
function updateStats() {
  document.getElementById('totalExams').textContent = userData.totalExams;
  document.getElementById('completedExams').textContent = userData.completedExams;
  document.getElementById('avgScore').textContent = userData.avgScore + '%';
  document.getElementById('totalTime').textContent = userData.totalTime;
}

// Load available exams dynamically
function loadAvailableExams() {
  const container = document.getElementById('examsGrid');
  if (!container) return;

  container.innerHTML = '';

  availableExams.forEach(exam => {
    const card = document.createElement('div');
    card.classList.add('exam-card');
    
    const difficultyClass = exam.difficulty;
    const difficultyText = exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1);
    
    card.innerHTML = `
      <div class="exam-header">
        <div class="exam-title">
          <h4>${exam.title}</h4>
        </div>
        <span class="exam-badge ${difficultyClass}">${difficultyText}</span>
      </div>
      <div class="exam-details">
        <div class="exam-detail">
          <span>Questions:</span> ${exam.questions}
        </div>
        <div class="exam-detail">
          <span>Duration:</span> ${exam.duration}
        </div>
        <div class="exam-detail">
          <span>Passing Score:</span> ${exam.passingScore}%
        </div>
      </div>
      <button class="btn-start-exam" onclick="startExam('${exam.id}')">Start Exam</button>
    `;
    
    container.appendChild(card);
  });
}

// Start exam function
function startExam(examId) {
  // Find the exam
  const exam = availableExams.find(e => e.id === examId);
  
  if (!exam) {
    alert('Exam not found!');
    return;
  }

  // Store exam ID for the exam page
  const examData = {
    examId: examId,
    examTitle: exam.title,
    questions: exam.questions,
    duration: exam.duration,
    passingScore: exam.passingScore,
    difficulty: exam.difficulty
  };
  
  // Store in memory by passing as URL parameter
  const params = new URLSearchParams(examData);
  window.location.href = `start_exam.html?${params.toString()}`;
}

// View insights for specific exam
function viewExamInsights(examId) {
  const exam = availableExams.find(e => e.id === examId);
  
  if (!exam) {
    alert('Exam not found!');
    return;
  }

  // Navigate to insights page with exam ID
  window.location.href = `insights.html?examId=${examId}`;
}

// Setup event listeners
function setupEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Navigation links
  const navLinks = document.querySelectorAll('.navbar-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      this.classList.add('active');
    });
  });
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear any stored data
    userData = null;
    
    // Redirect to login/index page
    window.location.href = 'index.html';
  }
}

// Update user profile data
function updateUserProfile(name, email) {
  userData.name = name;
  userData.email = email;
  
  // Update UI
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
  }

  const userAvatar = document.getElementById('userAvatar');
  if (userAvatar) {
    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    userAvatar.textContent = initials;
  }
}

// Get user data
function getUserData() {
  return userData;
}

// Add completed exam to history
function addCompletedExam(examTitle, score) {
  userData.completedExams++;
  userData.totalExams++;
  
  // Recalculate average score
  const totalScore = userData.avgScore * (userData.completedExams - 1) + score;
  userData.avgScore = Math.round(totalScore / userData.completedExams);
  
  // Add to recent activity
  userData.recentActivity.unshift({
    title: examTitle,
    score: score,
    date: "Just now"
  });
  
  // Keep only last 5 activities
  if (userData.recentActivity.length > 5) {
    userData.recentActivity.pop();
  }
  
  // Update stats display
  updateStats();
}

// Export functions for use in other pages
window.dashboardFunctions = {
  startExam,
  viewExamInsights,
  getUserData,
  updateUserProfile,
  addCompletedExam
};