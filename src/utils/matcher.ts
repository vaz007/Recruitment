import { Candidate } from '../types/candidate';

export function isCandidateApplicable(candidate: Candidate, jobProfile: string): boolean {
    const jdSkills = jobProfile
      .match(/[*•\-] (.+)/g)
      ?.map(s => s.replace(/[*•\-]\s*/, '').toLowerCase()) || [];
  
    const matchedSkills = candidate.skills.filter((skill:any) =>
      jdSkills.includes(skill.toLowerCase())
    );
  
    return matchedSkills.length >= 3; // You can change threshold
  }
  