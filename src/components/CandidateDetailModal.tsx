'use client';

import React from 'react';
import { Candidate } from '../types/candidate';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Divider,
  Paper
} from '@mui/material';

interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function CandidateDetailModal({ candidate, onClose }: CandidateDetailModalProps) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {candidate.name}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Match Score
            </Typography>
            <Typography variant="body1">
              {candidate.matchScore} / 100
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Skills
            </Typography>
            <Typography variant="body1">
              {candidate.skills?.join(', ')}
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Years of Experience
            </Typography>
            <Typography variant="body1">
              {candidate.yearsOfExperience}
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Highlights
            </Typography>
            <Typography variant="body1">
              {candidate.highlights || 'N/A'}
            </Typography>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            minWidth: '100px',
            height: '36px',
            fontSize: '0.875rem',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
