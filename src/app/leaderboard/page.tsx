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

import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
  return <Leaderboard />
 
}
