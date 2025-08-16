import { Request, Response } from 'express';
import { GoogleSheetsService } from '../services/googleSheets';
import { FilterService } from '../services/filterService';
import { ExportService } from '../services/exportService';
import { FilterRequest, FilterResponse } from '../types';

export class FilterController {
  private googleSheetsService: GoogleSheetsService;
  private filterService: FilterService;
  private exportService: ExportService;

  constructor() {
    this.googleSheetsService = new GoogleSheetsService({
      apiKey: process.env.GOOGLE_SHEETS_API_KEY || '',
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
      privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
    });
    this.filterService = new FilterService();
    this.exportService = new ExportService();
  }

  async filterApplicants(req: Request, res: Response): Promise<void> {
    try {
      const filterRequest: FilterRequest = req.body;

      // Validate required fields
      if (!this.validateRequest(filterRequest)) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields',
          error: 'Please provide all required fields'
        });
        return;
      }

      // Fetch data from Google Sheets
      const [students, blockedStudents] = await Promise.all([
        this.googleSheetsService.getApplyingSheetData(filterRequest.applyingSheetUrl),
        this.googleSheetsService.getBlockingSheetData(filterRequest.blockingSheetUrl)
      ]);

      // Filter students based on criteria
      const filteredStudents = this.filterService.filterStudents(
        students,
        blockedStudents,
        filterRequest
      );

      const eligibleStudents = this.filterService.getEligibleStudents(filteredStudents);
      const ineligibleStudents = this.filterService.getIneligibleStudents(filteredStudents);

      // Generate timestamp for filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `filtered_students_${timestamp}`;

      // Export to Excel
      const excelFilePath = this.exportService.exportToExcel(filteredStudents, filename);
      const downloadUrl = this.exportService.getDownloadUrl(excelFilePath);

      // Clean up old files
      this.exportService.cleanupOldFiles();

      const response: FilterResponse = {
        success: true,
        message: 'Students filtered successfully',
        data: {
          totalStudents: students.length,
          eligibleStudents: eligibleStudents.length,
          filteredStudents: filteredStudents,
          downloadUrl: downloadUrl
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Error in filterApplicants:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const filename = decodeURIComponent(req.params.filename);
      const filePath = `uploads/${filename}`;
      const fullPath = require('path').join(__dirname, '../../', filePath);

      if (!require('fs').existsSync(fullPath)) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }

      res.download(fullPath, filename);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({
        success: false,
        message: 'Error downloading file',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  private validateRequest(request: FilterRequest): boolean {
    return !!(
      request.applyingSheetUrl &&
      request.blockingSheetUrl &&
      request.offeredPackage &&
      request.minCgpa &&
      request.min10th &&
      request.min12th &&
      request.maxActiveBacklogs
    );
  }
}