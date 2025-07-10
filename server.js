const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-frontend.vercel.app', 'https://codesye.vercel.app']
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// In-memory storage for demo (replace with database in production)
const users = new Map();
const reviews = new Map();
const sessions = new Map();

// Initialize sample data
const initializeSampleData = () => {
  // Sample users
  const sampleUsers = [
    {
      id: 'user-1',
      username: 'alex_coder',
      email: 'alex@stanford.edu',
      password: '$2a$10$hashedpassword',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'user-2',
      username: 'sarah_dev',
      email: 'sarah@mit.edu',
      password: '$2a$10$hashedpassword',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 'user-3',
      username: 'mike_ml',
      email: 'mike@berkeley.edu',
      password: '$2a$10$hashedpassword',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 'user-4',
      username: 'emma_web',
      email: 'emma@cmu.edu',
      password: '$2a$10$hashedpassword',
      createdAt: new Date('2024-02-10')
    }
  ];

  sampleUsers.forEach(user => {
    users.set(user.email, user);
  });

  // Sample code reviews
  const sampleReviews = [
    {
      id: 'review-1',
      userId: 'user-1',
      username: 'alex_coder',
      code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Test cases
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7)); // 3
console.log(binarySearch(arr, 10)); // -1`,
      language: 'javascript',
      problemTitle: 'Binary Search Implementation',
      problemDescription: 'Implement binary search algorithm to find a target element in a sorted array. Return the index if found, -1 if not found.',
      analysis: {
        quality_score: 9,
        issues: [
          {
            type: 'style',
            description: 'Consider adding input validation',
            line: 1,
            suggestion: 'Add checks for null/undefined input'
          }
        ],
        recommendations: [
          'Add input validation for edge cases',
          'Consider using Math.floor for better performance',
        ],
        overall_assessment: 'Excellent implementation of binary search algorithm. Clean, efficient code with O(log n) time complexity.',
        learning_tips: ['Binary search is fundamental for understanding algorithms', 'Practice drawing out the algorithm']
      },
      createdAt: new Date('2024-03-15T10:30:00'),
      comments: [
        {
          id: 'comment-1',
          userId: 'user-2',
          username: 'sarah_dev',
          content: 'Great implementation! Very clean and efficient.',
          line: null,
          createdAt: new Date('2024-03-15T11:00:00')
        }
      ]
    },
    {
      id: 'review-2',
      userId: 'user-2',
      username: 'sarah_dev',
      code: `import React, { useState } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');

    const addTodo = () => {
        if (input.trim()) {
            setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
            setInput('');
        }
    };

    return (
        <div>
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={addTodo}>Add Todo</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                ))}
            </ul>
        </div>
    );
}`,
      language: 'javascript',
      problemTitle: 'React Todo List',
      problemDescription: 'Create a simple todo list component using React hooks.',
      analysis: {
        quality_score: 7,
        issues: [
          {
            type: 'functionality',
            description: 'Missing delete functionality',
            line: 15,
            suggestion: 'Add a delete button for each todo'
          }
        ],
        recommendations: [
          'Add delete functionality',
          'Add completion toggle',
          'Add input validation',
        ],
        overall_assessment: 'Good basic implementation of a React todo list. Uses hooks correctly but missing some essential features.',
        learning_tips: ['Practice with React hooks', 'Think about user experience']
      },
      createdAt: new Date('2024-03-14T15:20:00'),
      comments: []
    },
    {
      id: 'review-3',
      userId: 'user-3',
      username: 'mike_ml',
      code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test
print(fibonacci(10))`,
      language: 'python',
      problemTitle: 'Fibonacci Sequence',
      problemDescription: 'Implement the Fibonacci sequence using recursion.',
      analysis: {
        quality_score: 6,
        issues: [
          {
            type: 'performance',
            description: 'Exponential time complexity',
            line: 1,
            suggestion: 'Use memoization or iterative approach'
          }
        ],
        recommendations: [
          'Use memoization to improve performance',
          'Consider iterative approach for large numbers',
          'Add input validation',
        ],
        overall_assessment: 'Correct implementation but inefficient for large numbers. Good for learning recursion.',
        learning_tips: ['Understand time complexity', 'Learn about memoization']
      },
      createdAt: new Date('2024-03-13T09:45:00'),
      comments: []
    }
  ];

  sampleReviews.forEach(review => {
    reviews.set(review.id, review);
  });

  console.log('✅ Sample data initialized with', sampleUsers.length, 'users and', sampleReviews.length, 'reviews');
};

// Initialize sample data
initializeSampleData();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const user = sessions.get(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StudentCode API is running' });
});

// Demo login endpoint
app.post('/api/demo-login', (req, res) => {
  const { userType } = req.body;
  
  const demoUsers = {
    'alex': 'alex@stanford.edu',
    'sarah': 'sarah@mit.edu', 
    'mike': 'mike@berkeley.edu',
    'emma': 'emma@cmu.edu'
  };

  const email = demoUsers[userType];
  if (!email) {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  const user = users.get(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const token = `demo-token-${user.id}-${Date.now()}`;
  sessions.set(token, user);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// Get all reviews
app.get('/api/reviews', authenticateToken, (req, res) => {
  try {
    const allReviews = Array.from(reviews.values()).map(review => ({
      id: review.id,
      userId: review.userId,
      username: review.username,
      code: review.code,
      language: review.language,
      problemTitle: review.problemTitle,
      problemDescription: review.problemDescription,
      analysis: review.analysis,
      createdAt: review.createdAt,
      comments: review.comments
    }));

    res.json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get single review
app.get('/api/reviews/:id', authenticateToken, (req, res) => {
  try {
    const review = reviews.get(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// Create new review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { code, language, problemTitle, problemDescription } = req.body;
    
    if (!code || !language || !problemTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate AI analysis
    const analysis = await generateCodeAnalysis(code, language, problemDescription);

    const review = {
      id: `review-${Date.now()}`,
      userId: req.user.id,
      username: req.user.username,
      code,
      language,
      problemTitle,
      problemDescription: problemDescription || '',
      analysis,
      createdAt: new Date(),
      comments: []
    };

    reviews.set(review.id, review);
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Add comment to review
app.post('/api/reviews/:id/comments', authenticateToken, (req, res) => {
  try {
    const { content, line } = req.body;
    const review = reviews.get(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const comment = {
      id: `comment-${Date.now()}`,
      userId: req.user.id,
      username: req.user.username,
      content,
      line,
      createdAt: new Date()
    };

    review.comments.push(comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// AI Code Analysis
async function generateCodeAnalysis(code, language, problemDescription) {
  try {
    const prompt = `You are an expert code reviewer helping computer science students improve their coding skills. 

Analyze the following ${language} code and provide detailed feedback:

Code:
${code}

Problem Description: ${problemDescription || 'No specific problem description provided'}

Please provide a comprehensive analysis including:
1. Quality score (1-10)
2. Specific issues found (with line numbers if applicable)
3. Recommendations for improvement
4. Overall assessment
5. Learning tips for the student

Format your response as a JSON object with the following structure:
{
  "quality_score": number,
  "issues": [
    {
      "type": "style|performance|security|logic",
      "description": "description of the issue",
      "line": number or null,
      "suggestion": "specific suggestion for improvement"
    }
  ],
  "recommendations": ["array of improvement suggestions"],
  "overall_assessment": "comprehensive assessment of the code",
  "learning_tips": ["array of learning tips for the student"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return {
      quality_score: 5,
      issues: [],
      recommendations: ['Unable to analyze code at this time'],
      overall_assessment: 'Analysis temporarily unavailable',
      learning_tips: ['Try again later']
    };
  }
}

// Enhanced code analysis endpoint (Grammarly-style)
app.post('/api/analyze', authenticateToken, async (req, res) => {
  try {
    const { code, language, problemTitle, problemDescription, skillLevel = 'intermediate' } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    console.log(`🔍 Analyzing ${language} code for ${skillLevel} level`);

    const analysis = await generateEnhancedCodeAnalysis(code, language, problemDescription, skillLevel);
    
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

async function generateEnhancedCodeAnalysis(code, language, problemDescription, skillLevel) {
  const systemPrompt = `You are an expert code reviewer and programming mentor, similar to Grammarly but for code. Analyze the provided code and give comprehensive feedback.

CONTEXT:
- Language: ${language}
- Skill Level: ${skillLevel}
- Problem: ${problemDescription || 'General code review'}

ANALYSIS REQUIREMENTS:
1. Quality Score (1-10): Rate overall code quality
2. Suggestions: Provide specific, actionable suggestions with:
   - Type: error, warning, suggestion, style
   - Title: Short descriptive title
   - Description: Detailed explanation
   - Line: Approximate line number (if applicable)
   - Original: The problematic code snippet
   - Replacement: The improved code snippet
3. Time Complexity: Estimate the Big-O time complexity of the main function or algorithm, and explain why.
4. Space Complexity: Estimate the Big-O space complexity, and explain why.
5. Learning Tips: Educational insights for the student's skill level
6. Overall Assessment: Brief summary

RESPONSE FORMAT (JSON):
{
  "quality_score": 8,
  "suggestions": [
    {
      "type": "suggestion",
      "title": "Add input validation",
      "description": "Consider adding checks for edge cases",
      "line": 1,
      "original": "function example(x) {",
      "replacement": "function example(x) {\n  if (x === null || x === undefined) return null;"
    }
  ],
  "time_complexity": "O(n)",
  "time_complexity_explanation": "The function iterates through the array once...",
  "space_complexity": "O(n)",
  "space_complexity_explanation": "A set is used to store up to n elements...",
  "learning_tips": [
    "Always validate inputs in production code",
    "Consider edge cases when designing functions"
  ],
  "overall_assessment": "Good code with room for improvement in error handling"
}

Focus on being educational and encouraging, especially for ${skillLevel} level students.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please analyze this ${language} code:\n\n${code}` }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    
    try {
      const analysis = JSON.parse(response);
      
      // Ensure all required fields are present
      return {
        quality_score: analysis.quality_score || 5,
        suggestions: analysis.suggestions || [],
        time_complexity: analysis.time_complexity || 'N/A',
        time_complexity_explanation: analysis.time_complexity_explanation || '',
        space_complexity: analysis.space_complexity || 'N/A',
        space_complexity_explanation: analysis.space_complexity_explanation || '',
        learning_tips: analysis.learning_tips || [],
        overall_assessment: analysis.overall_assessment || 'Code analysis complete',
        timestamp: new Date().toISOString()
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return {
        quality_score: 5,
        suggestions: [],
        time_complexity: 'N/A',
        time_complexity_explanation: '',
        space_complexity: 'N/A',
        space_complexity_explanation: '',
        learning_tips: ['Try to write more descriptive variable names', 'Consider adding comments to explain complex logic'],
        overall_assessment: 'Code analysis completed with basic feedback',
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze code');
  }
}

// WebSocket for real-time collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-review', (reviewId) => {
    socket.join(reviewId);
    console.log(`User ${socket.id} joined review ${reviewId}`);
  });

  socket.on('leave-review', (reviewId) => {
    socket.leave(reviewId);
    console.log(`User ${socket.id} left review ${reviewId}`);
  });

  socket.on('new-comment', (data) => {
    socket.to(data.reviewId).emit('comment-added', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Progress tracking endpoint
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's analysis history
    const userAnalyses = Array.from(reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Calculate statistics
    const totalAnalyses = userAnalyses.length;
    const averageScore = totalAnalyses > 0 
      ? userAnalyses.reduce((sum, review) => sum + review.analysis.quality_score, 0) / totalAnalyses 
      : 0;

    // Calculate improvement trend (comparing first 3 vs last 3 analyses)
    let improvementTrend = 0;
    if (userAnalyses.length >= 6) {
      const firstThree = userAnalyses.slice(0, 3);
      const lastThree = userAnalyses.slice(-3);
      const firstAvg = firstThree.reduce((sum, review) => sum + review.analysis.quality_score, 0) / 3;
      const lastAvg = lastThree.reduce((sum, review) => sum + review.analysis.quality_score, 0) / 3;
      improvementTrend = lastAvg - firstAvg;
    }

    // Language breakdown
    const languages = {};
    userAnalyses.forEach(review => {
      if (!languages[review.language]) {
        languages[review.language] = { count: 0, totalScore: 0 };
      }
      languages[review.language].count++;
      languages[review.language].totalScore += review.analysis.quality_score;
    });

    // Calculate average scores for each language
    Object.keys(languages).forEach(lang => {
      languages[lang].averageScore = languages[lang].totalScore / languages[lang].count;
    });

    // Weekly progress (last 7 days)
    const weeklyProgress = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayAnalyses = userAnalyses.filter(review => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate >= dayStart && reviewDate <= dayEnd;
      });

      weeklyProgress.push({
        date: dayStart.toISOString().split('T')[0],
        count: dayAnalyses.length
      });
    }

    // Achievements
    const achievements = [];
    if (totalAnalyses > 0) achievements.push('first_analysis');
    if (improvementTrend >= 2) achievements.push('quality_improver');
    if (Object.keys(languages).length >= 3) achievements.push('polyglot');
    if (weeklyProgress.filter(day => day.count > 0).length >= 7) achievements.push('consistency');

    res.json({
      totalAnalyses,
      averageScore,
      improvementTrend,
      languages,
      achievements,
      weeklyProgress
    });
  } catch (error) {
    console.error('Progress tracking error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
}); 