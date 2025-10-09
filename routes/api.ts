// In-memory storage (replace with database in production)
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: string;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  description: string;
}

interface Question {
  id: string;
  examId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  score: number;
  totalQuestions: number;
  answers: { questionId: string; selectedAnswer: number }[];
  completedAt: string;
}

const users: User[] = [];
const exams: Exam[] = [
  {
    id: "1",
    title: "Mathematics Basics",
    subject: "Mathematics",
    duration: 30,
    totalQuestions: 10,
    description: "Test your knowledge of basic mathematics including algebra and geometry"
  },
  {
    id: "2",
    title: "Science Fundamentals",
    subject: "Science",
    duration: 45,
    totalQuestions: 15,
    description: "Covering physics, chemistry, and biology fundamentals"
  },
  {
    id: "3",
    title: "English Proficiency",
    subject: "English",
    duration: 40,
    totalQuestions: 12,
    description: "Grammar, vocabulary, and reading comprehension"
  }
];

const questions: Question[] = [
  // Math exam questions
  { id: "q1", examId: "1", question: "What is 15 + 27?", options: ["40", "42", "43", "45"], correctAnswer: 1 },
  { id: "q2", examId: "1", question: "Solve: 3x = 12. What is x?", options: ["3", "4", "5", "6"], correctAnswer: 1 },
  { id: "q3", examId: "1", question: "What is the square root of 64?", options: ["6", "7", "8", "9"], correctAnswer: 2 },
  { id: "q4", examId: "1", question: "What is 25% of 80?", options: ["15", "20", "25", "30"], correctAnswer: 1 },
  { id: "q5", examId: "1", question: "What is the area of a rectangle with length 5 and width 3?", options: ["8", "12", "15", "20"], correctAnswer: 2 },
  { id: "q6", examId: "1", question: "What is 7 × 8?", options: ["54", "56", "58", "60"], correctAnswer: 1 },
  { id: "q7", examId: "1", question: "What is 100 - 37?", options: ["61", "62", "63", "64"], correctAnswer: 2 },
  { id: "q8", examId: "1", question: "What is 144 ÷ 12?", options: ["10", "11", "12", "13"], correctAnswer: 2 },
  { id: "q9", examId: "1", question: "What is 2³?", options: ["6", "8", "9", "12"], correctAnswer: 1 },
  { id: "q10", examId: "1", question: "If a triangle has angles 60°, 60°, what is the third angle?", options: ["50°", "60°", "70°", "80°"], correctAnswer: 1 },
  
  // Science exam questions
  { id: "q11", examId: "2", question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correctAnswer: 0 },
  { id: "q12", examId: "2", question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: 1 },
  { id: "q13", examId: "2", question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], correctAnswer: 0 },
  { id: "q14", examId: "2", question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: 2 },
  { id: "q15", examId: "2", question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], correctAnswer: 1 },
  { id: "q16", examId: "2", question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correctAnswer: 1 },
  { id: "q17", examId: "2", question: "How many bones are in the human body?", options: ["196", "206", "216", "226"], correctAnswer: 1 },
  { id: "q18", examId: "2", question: "What is the smallest unit of life?", options: ["Atom", "Molecule", "Cell", "Tissue"], correctAnswer: 2 },
  { id: "q19", examId: "2", question: "What force keeps us on the ground?", options: ["Magnetism", "Friction", "Gravity", "Tension"], correctAnswer: 2 },
  { id: "q20", examId: "2", question: "What is the center of an atom called?", options: ["Electron", "Proton", "Neutron", "Nucleus"], correctAnswer: 3 },
  { id: "q21", examId: "2", question: "What is photosynthesis?", options: ["Breaking down food", "Converting light to energy", "Cell division", "DNA replication"], correctAnswer: 1 },
  { id: "q22", examId: "2", question: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Brain"], correctAnswer: 2 },
  { id: "q23", examId: "2", question: "What is H2O2?", options: ["Water", "Hydrogen Peroxide", "Oxygen", "Hydrogen"], correctAnswer: 1 },
  { id: "q24", examId: "2", question: "What type of blood cells fight infection?", options: ["Red", "White", "Platelets", "Plasma"], correctAnswer: 1 },
  { id: "q25", examId: "2", question: "What is the study of weather called?", options: ["Geology", "Astronomy", "Meteorology", "Biology"], correctAnswer: 2 },
  
  // English exam questions
  { id: "q26", examId: "3", question: "What is the plural of 'child'?", options: ["childs", "children", "childes", "childer"], correctAnswer: 1 },
  { id: "q27", examId: "3", question: "Which word is a verb?", options: ["beautiful", "run", "quickly", "happiness"], correctAnswer: 1 },
  { id: "q28", examId: "3", question: "What is a synonym for 'happy'?", options: ["sad", "angry", "joyful", "tired"], correctAnswer: 2 },
  { id: "q29", examId: "3", question: "Which sentence is correct?", options: ["He don't like it", "He doesn't like it", "He not like it", "He doesn't likes it"], correctAnswer: 1 },
  { id: "q30", examId: "3", question: "What is an antonym for 'hot'?", options: ["warm", "cold", "cool", "freezing"], correctAnswer: 1 },
  { id: "q31", examId: "3", question: "Which is a proper noun?", options: ["city", "London", "book", "teacher"], correctAnswer: 1 },
  { id: "q32", examId: "3", question: "What punctuation ends a question?", options: [".", "!", "?", ","], correctAnswer: 2 },
  { id: "q33", examId: "3", question: "Which word is an adjective?", options: ["run", "quickly", "beautiful", "happiness"], correctAnswer: 2 },
  { id: "q34", examId: "3", question: "What is the past tense of 'go'?", options: ["goed", "went", "gone", "going"], correctAnswer: 1 },
  { id: "q35", examId: "3", question: "Which sentence uses correct capitalization?", options: ["i like pizza", "I like Pizza", "I like pizza", "i Like pizza"], correctAnswer: 2 },
  { id: "q36", examId: "3", question: "What is a metaphor?", options: ["A comparison using like/as", "A direct comparison", "An exaggeration", "A sound word"], correctAnswer: 1 },
  { id: "q37", examId: "3", question: "Which word is spelled correctly?", options: ["recieve", "receive", "recive", "receeve"], correctAnswer: 1 }
];

