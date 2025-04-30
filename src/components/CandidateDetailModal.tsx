'use client';

import React from 'react';
import { Candidate } from '../types/candidate';

interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function CandidateDetailModal({ candidate, onClose }: CandidateDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">{candidate.name}</h2>
        <p><strong>Match Score:</strong> {candidate.matchScore} / 100</p>
        <p><strong>Skills:</strong> {candidate.skills?.join(', ')}</p>
        <p><strong>Years of Experience:</strong> {candidate.yearsOfExperience}</p>
        <p><strong>Highlights:</strong> {candidate.highlights || 'N/A'}</p>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
