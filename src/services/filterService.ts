import { Student, BlockedStudent, FilteredStudent, FilterRequest } from '../types';

export class FilterService {
  filterStudents(
    students: Student[],
    blockedStudents: BlockedStudent[],
    criteria: FilterRequest
  ): FilteredStudent[] {
    const blockedStudentsMap = new Map<string, number>();
    blockedStudents.forEach(student => {
      blockedStudentsMap.set(student.rollNumber, student.currentPackage);
    });

    return students.map(student => {
      const filteredStudent: FilteredStudent = {
        ...student,
        isEligible: true,
      };

      // Check if student is in blocking sheet
      const currentPackage = blockedStudentsMap.get(student.rollNumber);
      if (currentPackage) {
        if (currentPackage * 1.5 > criteria.offeredPackage) {
          filteredStudent.isEligible = false;
          filteredStudent.reason = `Blocked: Current package (${currentPackage} LPA) * 1.5 > Offered package (${criteria.offeredPackage} LPA)`;
          return filteredStudent;
        }
      }

      // Check eligibility criteria
      if (student.cgpa < criteria.minCgpa) {
        filteredStudent.isEligible = false;
        filteredStudent.reason = `CGPA (${student.cgpa}) below minimum requirement (${criteria.minCgpa})`;
        return filteredStudent;
      }

      if (student.tenthPercentage < criteria.min10th) {
        filteredStudent.isEligible = false;
        filteredStudent.reason = `10th percentage (${student.tenthPercentage}%) below minimum requirement (${criteria.min10th}%)`;
        return filteredStudent;
      }

      if (student.twelfthPercentage < criteria.min12th) {
        filteredStudent.isEligible = false;
        filteredStudent.reason = `12th percentage (${student.twelfthPercentage}%) below minimum requirement (${criteria.min12th}%)`;
        return filteredStudent;
      }

      if (criteria.minPgCgpa && student.pgCgpa && student.pgCgpa < criteria.minPgCgpa) {
        filteredStudent.isEligible = false;
        filteredStudent.reason = `PG CGPA (${student.pgCgpa}) below minimum requirement (${criteria.minPgCgpa})`;
        return filteredStudent;
      }

      if (student.activeBacklogs > criteria.maxActiveBacklogs) {
        filteredStudent.isEligible = false;
        filteredStudent.reason = `Active backlogs (${student.activeBacklogs}) exceed maximum allowed (${criteria.maxActiveBacklogs})`;
        return filteredStudent;
      }

      return filteredStudent;
    });
  }

  getEligibleStudents(filteredStudents: FilteredStudent[]): FilteredStudent[] {
    return filteredStudents.filter(student => student.isEligible);
  }

  getIneligibleStudents(filteredStudents: FilteredStudent[]): FilteredStudent[] {
    return filteredStudents.filter(student => !student.isEligible);
  }
}