"use client";

import { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValidationModule, ClientSideRowModelModule, PaginationModule } from 'ag-grid-community';
import { useRecruitment } from "@/context/RecruitmentContext";
import { useRouter } from "next/navigation";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  Container,
  Stack,
  Divider
} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { generateJDProfile } from "../lib/openai";
import { Candidate } from "../types/candidate";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const JDForm = () => {
  const { setJobDescription } = useRecruitment();
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [jdTitle, setJdTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);

  // Load job descriptions from localStorage on component mount
  useEffect(() => {
    const storedJDs = JSON.parse(localStorage.getItem('jobDescription') || '[]');
    setRowData(storedJDs);
  }, []);

  const columns: ColDef[] = [
    { 
      headerName: "Title", 
      field: "title", 
      flex: 1,
      sortable: true,
      filter: true
    },
    { 
      headerName: "Description", 
      field: "description", 
      flex: 2,
      sortable: true,
      filter: true
    },
    { 
      headerName: "Profile", 
      field: "profile", 
      flex: 2,
      sortable: true,
      filter: true
    },
    { 
      headerName: "Candidates", 
      field: "applicableCandidates", 
      flex: 0.5,
      valueFormatter: (params) => params.value?.length || 0,
      sortable: true
    },
    {
      headerName: "Information",
      field: "action",
      flex: 0.5,
      cellRenderer: () => (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%'
        }}>
          <Button
            variant="contained"
            size="small"
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
            More Info
          </Button>
        </Box>
      ),
      sortable: false,
      filter: false
    }
  ];

  const handleSave = async () => {
    if (jdText.trim() === "") return;
    setLoading(true);
    
    try {
      const jdProfile = await generateJDProfile(jdText);
      console.log('jdProfile:', jdProfile);
      
      const existingCandidates: Candidate[] = JSON.parse(localStorage.getItem('cvResults') || '[]');
      
      const jdSkills = jdProfile
        .match(/[*•\-] (.+)/g)
        ?.map((s: string) => s.replace(/[*•\-]\s*/, '').toLowerCase()) || [];
      
      const applicableCandidateIds = existingCandidates
        .filter(candidate => {
          const matchedSkills = candidate.skills.filter(skill =>
            jdSkills.includes(skill.toLowerCase())
          );
          return matchedSkills.length >= 1;
        })
        .map(c => c.id);

      const newJobDescription = {
        id: uuidv4(),
        title: jdTitle,
        description: jdText,
        text: jdText,
        profile: jdProfile,
        applicableCandidates: applicableCandidateIds
      };

      const existingJDs = JSON.parse(localStorage.getItem('jobDescription') || '[]');
      const updatedJDs = [...existingJDs, newJobDescription];
      localStorage.setItem('jobDescription', JSON.stringify(updatedJDs));
      setRowData(updatedJDs);
      setJobDescription(newJobDescription);
      
      setJdText("");
      setJdTitle("");
    } catch (error) {
      console.error("Error generating JD profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (params: any) => {
    // Store the selected job description in localStorage
    localStorage.setItem('selectedJobDescription', JSON.stringify(params.data));
    router.push("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Post Job Description
          </Typography>
          
          <Stack spacing={3} sx={{ mt: 3 }}>
            <TextField
              label="Job Title"
              multiline
              rows={2}
              variant="outlined"
              fullWidth
              value={jdTitle}
              onChange={(e) => setJdTitle(e.target.value)}
            />

            <TextField
              label="Job Description"
              multiline
              rows={10}
              variant="outlined"
              fullWidth
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={jdText.trim() === "" || loading}
              size="large"
            >
              {loading ? "Saving..." : "Save JD"}
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Posted Job Descriptions
          </Typography>
          <Divider sx={{ my: 2 }} />
          <div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
            <AgGridReact
              modules={[ClientSideRowModelModule, ValidationModule, PaginationModule]}
              rowData={rowData}
              columnDefs={columns}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
              onRowClicked={handleRowClick}
              rowSelection="single"
              theme="legacy"
            />
          </div>
        </Paper>
      </Stack>
    </Container>
  );
};

export default JDForm;