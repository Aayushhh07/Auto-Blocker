import { google } from 'googleapis';
import { Student, BlockedStudent, GoogleSheetsConfig } from '../types';

export class GoogleSheetsService {
  private auth: any;
  private sheets: any;

  constructor(config: GoogleSheetsConfig) {
    // In development mode, skip auth if credentials are not provided
    if (process.env.NODE_ENV === 'development' && (!config.serviceAccountEmail || !config.privateKey)) {
      console.log('Running in development mode without Google Sheets API credentials');
      this.auth = null;
      this.sheets = null;
      return;
    }

    this.auth = new google.auth.JWT(
      config.serviceAccountEmail,
      undefined,
      config.privateKey,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  private extractSheetId(url: string): string {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid Google Sheets URL');
    }
    return match[1];
  }

  async getApplyingSheetData(sheetUrl: string): Promise<Student[]> {
    // Development mode: return mock data
    if (process.env.NODE_ENV === 'development' && !this.auth) {
      const { mockStudents } = await import('../test/testData');
      console.log('Using mock data for applying sheet');
      return mockStudents;
    }

    try {
      const sheetId = this.extractSheetId(sheetUrl);
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'A:G', // Assuming columns A-G contain the student data
      });

      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        throw new Error('No data found in the applying sheet');
      }

      // Skip header row and parse data
      const students: Student[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 6) {
          students.push({
            rollNumber: row[0]?.toString() || '',
            name: row[1]?.toString() || '',
            cgpa: parseFloat(row[2]) || 0,
            tenthPercentage: parseFloat(row[3]) || 0,
            twelfthPercentage: parseFloat(row[4]) || 0,
            pgCgpa: row[5] ? parseFloat(row[5]) : undefined,
            activeBacklogs: parseInt(row[6]) || 0,
          });
        }
      }

      return students;
    } catch (error) {
      console.error('Error fetching applying sheet data:', error);
      throw new Error(`Failed to fetch applying sheet data: ${error}`);
    }
  }

  async getBlockingSheetData(sheetUrl: string): Promise<BlockedStudent[]> {
    // Development mode: return mock data
    if (process.env.NODE_ENV === 'development' && !this.auth) {
      const { mockBlockedStudents } = await import('../test/testData');
      console.log('Using mock data for blocking sheet');
      return mockBlockedStudents;
    }

    try {
      const sheetId = this.extractSheetId(sheetUrl);
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'A:B', // Assuming columns A-B contain roll number and current package
      });

      const rows = response.data.values;
      if (!rows || rows.length < 2) {
        throw new Error('No data found in the blocking sheet');
      }

      // Skip header row and parse data
      const blockedStudents: BlockedStudent[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 2) {
          blockedStudents.push({
            rollNumber: row[0]?.toString() || '',
            currentPackage: parseFloat(row[1]) || 0,
          });
        }
      }

      return blockedStudents;
    } catch (error) {
      console.error('Error fetching blocking sheet data:', error);
      throw new Error(`Failed to fetch blocking sheet data: ${error}`);
    }
  }
}