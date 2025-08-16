import React, { useState } from 'react';
import { FilterResponse, FilteredStudent } from '../types';
import { downloadFile } from '../services/api';
import { 
  Download, 
  Users, 
  CheckCircle, 
  XCircle, 
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface FilterResultsProps {
  results: FilterResponse;
}

export const FilterResults: React.FC<FilterResultsProps> = ({ results }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!results.data?.downloadUrl) return;
    
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      await downloadFile(results.data.downloadUrl);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const eligibleStudents = results.data?.filteredStudents.filter(s => s.isEligible) || [];
  const ineligibleStudents = results.data?.filteredStudents.filter(s => !s.isEligible) || [];

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Filtering Results
        </h2>
        <p className="text-gray-600">
          {results.message}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.data?.totalStudents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Eligible</p>
              <p className="text-2xl font-bold text-green-600">
                {results.data?.eligibleStudents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Ineligible</p>
              <p className="text-2xl font-bold text-red-600">
                {ineligibleStudents.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {results.data?.totalStudents 
                  ? Math.round((results.data.eligibleStudents / results.data.totalStudents) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Download Results
            </h3>
            <p className="text-gray-600">
              Get the complete filtered data in Excel format
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={isDownloading || !results.data?.downloadUrl}
            className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </>
            )}
          </button>
        </div>
        
        {downloadError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{downloadError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligible Students */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Eligible Students ({eligibleStudents.length})
          </h3>
          <div className="max-h-64 overflow-y-auto">
            {eligibleStudents.length > 0 ? (
              <div className="space-y-2">
                {eligibleStudents.slice(0, 10).map((student, index) => (
                  <div key={index} className="p-2 bg-green-50 rounded border-l-4 border-green-500">
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.rollNumber} • CGPA: {student.cgpa}
                    </p>
                  </div>
                ))}
                {eligibleStudents.length > 10 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    ... and {eligibleStudents.length - 10} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No eligible students found</p>
            )}
          </div>
        </div>

        {/* Ineligible Students */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            Ineligible Students ({ineligibleStudents.length})
          </h3>
          <div className="max-h-64 overflow-y-auto">
            {ineligibleStudents.length > 0 ? (
              <div className="space-y-2">
                {ineligibleStudents.slice(0, 10).map((student, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">
                      {student.rollNumber} • {student.reason}
                    </p>
                  </div>
                ))}
                {ineligibleStudents.length > 10 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    ... and {ineligibleStudents.length - 10} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No ineligible students found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};