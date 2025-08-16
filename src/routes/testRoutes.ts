import { Router } from 'express';
import { mockStudents, mockBlockedStudents } from '../test/testData';
import { FilterService } from '../services/filterService';

const router = Router();
const filterService = new FilterService();

// GET /api/test/mock-data
router.get('/mock-data', (req, res) => {
  res.json({
    success: true,
    data: {
      students: mockStudents,
      blockedStudents: mockBlockedStudents
    }
  });
});

// POST /api/test/filter
router.post('/filter', (req, res) => {
  try {
    const criteria = req.body;
    
    const filteredStudents = filterService.filterStudents(
      mockStudents,
      mockBlockedStudents,
      criteria
    );

    const eligibleStudents = filterService.getEligibleStudents(filteredStudents);
    const ineligibleStudents = filterService.getIneligibleStudents(filteredStudents);

    res.json({
      success: true,
      message: 'Test filtering completed successfully',
      data: {
        totalStudents: mockStudents.length,
        eligibleStudents: eligibleStudents.length,
        filteredStudents: filteredStudents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test filtering failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;