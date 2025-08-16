import { Student, BlockedStudent } from '../types';

export const mockStudents: Student[] = [
  {
    rollNumber: '2021001',
    name: 'John Doe',
    cgpa: 8.5,
    tenthPercentage: 85,
    twelfthPercentage: 82,
    pgCgpa: 8.2,
    activeBacklogs: 0,
  },
  {
    rollNumber: '2021002',
    name: 'Jane Smith',
    cgpa: 7.8,
    tenthPercentage: 78,
    twelfthPercentage: 75,
    pgCgpa: 7.5,
    activeBacklogs: 1,
  },
  {
    rollNumber: '2021003',
    name: 'Bob Johnson',
    cgpa: 9.2,
    tenthPercentage: 92,
    twelfthPercentage: 88,
    pgCgpa: 9.0,
    activeBacklogs: 0,
  },
  {
    rollNumber: '2021004',
    name: 'Alice Brown',
    cgpa: 6.5,
    tenthPercentage: 65,
    twelfthPercentage: 62,
    pgCgpa: 6.0,
    activeBacklogs: 3,
  },
  {
    rollNumber: '2021005',
    name: 'Charlie Wilson',
    cgpa: 8.0,
    tenthPercentage: 80,
    twelfthPercentage: 78,
    pgCgpa: 7.8,
    activeBacklogs: 0,
  },
];

export const mockBlockedStudents: BlockedStudent[] = [
  {
    rollNumber: '2021001',
    currentPackage: 12.0,
  },
  {
    rollNumber: '2021003',
    currentPackage: 15.0,
  },
  {
    rollNumber: '2021005',
    currentPackage: 8.0,
  },
];