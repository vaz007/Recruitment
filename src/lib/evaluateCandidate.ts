import { getCVMatchScore } from "../lib/openai";
import { Candidate } from "../types/candidate";
import { JobDescription } from "../types/jobDescription";

export async function evaluateCandidate(
  candidate: Candidate,
  jobDescription: JobDescription
): Promise<Candidate> {
  const {score, explanation, skills, yearsOfExperience } = await getCVMatchScore(candidate.rawText, jobDescription.profile);
    console.log(score, explanation )
  return {
    ...candidate,
    matchScore: score,
    highlights: explanation,
    skills,
    yearsOfExperience,
  };
}
