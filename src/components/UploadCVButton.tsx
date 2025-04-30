'use client';

import { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { parsePDFClient } from '../lib/parseCV';
import { useRecruitment } from '@/context/RecruitmentContext';
import { evaluateCandidate } from '../lib/evaluateCandidate';
import { v4 as uuidv4 } from 'uuid';
import { Candidate } from '../types/candidate';

export default function UploadCVButton() {
  const { addCandidate } = useRecruitment();
  const [snackOpen, setSnackOpen] = useState(false);

  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Get job descriptions from localStorage
    const storedJDs = JSON.parse(localStorage.getItem('jobDescription') || '[]');
    if (storedJDs.length === 0) {
      console.error("No job descriptions found");
      return;
    }

    const text = await parsePDFClient(file);
    const candidate: Candidate = {
      id: uuidv4(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      rawText: text,
      skills: [],
      yearsOfExperience: 0,
      matchScore: 0,
      highlights: ""
    };

    // Use the first job description for evaluation
    const scored = await evaluateCandidate(candidate, storedJDs[0]);
    addCandidate(scored);
    
    setSnackOpen(true);
  };

  return (
    <>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload CV
        <input
          type="file"
          accept=".pdf"
          hidden
          onChange={handleUpload}
        />
      </Button>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity="success" variant="filled">CV uploaded and scored!</Alert>
      </Snackbar>
    </>
  );
}
