// lib/openai.ts
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
  dangerouslyAllowBrowser: true
});

// Function to generate JD profile based on job description
export const generateJDProfile = async (jdText: string): Promise<string> => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: `Extract the following details from this job description:\n\n- Key skills\n- Domain (e.g., finance, e-commerce)\n- Seniority level (e.g., junior, senior, lead)\n\nJob Description:\n${jdText}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq");
    }
    return content.trim();
  } catch (error) {
    console.error("Groq JD Profile Error:", error);
    throw new Error("Failed to generate JD profile with Groq");
  }
};


export const getCVMatchScore = async (
  cvText: string,
  jdProfile: string
): Promise<{ score: number; explanation: string; skills: string[]; yearsOfExperience: number }> => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: `Given the following Job Profile and CV, calculate a match score from 0 to 100 and extract skills and years of experience. Reply in the format:\n\nScore: <number>\nExplanation: <short reason>\nSkills: <comma-separated list>\nExperience: <number> years\n\nJob Profile:\n${jdProfile}\n\nCV:\n${cvText}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq");
    }

    const scoreMatch = content.match(/Score:\s*(\d{1,3})/);
    const skillsMatch = content.match(/Skills:\s*([^\n]+)/);
    const expMatch = content.match(/Experience:\s*(\d+)/);

    return {
      score: scoreMatch ? Math.min(parseInt(scoreMatch[1]), 100) : 0,
      explanation: content,
      skills: skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()) : [],
      yearsOfExperience: expMatch ? parseInt(expMatch[1]) : 0
    };
  } catch (error) {
    console.error("Groq CV Match Score Error:", error);
    return {
      score: 0,
      explanation: "Failed to calculate score due to an error.",
      skills: [],
      yearsOfExperience: 0
    };
  }
};

