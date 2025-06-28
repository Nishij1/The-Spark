# Project Spark 🚀

**Ignite your coding potential with AI-powered project management and code generation.**

A modern, full-stack web application that transforms learning into action by generating personalized DIY project ideas using AI. Turn any concept, lecture transcript, or uploaded document into actionable coding projects with comprehensive project management tools.

## ✨ Features

### 🔐 Authentication & User Management
- **Firebase Authentication** with email/password and Google OAuth
- Secure user profiles and session management
- Protected routes and real-time user state
- Seamless login/signup experience

### 🤖 AI-Powered Project Generation
- **Concept-to-Project Generation** - Transform any learning concept into actionable projects
- **Transcript Processing** - Upload lecture notes, PDFs, or documents for project ideas
- **File Upload Support** - Process TXT, PDF, and DOCX files with automatic text extraction
- **Multi-Language Code Generation** - Generate code in JavaScript, Python, Java, C++, and more
- **Smart Project Structuring** - AI creates detailed project descriptions and implementation guides

### 📁 File Processing Capabilities
- **Drag & Drop Interface** - Modern file upload with visual feedback
- **Multiple File Formats** - Support for TXT, PDF, and DOCX files (up to 10MB)
- **Automatic Text Extraction** - Extract readable content from uploaded documents
- **Error Handling** - Comprehensive validation and user-friendly error messages
- **Integration** - Seamlessly integrate extracted text with AI project generation

### 📊 Comprehensive Project Management
- **Full CRUD Operations** - Create, read, update, and delete projects
- **Real-time Synchronization** - Instant updates across all devices using Firestore
- **Advanced Filtering** - Filter by status (active, completed, paused) and technology
- **Smart Search** - Search across project names, descriptions, and tags
- **Project Details** - View comprehensive project information with timestamps
- **Status Tracking** - Monitor project progress and completion

### 🎨 Modern UI/UX Experience
- **Fully Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode Toggle** - System preference detection with manual override
- **Smooth Animations** - Framer Motion animations throughout the interface
- **Toast Notifications** - Real-time feedback for all user actions
- **Loading States** - Visual feedback during API calls and data processing
- **Error Boundaries** - Graceful error handling and recovery

## 🛠️ Tech Stack

### Frontend Architecture
- **React 19** - Latest React with modern hooks, concurrent features, and improved performance
- **Vite** - Lightning-fast development server with HMR and optimized builds
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Production-ready motion library for smooth animations
- **React Router v6** - Declarative routing for single-page applications
- **Heroicons & Lucide React** - Beautiful, customizable SVG icons

### Backend & Cloud Services
- **Firebase Authentication** - Secure user authentication with multiple providers
- **Cloud Firestore** - Real-time NoSQL database with offline support
- **Google Gemini API** - Advanced AI for code generation and project structuring
- **Firebase Security Rules** - Database-level security and access control
- **Firebase Hosting** - Fast, secure web hosting (deployment ready)

### AI & File Processing
- **Google Gemini Pro** - Large language model for intelligent code generation
- **Custom File Processors** - Text extraction from PDF, DOCX, and TXT files
- **Rate Limiting** - Smart API usage management and error handling
- **Content Validation** - Input sanitization and validation

