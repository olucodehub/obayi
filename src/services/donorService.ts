import api from './api';

export interface Student {
  id: number;
  studentId: string;
  customStudentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  schoolName?: string;
  gradeLevel?: string;
  fieldOfStudy?: string;
  profilePicture?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  bio?: string;
  assignedAt: string;
  assignmentNotes?: string;
  totalDonors: number;
  documents: StudentDocument[];
  createdAt: string;
  documentCount?: number;
}

export interface StudentDocument {
  id: number;
  documentType: 'school_result' | 'receipt' | 'primary_certificate' | 'secondary_certificate' | 'university_certificate' | 'other';
  documentTitle: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  description?: string;
  mimeType: string;
}

export interface DonorProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  organization?: string;
  address?: string;
  city?: string;
  country?: string;
  donation_amount?: number;
  donation_frequency?: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  preferred_contact?: 'email' | 'phone' | 'both';
  bio?: string;
}

export interface UpdateDonorProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  address?: string;
  city?: string;
  country?: string;
  donationAmount?: number;
  donationFrequency?: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  preferredContact?: 'email' | 'phone' | 'both';
  bio?: string;
}

class DonorService {
  async updateProfile(data: UpdateDonorProfileData): Promise<{ message: string }> {
    const response = await api.put('/donors/profile', data);
    return response.data;
  }

  async getAssignedStudents(): Promise<{ students: Student[] }> {
    const response = await api.get('/donors/students');
    return response.data;
  }

  async getStudentDetails(studentId: number): Promise<{ student: Student }> {
    const response = await api.get(`/donors/students/${studentId}`);
    return response.data;
  }

  async downloadDocument(studentId: number, documentId: number): Promise<Blob> {
    const response = await api.get(`/donors/students/${studentId}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default new DonorService();