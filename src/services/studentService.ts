import api from './api';

export interface StudentProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  student_id?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  country?: string;
  school_name?: string;
  grade_level?: string;
  field_of_study?: string;
  profile_picture?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  bio?: string;
}

export interface UpdateStudentProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  country?: string;
  schoolName?: string;
  gradeLevel?: string;
  fieldOfStudy?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  bio?: string;
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

export interface UploadDocumentData {
  documentType: 'school_result' | 'receipt' | 'primary_certificate' | 'secondary_certificate' | 'university_certificate' | 'other';
  documentTitle: string;
  description?: string;
}

class StudentService {
  async updateProfile(data: UpdateStudentProfileData): Promise<{ message: string }> {
    const response = await api.put('/students/profile', data);
    return response.data;
  }

  async uploadProfilePicture(file: File): Promise<{ message: string; filePath: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post('/students/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadDocument(file: File, data: UploadDocumentData): Promise<{ message: string; documentId: number; filePath: string }> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', data.documentType);
    formData.append('documentTitle', data.documentTitle);
    if (data.description) {
      formData.append('description', data.description);
    }
    
    const response = await api.post('/students/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDocuments(): Promise<{ documents: StudentDocument[] }> {
    const response = await api.get('/students/documents');
    return response.data;
  }

  async deleteDocument(documentId: number): Promise<{ message: string }> {
    const response = await api.delete(`/students/documents/${documentId}`);
    return response.data;
  }

  async getDonorCount(): Promise<{ donorCount: number }> {
    const response = await api.get('/students/donor-count');
    return response.data;
  }

  async downloadDocument(documentId: number): Promise<Blob> {
    const response = await api.get(`/students/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default new StudentService();