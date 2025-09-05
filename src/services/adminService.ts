import api from './api';

export interface AdminDonor {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  is_active: boolean;
  donor_id: number;
  organization?: string;
  city?: string;
  country?: string;
  donation_amount?: number;
  donation_frequency?: string;
  assigned_students: number;
}

export interface AdminStudent {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  is_active: boolean;
  student_id: number;
  custom_student_id: string;
  school_name?: string;
  grade_level?: string;
  field_of_study?: string;
  city?: string;
  country?: string;
  assigned_donors: number;
  document_count: number;
}

export interface Assignment {
  id: number;
  assigned_at: string;
  is_active: boolean;
  notes?: string;
  donor_id: number;
  donor_first_name: string;
  donor_last_name: string;
  donor_email: string;
  organization?: string;
  student_id: number;
  custom_student_id: string;
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  school_name?: string;
  grade_level?: string;
  assigned_by_first_name: string;
  assigned_by_last_name: string;
}

export interface DetailedDonor extends AdminDonor {
  address?: string;
  bio?: string;
  preferred_contact?: string;
  assignedStudents: {
    id: number;
    custom_student_id: string;
    first_name: string;
    last_name: string;
    school_name?: string;
    grade_level?: string;
    assigned_at: string;
    notes?: string;
  }[];
}

export interface DetailedStudent extends AdminStudent {
  date_of_birth?: string;
  gender?: string;
  address?: string;
  profile_picture?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  bio?: string;
  assignedDonors: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    organization?: string;
    assigned_at: string;
    notes?: string;
  }[];
  documents: {
    id: number;
    document_type: string;
    document_title: string;
    file_name: string;
    file_size: number;
    uploaded_at: string;
    description?: string;
  }[];
}

export interface PlatformStats {
  stats: {
    totalDonors: number;
    totalStudents: number;
    totalAssignments: number;
    totalDocuments: number;
  };
  recentActivity: {
    assigned_at: string;
    donor_first_name: string;
    donor_last_name: string;
    student_first_name: string;
    student_last_name: string;
  }[];
}

class AdminService {
  async getDonors(): Promise<{ donors: AdminDonor[] }> {
    const response = await api.get('/admin/donors');
    return response.data;
  }

  async getStudents(): Promise<{ students: AdminStudent[] }> {
    const response = await api.get('/admin/students');
    return response.data;
  }

  async getAssignments(): Promise<{ assignments: Assignment[] }> {
    const response = await api.get('/admin/assignments');
    return response.data;
  }

  async assignStudent(donorId: number, studentId: number, notes?: string): Promise<{ message: string; assignmentId?: number }> {
    const response = await api.post('/admin/assign', {
      donorId,
      studentId,
      notes
    });
    return response.data;
  }

  async unassignStudent(donorId: number, studentId: number): Promise<{ message: string }> {
    const response = await api.post('/admin/unassign', {
      donorId,
      studentId
    });
    return response.data;
  }

  async getDonorDetails(donorId: number): Promise<{ donor: DetailedDonor }> {
    const response = await api.get(`/admin/donors/${donorId}`);
    return response.data;
  }

  async getStudentDetails(studentId: number): Promise<{ student: DetailedStudent }> {
    const response = await api.get(`/admin/students/${studentId}`);
    return response.data;
  }

  async removeDonor(donorId: number): Promise<{ message: string }> {
    const response = await api.delete(`/admin/donors/${donorId}`);
    return response.data;
  }

  async removeStudent(studentId: number): Promise<{ message: string }> {
    const response = await api.delete(`/admin/students/${studentId}`);
    return response.data;
  }

  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }
}

export default new AdminService();