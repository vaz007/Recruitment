'use client';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValidationModule, ClientSideRowModelModule,PaginationModule } from 'ag-grid-community';

import { useRecruitment } from '@/context/RecruitmentContext';
import { useMemo, useState } from 'react';
import UploadCVButton from '@/components/UploadCVButton';
import CandidateDetailModal from '@/components/CandidateDetailModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';



export default function LeaderboardPage() {
  const { jobDescription, candidates } = useRecruitment();
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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

  

  const columns: ColDef[] = useMemo(() => [
    {
      headerName: 'Rank',
      valueGetter: (params: any) => sortedCandidates.findIndex(c => c.id === params.data.id) + 1,
    },
    { field: 'name', headerName: 'Candidate Name', flex: 1 },
    {
      field: 'matchScore',
      headerName: 'Match Score',
      flex: 1,
      cellRenderer: (params: any) => `${params.value} / 100`,
      sort: 'desc',
    },
    { field: 'skills', headerName: 'Skills', flex: 2, valueFormatter: p => p.value?.join(', ') },
    { field: 'yearsOfExperience', headerName: 'Years of Experience', flex: 1 },
    {
      headerName: 'Details',
      cellRenderer: (params: any) => (
        <button onClick={() => setSelectedCandidate(params.data)}>View</button>
      ),
    },
  ], [sortedCandidates]);

  if (!jobDescription || jobDescription.length === 0) {
    return <div className="p-4">Please post a JD first.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
        <UploadCVButton />

      <div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
          <AgGridReact
          modules={[ClientSideRowModelModule, ValidationModule, PaginationModule]}   
            rowData={sortedCandidates}     // Use sortedCandidates instead of candidates
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            theme="legacy"
          />
        </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
