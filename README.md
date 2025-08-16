# Auto-Blocker

A complete web application for automating the blocking process for placement drives based on student data in Google Sheets.

## 🚀 Features

- **Automated Filtering**: Automatically filters students based on eligibility criteria
- **Google Sheets Integration**: Fetches data directly from Google Sheets using the Google Sheets API
- **Blocking Logic**: Implements the 1.5x package blocking rule for already placed students
- **Eligibility Criteria**: Supports multiple criteria including CGPA, 10th%, 12th%, PG CGPA, and active backlogs
- **Excel Export**: Generates filtered results in Excel format for easy download
- **Modern UI**: Beautiful, responsive React frontend with real-time feedback
- **TypeScript**: Full TypeScript support for both frontend and backend

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Google Sheets (via Google Sheets API)
- **File Export**: Excel (.xlsx) format

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Google Sheets API Access**:
   - Google Cloud Project
   - Google Sheets API enabled
   - Service Account credentials

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Download the JSON key file
5. Share your Google Sheets with the service account email

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Google Sheets API Configuration
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Google Sheets Format

#### Applying Sheet Format
Your applying sheet should have the following columns:
- **A**: Roll Number (Primary Key)
- **B**: Name
- **C**: CGPA
- **D**: 10th Percentage
- **E**: 12th Percentage
- **F**: PG CGPA (Optional)
- **G**: Active Backlogs

#### Blocking Sheet Format
Your blocking sheet should have the following columns:
- **A**: Roll Number (Primary Key)
- **B**: Current Package (in LPA)

## 🚀 Running the Application

### Development Mode

```bash
# Start both backend and frontend in development mode
npm run dev

# Or run them separately:
npm run dev:server  # Backend only (port 5000)
npm run dev:client  # Frontend only (port 3000)
```

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📖 Usage

1. **Open the Application**: Navigate to `http://localhost:3000`
2. **Enter Sheet URLs**: Provide the URLs for your applying and blocking sheets
3. **Set Criteria**: Configure the eligibility criteria:
   - Offered Package (LPA)
   - Minimum CGPA
   - Minimum 10th Percentage
   - Minimum 12th Percentage
   - Minimum PG CGPA (Optional)
   - Maximum Active Backlogs
4. **Filter Students**: Click "Filter Applicants" to process the data
5. **Download Results**: Download the filtered results in Excel format

## 🔍 Filtering Logic

The application applies the following filtering rules:

1. **Blocking Check**: If a student is in the blocking sheet and their current package × 1.5 > offered package, they are removed
2. **Eligibility Criteria**:
   - CGPA must be ≥ minimum CGPA
   - 10th percentage must be ≥ minimum 10th percentage
   - 12th percentage must be ≥ minimum 12th percentage
   - PG CGPA must be ≥ minimum PG CGPA (if provided)
   - Active backlogs must be ≤ maximum allowed backlogs

## 📁 Project Structure

```
auto-blocker/
├── src/                    # Backend source code
│   ├── controllers/        # Request handlers
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   └── types/             # TypeScript type definitions
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
├── uploads/               # Generated Excel files
├── dist/                  # Compiled backend code
└── package.json           # Backend dependencies
```

## 🔌 API Endpoints

- `POST /api/filter-applicants` - Filter students based on criteria
- `GET /api/download/:filename` - Download generated Excel files
- `GET /health` - Health check endpoint

## 🛠️ Development

### Backend Development

```bash
# Run in development mode with auto-reload
npm run dev:server

# Build TypeScript
npm run build:server

# Run tests (when implemented)
npm test
```

### Frontend Development

```bash
# Run in development mode
cd client
npm start

# Build for production
npm run build
```

## 🔒 Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement proper CORS configuration
- Validate all input data
- Sanitize file uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation above
2. Review the Google Sheets API documentation
3. Open an issue on GitHub

## 🔄 Updates

- **v1.0.0**: Initial release with core filtering functionality
- Support for Google Sheets integration
- Excel export functionality
- Modern React UI with TypeScript