### Development & Build Tools
- **ESLint** - Code quality enforcement with React and accessibility rules
- **PostCSS & Autoprefixer** - CSS processing and browser compatibility
- **Hot Module Replacement** - Instant feedback during development
- **Environment Variables** - Secure configuration management

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm/yarn
- **Firebase project** with Authentication and Firestore enabled
- **Google Gemini API key** for AI features (optional - demo mode available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Project Spark"
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `frontend` directory:
   ```env
   # Firebase Configuration (Required)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Google Gemini API (Optional - enables AI features)
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # Optional: Enable Firebase Emulators for development
   VITE_USE_FIREBASE_EMULATOR=false
   ```

4. **Firebase Configuration**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase (if not already done)
   firebase init
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   🎉 **Application available at `http://localhost:5173`**

### Quick Setup Guide

**Option 1: Full Setup (Recommended)**
- Complete Firebase setup with your own project
- Get Gemini API key for full AI functionality
- Deploy Firestore security rules

**Option 2: Demo Mode**
- Use provided Firebase demo configuration
- Limited AI functionality without Gemini API key
- Perfect for testing the interface and basic features

## 📁 Project Architecture

```
Project Spark/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── auth/           # Authentication (Login, Signup, ProtectedRoute)
│   │   │   ├── ai/             # AI components (CodeGenerator)
│   │   │   ├── projects/       # Project management (ProjectCard, Modals)
│   │   │   ├── FileUpload.jsx  # File upload with drag-and-drop
│   │   │   ├── Toast.jsx       # Notification system
│   │   │   ├── Navbar.jsx      # Navigation component
│   │   │   └── ErrorBoundary.jsx # Error handling
│   │   ├── context/            # React context providers
│   │   │   ├── AuthContext.jsx # Authentication state management
│   │   │   └── ThemeContext.jsx # Dark/light mode management
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.js      # Authentication hook
│   │   │   ├── useProjects.js  # Project management hook
│   │   │   ├── useGemini.js    # AI integration hook
│   │   │   └── useToast.js     # Notification hook
│   │   ├── pages/              # Main application pages
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Dashboard.jsx   # Main dashboard with AI tools
│   │   │   ├── Projects.jsx    # Project management page
│   │   │   ├── Login.jsx       # Authentication pages
│   │   │   └── Signup.jsx
│   │   ├── services/           # External service integrations
│   │   │   ├── firestore.js    # Firestore database operations
│   │   │   └── gemini.js       # Google Gemini API integration
│   │   ├── utils/              # Utility functions
│   │   │   ├── fileProcessor.js # File upload and text extraction
│   │   │   └── testFirebase.js # Firebase connection testing
│   │   ├── config/             # Configuration files
│   │   │   └── firebase.js     # Firebase initialization
│   │   └── App.jsx             # Main application component
│   ├── public/                 # Static assets and favicon
│   ├── firestore.rules        # Firestore security rules
│   ├── .env.example           # Environment variables template
│   └── package.json           # Dependencies and scripts
└── README.md                  # Project documentation
```

## 🔧 Detailed Configuration

### Firebase Setup (Required)

1. **Create Firebase Project**
   ```bash
   # Visit https://console.firebase.google.com
   # Create new project or use existing one
   ```

2. **Enable Authentication**
   - Go to Authentication → Sign-in method
   - Enable Email/Password and Google providers
   - Configure authorized domains for production

3. **Setup Firestore Database**
   ```bash
   # Create Firestore database in production mode
   # Deploy security rules from frontend/firestore.rules
   firebase deploy --only firestore:rules
   ```

4. **Required Collections** (Auto-created on first use)
   - `users` - User profiles and preferences
   - `projects` - User projects and metadata
   - `generations` - AI generation history
   - `templates` - Project templates (optional)

### Google Gemini API Setup (Optional)

1. **Get API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API key
   - Copy key to environment variables

2. **API Features Enabled**
   - Code generation in multiple languages
   - Project structure generation from concepts
   - Text analysis and processing
   - Smart project recommendations

3. **Demo Mode**
   - App works without Gemini API key
   - Limited AI functionality
   - Perfect for testing and development

## 🚀 Deployment Guide

### Build for Production
```bash
# Install dependencies
npm install

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

#### Option 1: Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy to Firebase
firebase deploy
```

#### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 3: Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
# Or connect GitHub repository for automatic deployments
```

### Environment Variables for Production
Ensure all environment variables are configured in your hosting platform:

**Required Variables:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

**Optional Variables:**
- `VITE_GEMINI_API_KEY` (for AI features)
- `VITE_USE_FIREBASE_EMULATOR` (development only)

## 🧪 Testing & Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing Features
1. **Authentication Flow**
   - Sign up with email/password
   - Login with Google OAuth
   - Protected route navigation

2. **Project Management**
   - Create projects manually
   - Generate projects from concepts
   - Upload files and extract text
   - Edit and delete projects

3. **AI Features**
   - Code generation in multiple languages
   - Project structure generation
   - File processing and text extraction

4. **UI/UX Testing**
   - Dark/light mode toggle
   - Responsive design on different devices
   - Toast notifications and error handling

### Development Tips
- Use browser dev tools to monitor Firebase operations
- Check console for detailed debugging information
- Test file upload with different file types and sizes
- Verify Firestore security rules in Firebase Console

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
   ```bash
   git clone https://github.com/Nishij1/HRX29-Apophis.git
   cd project-spark
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit and push**
   ```bash
   git commit -m 'Add amazing feature'
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Describe your changes clearly
   - Include screenshots for UI changes
   - Reference any related issues

### Development Guidelines
- Use TypeScript for new components when possible
- Follow React best practices and hooks patterns
- Ensure responsive design for all new features
- Add proper error handling and loading states
- Include toast notifications for user actions

## 📞 Support & Troubleshooting

### Common Issues

**Firebase Connection Issues:**
```bash
# Check Firebase configuration
# Verify API keys in .env file
# Ensure Firestore rules are deployed
```

**File Upload Not Working:**
```bash
# Check file size (max 10MB)
# Verify supported file types (TXT, PDF, DOCX)
# Check browser console for errors
```

**AI Features Not Working:**
```bash
# Verify Gemini API key is set
# Check API quota and billing
# App works in demo mode without API key
```

### Getting Help
1. Check the [Issues](../../issues) page for known problems
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce
4. Provide browser and system information

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** - Backend infrastructure and real-time database
- **Google Gemini** - Advanced AI capabilities for code generation
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Ecosystem** - Modern frontend development
- **Vite** - Fast development and build tooling
- **Heroicons & Lucide** - Beautiful icon libraries

## 🌟 Features Roadmap

### Upcoming Features
- [ ] Real-time collaboration on projects
- [ ] Advanced project templates
- [ ] Integration with GitHub repositories
- [ ] Mobile app development
- [ ] Advanced AI code review
- [ ] Project sharing and community features

### Recent Updates
- [x] File upload and text extraction
- [x] Enhanced project management
- [x] Toast notification system
- [x] Improved error handling
- [x] Dark/light mode toggle
- [x] Responsive design optimization

---

**Built with ❤️ Team Apophis.**

*Transform your learning journey with AI-powered project generation. Start building, start learning, start sparking!* ✨
