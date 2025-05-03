# AI Candidate Leaderboard

A modern web application built with Next.js and TypeScript that helps recruiters evaluate and rank candidates based on their CVs and job descriptions using AI-powered analysis.

## Features

- **CV Upload & Parsing**: Upload and parse PDF CVs to extract candidate information
- **Job Description Management**: Create and manage job descriptions
- **AI-Powered Evaluation**: Automatically evaluate candidates against job descriptions
- **Candidate Leaderboard**: View and sort candidates based on their match scores
- **Modern UI**: Built with Material-UI for a professional and responsive interface
- **Real-time Updates**: Instant feedback on candidate evaluations

## Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Data Grid**: AG Grid
- **PDF Processing**: pdf-parse
- **AI Integration**: Groq API
- **State Management**: React Context API
- **Styling**: Emotion

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── context/         # React context providers
├── lib/             # Utility functions and services
├── theme/           # MUI theme configuration
└── types/           # TypeScript type definitions
```

## Components and Context

### RecruitmentContext
The central state management system for the application:

- **State Management**:
  - `jobDescription`: Array of job descriptions
  - `candidates`: Array of candidates
  - `setJobDescription`: Function to add new job descriptions
  - `addCandidate`: Function to add new candidates
  - `setCandidates`: Function to update candidates list
  - `resetAll`: Function to reset all data

- **Key Features**:
  - Persists data in localStorage
  - Automatically matches candidates with job descriptions based on skills
  - Maintains synchronization between candidates and job descriptions
  - Handles skill matching and filtering logic

### Components

#### UploadCVButton
A component for uploading and processing CVs:
- **Features**:
  - PDF file upload functionality
  - Parses CV text using `parsePDFClient`
  - Evaluates candidates against job descriptions
  - Shows success notification after upload
  - Uses Material-UI for styling

#### JDForm
A comprehensive form for managing job descriptions:
- **Features**:
  - Job title and description input fields
  - AG Grid table to display existing job descriptions
  - Automatic profile generation using AI
  - Skill extraction and matching
  - Responsive layout with Material-UI
  - Pagination and sorting capabilities

#### Leaderboard
The main display component for candidate rankings:
- **Features**:
  - AG Grid table for candidate display
  - Sorting by match score
  - Expandable job description view
  - Integration with UploadCVButton
  - Candidate detail modal trigger
  - Responsive design with Material-UI

#### CandidateDetailModal
A modal component for displaying detailed candidate information:
- **Features**:
  - Displays candidate name, match score, skills, and experience
  - Clean, modern UI with Material-UI
  - Responsive layout
  - Easy-to-read information presentation

### Component Interactions

1. **Data Flow**:
   - `RecruitmentContext` serves as the central data store
   - All components access and update data through the context
   - Data persistence is handled through localStorage

2. **User Workflow**:
   - Users first create job descriptions using `JDForm`
   - They can then upload CVs using `UploadCVButton`
   - The `Leaderboard` displays ranked candidates
   - Users can view detailed candidate information in `CandidateDetailModal`

3. **State Management**:
   - All components subscribe to the `RecruitmentContext`
   - Updates to candidates or job descriptions trigger re-renders
   - Skill matching happens automatically when new data is added

4. **UI/UX Features**:
   - Consistent Material-UI design across components
   - Responsive layouts
   - Interactive tables with sorting and filtering
   - Clear feedback mechanisms (notifications, modals)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ai-candidate-leaderboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Groq API key:
   ```
   NEXT_PUBLIC_GROQ_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Environment Variables

- `NEXT_PUBLIC_GROQ_API_KEY`: Your Groq API key for AI-powered evaluations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GROQ for providing the AI capabilities
- Next.js team for the amazing framework
- Material-UI for the beautiful components
