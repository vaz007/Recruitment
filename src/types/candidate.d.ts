interface JobPosting {
  id: string;
  title: string;
  description: string;
  profile: string;
  applicableCandidates: string[]; // candidate IDs
}

interface Candidate {
  id: string;
  name: string;
  rawText: string;
  skills: string[];
  yearsOfExperience: number;
  matchScore: number;
  highlights: string;
}



export interface Candidate {
    id: string;
    name: string;
    skills: string[];
    yearsOfExperience: number;
    matchScore: number; // 0-100
    highlights: string; // 1-line summary
    fullDetails?: string; // Full parsed text (optional for Modal)
    rawText: string; // Raw text from CV
  }
  
  export interface JobDescription {
    id: string;
    title: string;
    description: string;
    text: string;
    profile: jdProfile,
    applicableCandidates: string[]; // <-- Add this
  }
  
  export interface CVParseResult {
    name: string;
    skills: string[];
    yearsOfExperience: number;
    highlights: string;
    fullDetails: string;
  }
  