import * as XLSX from 'xlsx';
import { FilteredStudent } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class ExportService {
  private uploadsDir = path.join(__dirname, '../../uploads');

  constructor() {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  exportToExcel(filteredStudents: FilteredStudent[], filename: string): string {
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet with headers
    const headers = [
      'Roll Number',
      'Name',
      'CGPA',
      '10th %',
      '12th %',
      'PG CGPA',
      'Active Backlogs',
      'Eligible',
      'Reason'
    ];

    const data = filteredStudents.map(student => [
      student.rollNumber,
      student.name,
      student.cgpa,
      student.tenthPercentage,
      student.twelfthPercentage,
      student.pgCgpa || '',
      student.activeBacklogs,
      student.isEligible ? 'Yes' : 'No',
      student.reason || ''
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 15 }, // Roll Number
      { width: 25 }, // Name
      { width: 10 }, // CGPA
      { width: 10 }, // 10th %
      { width: 10 }, // 12th %
      { width: 10 }, // PG CGPA
      { width: 15 }, // Active Backlogs
      { width: 10 }, // Eligible
      { width: 50 }  // Reason
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Students');
    
    const filePath = path.join(this.uploadsDir, `${filename}.xlsx`);
    XLSX.writeFile(workbook, filePath);
    
    return filePath;
  }

  exportToCSV(filteredStudents: FilteredStudent[], filename: string): string {
    const headers = [
      'Roll Number',
      'Name',
      'CGPA',
      '10th %',
      '12th %',
      'PG CGPA',
      'Active Backlogs',
      'Eligible',
      'Reason'
    ];

    const csvData = filteredStudents.map(student => [
      student.rollNumber,
      student.name,
      student.cgpa,
      student.tenthPercentage,
      student.twelfthPercentage,
      student.pgCgpa || '',
      student.activeBacklogs,
      student.isEligible ? 'Yes' : 'No',
      student.reason || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const filePath = path.join(this.uploadsDir, `${filename}.csv`);
    fs.writeFileSync(filePath, csvContent, 'utf8');
    
    return filePath;
  }

  getDownloadUrl(filePath: string): string {
    const relativePath = path.relative(path.join(__dirname, '../../'), filePath);
    return `/download/${encodeURIComponent(relativePath)}`;
  }

  cleanupOldFiles(): void {
    const files = fs.readdirSync(this.uploadsDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    files.forEach(file => {
      const filePath = path.join(this.uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
      }
    });
  }
}