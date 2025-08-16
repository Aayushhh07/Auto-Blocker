import React, { useState } from 'react';
import { FilterRequest } from '../types';
import { FilterResults } from './FilterResults';
import { FilterResponse } from '../types';
import { filterApplicants } from '../services/api';
import { Loader2, FileSpreadsheet, Users, CheckCircle, XCircle } from 'lucide-react';

interface FilterFormProps {}

export const FilterForm: React.FC<FilterFormProps> = () => {
  const [formData, setFormData] = useState<FilterRequest>({
    applyingSheetUrl: '',
    blockingSheetUrl: '',
    offeredPackage: 0,
    minCgpa: 0,
    min10th: 0,
    min12th: 0,
    minPgCgpa: undefined,
    maxActiveBacklogs: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FilterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minPgCgpa' && value === '' ? undefined : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await filterApplicants(formData);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.applyingSheetUrl &&
      formData.blockingSheetUrl &&
      formData.offeredPackage > 0 &&
      formData.minCgpa > 0 &&
      formData.min10th > 0 &&
      formData.min12th > 0 &&
      formData.maxActiveBacklogs >= 0
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auto-Blocker
          </h1>
          <p className="text-gray-600">
            Automate the blocking process for placement drives
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Google Sheets URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileSpreadsheet className="inline w-4 h-4 mr-2" />
                Applying Sheet URL
              </label>
              <input
                type="url"
                name="applyingSheetUrl"
                value={formData.applyingSheetUrl}
                onChange={handleInputChange}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileSpreadsheet className="inline w-4 h-4 mr-2" />
                Blocking Sheet URL
              </label>
              <input
                type="url"
                name="blockingSheetUrl"
                value={formData.blockingSheetUrl}
                onChange={handleInputChange}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Package and Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offered Package (LPA)
              </label>
              <input
                type="number"
                name="offeredPackage"
                value={formData.offeredPackage}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum CGPA
              </label>
              <input
                type="number"
                name="minCgpa"
                value={formData.minCgpa}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum 10th %
              </label>
              <input
                type="number"
                name="min10th"
                value={formData.min10th}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum 12th %
              </label>
              <input
                type="number"
                name="min12th"
                value={formData.min12th}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum PG CGPA (Optional)
              </label>
              <input
                type="number"
                name="minPgCgpa"
                value={formData.minPgCgpa || ''}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty if not required"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Active Backlogs
              </label>
              <input
                type="number"
                name="maxActiveBacklogs"
                value={formData.maxActiveBacklogs}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Filter Applicants
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="mt-8">
            <FilterResults results={results} />
          </div>
        )}
      </div>
    </div>
  );
};