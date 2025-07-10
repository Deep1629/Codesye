# ✨ StudentCode - Grammarly for Code

**StudentCode** is an AI-powered code review assistant that provides real-time feedback, suggestions, and learning insights as you code - just like Grammarly does for writing.

## 🎯 What Makes StudentCode Different

### **Real-time Code Analysis**
- **Live feedback** as you type (with 2-second debouncing)
- **Context-aware suggestions** based on your skill level
- **Multiple programming languages** support
- **Quality scoring** with detailed breakdowns

### **Grammarly-Style Experience**
- **Smart suggestions** with one-click fixes
- **Learning insights** tailored to your level
- **Progress tracking** with achievements and trends
- **Educational explanations** for each suggestion

### **Student-Focused Features**
- **Skill level adaptation** (Beginner, Intermediate, Advanced)
- **Learning tips** and educational content
- **Progress visualization** with charts and stats
- **Achievement system** to gamify learning

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key

### Installation

1. **Clone and setup:**
```bash
git clone <repository-url>
cd studentcode
npm install
cd frontend && npm install
```

2. **Environment setup:**
```bash
cp env.example .env
# Add your OpenAI API key to .env
```

3. **Start the application:**
```bash
./start.sh
```

4. **Access the app:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🎮 Demo Users

Try the app with these demo users:

- **Alex Chen** (Stanford CS) - Algorithms & Data Structures
- **Sarah Johnson** (MIT CS) - Web Development & React
- **Mike Rodriguez** (Berkeley CS) - Machine Learning & Python
- **Emma Wilson** (CMU CS) - Systems Programming & C++

## ✨ Key Features

### **1. Real-time Code Analysis**
- Write code and get instant feedback
- Quality scoring (1-10 scale)
- Detailed issue identification
- Contextual suggestions

### **2. Smart Suggestions**
- **Error detection** (🔴 Critical issues)
- **Warning alerts** (🟡 Potential problems)
- **Style suggestions** (🎨 Code improvements)
- **Learning tips** (💡 Educational insights)

### **3. Progress Tracking**
- **Analysis history** and trends
- **Language proficiency** breakdown
- **Weekly activity** visualization
- **Achievement system** with badges

### **4. Multi-language Support**
- JavaScript/TypeScript
- Python
- Java
- C++
- C#
- Go
- Rust
- And more...

### **5. Skill Level Adaptation**
- **Beginner**: Focus on fundamentals and clear explanations
- **Intermediate**: Advanced patterns and best practices
- **Advanced**: Performance optimization and architecture

## 🏗️ Architecture

### **Frontend (React + Vite)**
- **CodeEditor**: Main interface with real-time analysis
- **ProgressTracker**: Learning progress and achievements
- **AuthContext**: User authentication and state management

### **Backend (Node.js + Express)**
- **AI Analysis**: OpenAI GPT-4 integration for code review
- **Progress Tracking**: User statistics and achievements
- **Real-time Features**: WebSocket support for collaboration

### **Key Endpoints**
- `POST /api/analyze` - Real-time code analysis
- `GET /api/progress` - User progress tracking
- `POST /api/reviews` - Save analysis history
- `POST /api/demo-login` - Demo user authentication

## 🎯 How It Works

### **1. Code Input**
- Select programming language and skill level
- Write or paste your code
- Add problem context (optional)

### **2. Real-time Analysis**
- AI analyzes code every 2 seconds (when typing)
- Identifies issues, suggestions, and improvements
- Provides quality score and learning insights

### **3. Smart Suggestions**
- Click on suggestions to see detailed explanations
- Apply fixes with one click
- Learn from educational content

### **4. Progress Tracking**
- View your improvement over time
- Track language proficiency
- Unlock achievements
- Monitor learning trends

## 🎨 UI/UX Features

### **Grammarly-Inspired Design**
- Clean, modern interface
- Real-time feedback indicators
- Intuitive suggestion system
- Progress visualization

### **Responsive Design**
- Works on desktop and mobile
- Adaptive layouts
- Touch-friendly interactions

### **Accessibility**
- Keyboard navigation
- Screen reader support
- High contrast options
- Clear visual hierarchy

## 🔧 Technical Stack

### **Frontend**
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Context API** - State management

### **Backend**
- **Node.js** - Runtime
- **Express** - Web framework
- **OpenAI API** - AI analysis
- **Socket.io** - Real-time features

### **Development**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart
- **CORS** - Cross-origin support

## 🚀 Deployment

### **Local Development**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### **Production**
```bash
# Build frontend
cd frontend && npm run build

# Start production server
npm start
```

## 🎯 Future Roadmap

### **Phase 1: Enhanced Analysis**
- [ ] Code complexity analysis
- [ ] Performance suggestions
- [ ] Security vulnerability detection
- [ ] Code style consistency

### **Phase 2: Learning Features**
- [ ] Personalized learning paths
- [ ] Interactive tutorials
- [ ] Code challenge integration
- [ ] Peer review system

### **Phase 3: Advanced Features**
- [ ] IDE plugin development
- [ ] Git integration
- [ ] Team collaboration
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the AI analysis capabilities
- **Grammarly** for inspiring the user experience design
- **React** and **Node.js** communities for excellent tooling

---

**Built with ❤️ for students learning to code** 