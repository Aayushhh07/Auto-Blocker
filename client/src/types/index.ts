export interface FilterRequest {
  applyingSheetUrl: string;
  blockingSheetUrl: string;
  offeredPackage: number;
  minCgpa: number;
  min10th: number;
  min12th: number;
  minPgCgpa?: number;
  maxActiveBacklogs: number;
}

export interface Student {
  rollNumber: string;
  name: string;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  pgCgpa?: number;
  activeBacklogs: number;
}

export interface FilteredStudent extends Student {
  isEligible: boolean;
  reason?: string;
}

export interface FilterResponse {
  success: boolean;
  message: string;
  data?: {
    totalStudents: number;
    eligibleStudents: number;
    filteredStudents: FilteredStudent[];
    downloadUrl?: string;
  };
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
}