const examResults: ExamResult[] = [];

// Helper function to generate JWT-like token
function generateToken(userId: string): string {
  return `token_${userId}_${Date.now()}`;
}

// Helper function to verify token
function verifyToken(token: string): string | null {
  if (token && token.startsWith("token_")) {
    const parts = token.split("_");
    return parts[1] || null;
  }
  return null;
}

export async function handleAPI(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  // CORS headers
  const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    // Auth endpoints
    if (pathname === "/api/auth/signup" && method === "POST") {
      const body = await req.json();
      const { name, email, password, phone } = body;

      // Check if user exists
      if (users.find(u => u.email === email)) {
        return new Response(JSON.stringify({ error: "User already exists" }), {
          status: 400,
          headers
        });
      }

      const user: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // In production, hash this!
        phone,
        createdAt: new Date().toISOString()
      };

      users.push(user);
      const token = generateToken(user.id);

      return new Response(JSON.stringify({
        message: "User created successfully",
        token,
        user: { id: user.id, name: user.name, email: user.email }
      }), { headers });
    }

    if (pathname === "/api/auth/login" && method === "POST") {
      const body = await req.json();
      const { email, password } = body;

      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers
        });
      }

      const token = generateToken(user.id);

      return new Response(JSON.stringify({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email }
      }), { headers });
    }

    // Get all exams
    if (pathname === "/api/exams" && method === "GET") {
      return new Response(JSON.stringify({ exams }), { headers });
    }

    // Get specific exam with questions
    if (pathname.startsWith("/api/exam/") && method === "GET") {
      const examId = pathname.split("/")[3];
      const exam = exams.find(e => e.id === examId);

      if (!exam) {
        return new Response(JSON.stringify({ error: "Exam not found" }), {
          status: 404,
          headers
        });
      }

      const examQuestions = questions.filter(q => q.examId === examId);

      return new Response(JSON.stringify({
        exam,
        questions: examQuestions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options
        }))
      }), { headers });
    }

    // Submit exam
    if (pathname === "/api/exam/submit" && method === "POST") {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      const userId = token ? verifyToken(token) : null;

      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers
        });
      }

      const body = await req.json();
      const { examId, answers } = body;

      const exam = exams.find(e => e.id === examId);
      if (!exam) {
        return new Response(JSON.stringify({ error: "Exam not found" }), {
          status: 404,
          headers
        });
      }

      // Calculate score
      let correctCount = 0;
      const examQuestions = questions.filter(q => q.examId === examId);

      answers.forEach((answer: { questionId: string; selectedAnswer: number }) => {
        const question = examQuestions.find(q => q.id === answer.questionId);
        if (question && question.correctAnswer === answer.selectedAnswer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / examQuestions.length) * 100);

      const result: ExamResult = {
        id: `result_${Date.now()}`,
        userId,
        examId,
        score,
        totalQuestions: examQuestions.length,
        answers,
        completedAt: new Date().toISOString()
      };

      examResults.push(result);

      return new Response(JSON.stringify({
        message: "Exam submitted successfully",
        result: {
          id: result.id,
          score: result.score,
          totalQuestions: result.totalQuestions,
          correctAnswers: correctCount
        }
      }), { headers });
    }

    // Get exam results
    if (pathname === "/api/results" && method === "GET") {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      const userId = token ? verifyToken(token) : null;

      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers
        });
      }

      const userResults = examResults.filter(r => r.userId === userId);
      const resultsWithExams = userResults.map(result => {
        const exam = exams.find(e => e.id === result.examId);
        return {
          id: result.id,
          examTitle: exam?.title || "Unknown",
          subject: exam?.subject || "Unknown",
          score: result.score,
          totalQuestions: result.totalQuestions,
          completedAt: result.completedAt
        };
      });

      return new Response(JSON.stringify({ results: resultsWithExams }), { headers });
    }

    // Get specific result details
    if (pathname.startsWith("/api/result/") && method === "GET") {
      const resultId = pathname.split("/")[3];
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      const userId = token ? verifyToken(token) : null;

      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers
        });
      }

      const result = examResults.find(r => r.id === resultId && r.userId === userId);

      if (!result) {
        return new Response(JSON.stringify({ error: "Result not found" }), {
          status: 404,
          headers
        });
      }

      const exam = exams.find(e => e.id === result.examId);
      const examQuestions = questions.filter(q => q.examId === result.examId);

      const detailedAnswers = result.answers.map(answer => {
        const question = examQuestions.find(q => q.id === answer.questionId);
        return {
          question: question?.question || "",
          options: question?.options || [],
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question?.correctAnswer,
          isCorrect: answer.selectedAnswer === question?.correctAnswer
        };
      });

      return new Response(JSON.stringify({
        result: {
          id: result.id,
          examTitle: exam?.title || "Unknown",
          subject: exam?.subject || "Unknown",
          score: result.score,
          totalQuestions: result.totalQuestions,
          completedAt: result.completedAt,
          answers: detailedAnswers
        }
      }), { headers });
    }

    // Get insights
    if (pathname === "/api/insights" && method === "GET") {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      const userId = token ? verifyToken(token) : null;

      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers
        });
      }

      const userResults = examResults.filter(r => r.userId === userId);
      const insights = userResults.map(result => {
        const exam = exams.find(e => e.id === result.examId);
        return {
          subject: exam?.subject || "Unknown",
          score: result.score,
          date: result.completedAt,
          topics: [] // Can be expanded based on question categories
        };
      });

      return new Response(JSON.stringify({ insights }), { headers });
    }

    // Get user profile
    if (pathname === "/api/profile" && method === "GET") {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      const userId = token ? verifyToken(token) : null;

      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers
        });
      }

      const user = users.find(u => u.id === userId);

      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers
        });
      }

      const userResults = examResults.filter(r => r.userId === userId);

      return new Response(JSON.stringify({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          totalExams: userResults.length
        }
      }), { headers });
    }

    // Update user profile
    if (pathname === "/api/profile" && method === "PUT") {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      const userId = token ? verifyToken(token) : null;

      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers
        });
      }

      const user = users.find(u => u.id === userId);

      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers
        });
      }

      const body = await req.json();
      const { name, phone } = body;

      if (name) user.name = name;
      if (phone) user.phone = phone;

      return new Response(JSON.stringify({
        message: "Profile updated successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      }), { headers });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers
    });
  }
}