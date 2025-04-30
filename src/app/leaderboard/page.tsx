'use client';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValidationModule, ClientSideRowModelModule,PaginationModule } from 'ag-grid-community';
import { useRecruitment } from '@/context/RecruitmentContext';
import { useMemo, useState } from 'react';
import UploadCVButton from '@/components/UploadCVButton';
import CandidateDetailModal from '@/components/CandidateDetailModal';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function LeaderboardPage() {
  const { jobDescription, candidates } = useRecruitment();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const sortedCandidates = useMemo(() => {
    // Get the selected job description from localStorage
    const selectedJobId = JSON.parse(localStorage.getItem('selectedJobDescription') || '[]');
    console.log('selectedJD', selectedJobId)
    const currentJobDescription = jobDescription.find(jd => jd.id === selectedJobId.id) || jobDescription[jobDescription.length - 1];
    console.log('🏁 currentJobDescription:', currentJobDescription);
    console.log('🔎 candidates:', candidates);
  
    // Filter candidates to only show those in applicableCandidates
    const applicableCandidates = candidates.filter(candidate => 
      currentJobDescription?.applicableCandidates?.includes(candidate.id)
    );
    console.log('applicableCandidates :',applicableCandidates)
    return [...applicableCandidates].sort((a, b) => b.matchScore - a.matchScore);
  }, [candidates, jobDescription]);

  const currentJobDescription = useMemo(() => {
    const selectedJobId = JSON.parse(localStorage.getItem('selectedJobDescription') || '[]');
    return jobDescription.find(jd => jd.id === selectedJobId.id) || jobDescription[jobDescription.length - 1];
  }, [jobDescription]);

  const columns: ColDef[] = useMemo(() => [
    {
      headerName: 'Rank',
      valueGetter: (params: any) => sortedCandidates.findIndex(c => c.id === params.data.id) + 1,
      flex: 0.5,
    },
    { field: 'name', headerName: 'Candidate Name', flex: 1 },
    {
      field: 'matchScore',
      headerName: 'Match Score',
      flex: 0.8,
      cellRenderer: (params: any) => `${params.value} / 100`,
      sort: 'desc',
    },
    { field: 'skills', headerName: 'Skills', flex: 2, valueFormatter: p => p.value?.join(', ') },
    { field: 'yearsOfExperience', headerName: 'Years of Experience', flex: 0.8 },
    {
      headerName: 'Details',
      flex: 0.5,
      cellRenderer: (params: any) => (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%'
        }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setSelectedCandidate(params.data)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: '80px',
              height: '28px',
              fontSize: '0.75rem',
              padding: '4px 12px',
              backgroundColor: 'primary.main',
              color: 'white',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'primary.dark',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            View
          </Button>
        </Box>
      ),
    },
  ], [sortedCandidates]);

  if (!jobDescription || jobDescription.length === 0) {
    return <div className="p-4">Please post a JD first.</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            cursor: 'pointer'
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
              {currentJobDescription?.title || 'No Job Title'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                whiteSpace: 'pre-line',
                maxHeight: expanded ? 'none' : '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'none' : 5,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {currentJobDescription?.description || 'No Job Description'}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ ml: 1 }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Leaderboard
          </Typography>
          <UploadCVButton />
        </Box>

        <Box sx={{ height: 400, width: '100%' }} className="ag-theme-alpine">
          <AgGridReact
            modules={[ClientSideRowModelModule, ValidationModule, PaginationModule]}   
            rowData={sortedCandidates}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            theme="legacy"
          />
        </Box>
      </Paper>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </Container>
  );
}
