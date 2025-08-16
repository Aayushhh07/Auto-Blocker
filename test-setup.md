# Test Setup Guide

## Quick Test Without Google Sheets API

To test the application without setting up Google Sheets API, you can:

1. **Start the backend server**:
   ```bash
   npm run dev:server
   ```

2. **Start the frontend**:
   ```bash
   cd client
   npm start
   ```

3. **Test the health endpoint**:
   ```bash
   curl http://localhost:5000/health
   ```

## Mock Data for Testing

You can create test Google Sheets with the following sample data:

### Applying Sheet Sample Data:
| Roll Number | Name | CGPA | 10th % | 12th % | PG CGPA | Active Backlogs |
|-------------|------|------|--------|--------|---------|-----------------|
| 2021001 | John Doe | 8.5 | 85 | 82 | 8.2 | 0 |
| 2021002 | Jane Smith | 7.8 | 78 | 75 | 7.5 | 1 |
| 2021003 | Bob Johnson | 9.2 | 92 | 88 | 9.0 | 0 |
| 2021004 | Alice Brown | 6.5 | 65 | 62 | 6.0 | 3 |

### Blocking Sheet Sample Data:
| Roll Number | Current Package (LPA) |
|-------------|----------------------|
| 2021001 | 12.0 |
| 2021003 | 15.0 |

## Expected Results

With the sample data above and criteria:
- Offered Package: 10 LPA
- Min CGPA: 7.0
- Min 10th%: 70
- Min 12th%: 70
- Max Backlogs: 2

**Expected Results:**
- **Eligible**: Jane Smith (meets all criteria)
- **Ineligible**: 
  - John Doe (blocked: 12 * 1.5 = 18 > 10)
  - Bob Johnson (blocked: 15 * 1.5 = 22.5 > 10)
  - Alice Brown (CGPA 6.5 < 7.0, backlogs 3 > 2)

## Environment Variables for Testing

Create a `.env` file with:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Note: For full functionality, you'll need to set up Google Sheets API credentials as described in the main README.