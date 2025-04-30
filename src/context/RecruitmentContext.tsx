"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Candidate, JobDescription } from "../types/candidate";

interface RecruitmentContextType {
  jobDescription: JobDescription[];
  candidates: Candidate[];
  setJobDescription: (jd: JobDescription) => void;
  addCandidate: (candidate: Candidate) => void;
  setCandidates: (candidates: Candidate[]) => void;
  resetAll: () => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(undefined);

export const RecruitmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobDescription, setJobDescriptionState] = useState<JobDescription[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    const storedJD = localStorage.getItem('jobDescription');
    if (storedJD) {
      try {
        const parsed = JSON.parse(storedJD);
        setJobDescriptionState(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Error parsing jobDescription from localStorage:", e);
        setJobDescriptionState([]);
      }
    }
  }, []);

  useEffect(() => {
    const storedCandidates = localStorage.getItem('cvResults');
    if (storedCandidates) {
      try {
        const parsed = JSON.parse(storedCandidates);
        setCandidates(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Error parsing candidates from localStorage:", e);
        setCandidates([]);
      }
    }
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    if (jobDescription.length > 0) {
      localStorage.setItem('jobDescription', JSON.stringify(jobDescription));
    }
  }, [jobDescription]);

  const setJobDescription = (jd: JobDescription) => {
    // Get existing candidates
    const existingCandidates: Candidate[] = JSON.parse(localStorage.getItem('cvResults') || '[]');

    // Extract skills from JD profile - improved regex to catch more formats
    const jdSkills = jd.profile
      .match(/[*•\-]\s*(.+?)(?:\n|$)/g)
      ?.map((s: string) => s.replace(/[*•\-]\s*/, '').toLowerCase().trim()) || [];

    console.log('JD Skills:', jdSkills); // Debug log

    // Find applicable candidates with improved matching
    const applicableCandidateIds = existingCandidates
      .filter((candidate: Candidate) => {
        const matchedSkills = candidate.skills.filter((skill: string) => {
          const lowerSkill = skill.toLowerCase().trim();
          return jdSkills.some((jdSkill: string) =>
            jdSkill.includes(lowerSkill) || lowerSkill.includes(jdSkill)
          );
        });
        console.log(`Candidate ${candidate.name} matched skills:`, matchedSkills); // Debug log
        return matchedSkills.length >= 1;
      })
      .map((c: Candidate) => c.id);

    console.log('Applicable Candidate IDs:', applicableCandidateIds); // Debug log

    // Add applicable candidates to the new JD
    const newJD = {
      ...jd,
      applicableCandidates: applicableCandidateIds || []
    };

    // Update state and localStorage
    const updatedJDs = [...jobDescription, newJD];
    setJobDescriptionState(updatedJDs);
    localStorage.setItem('jobDescription', JSON.stringify(updatedJDs));
  };

  const addCandidate = (candidate: Candidate) => {
    // Step 1: Add candidate to list and localStorage
    const updatedCandidates = [...candidates, candidate].sort((a, b) => b.matchScore - a.matchScore);
    setCandidates(updatedCandidates);
    localStorage.setItem('cvResults', JSON.stringify(updatedCandidates));
    console.log('🚀 Candidate:', candidate);
    console.log('🚀 Candidate Skills:', candidate.skills);

    // Step 2: Match candidate against JDs and update applicableCandidates
    const storedJDs = JSON.parse(localStorage.getItem('jobDescription') || '[]');
    const updatedJobs = storedJDs.map((job: JobDescription) => {
      console.log('📄 Job Profile:', job.profile);
      let jdSkills = job.profile
        .match(/[*•\-] (.+)/g)
        ?.map((s: string) => s.replace(/[*•\-]\s*/, '').toLowerCase()) || [];

      // Fallback: extract from "Key skills" section if jdSkills is empty
      if (jdSkills.length === 0) {
        const keySkillsLine = job.profile
          .split('\n')
          .find((line: string) => line.toLowerCase().includes('key skills'));

        jdSkills = keySkillsLine
          ?.split(':')[1]
          ?.split(',')
          .map((s: string) => s.trim().toLowerCase()) || [];
      }
      console.log("🧠 Extracted JD Skills:", jdSkills);
      console.log("👤 Candidate Skills:", candidate.skills);

      const matchedSkills = candidate.skills.filter(skill => {
        const lowerSkill = skill.toLowerCase();
        return jdSkills.some((jdSkill: string) => jdSkill.includes(lowerSkill));
      });
      console.log('matchedSkills : ', matchedSkills);

      const isApplicable = matchedSkills.length >= 1;
      console.log('🎯 Is Applicable:', isApplicable);
      console.log('🧾 Before Update - Applicable Candidates:', job.applicableCandidates);

      if (isApplicable) {
        const currentApplicableCandidates = job.applicableCandidates || [];
        if (!currentApplicableCandidates.includes(candidate.id)) {
          const updatedApplicableCandidates = [...currentApplicableCandidates, candidate.id];
          console.log('✅ Updated Applicable Candidates:', updatedApplicableCandidates);
          return {
            ...job,
            applicableCandidates: updatedApplicableCandidates,
          };
        }
      }

      return job;
    });

    // Step 3: Update job context and localStorage
    setJobDescriptionState(updatedJobs);
    localStorage.setItem('jobDescription', JSON.stringify(updatedJobs));
  };

  const resetAll = () => {
    setJobDescriptionState([]);
    setCandidates([]);
  };

  return (
    <RecruitmentContext.Provider
      value={{ jobDescription, candidates, setJobDescription, addCandidate, setCandidates, resetAll }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (!context) {
    throw new Error("useRecruitment must be used within a RecruitmentProvider");
  }
  return context;
};
