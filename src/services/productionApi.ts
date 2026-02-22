import axios from 'axios';
import { User, RegisterData } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check sessionStorage first (session-based), then localStorage (remember me)
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ProductionAuthService {
  static async login(email: string, password: string, rememberMe: boolean = false): Promise<User> {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      // Use localStorage if rememberMe is true, sessionStorage otherwise
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', token);

      // Fetch complete profile after login
      const profileResponse = await api.get('/auth/profile');
      const { profile } = profileResponse.data;

      const completeUser: User = {
        id: profile.id.toString(),
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        userType: profile.user_type,
        phone: profile.phone,
        // Student specific fields
        school: profile.school_name,
        gradeLevel: profile.grade_level,
        dateOfBirth: profile.date_of_birth,
        gender: profile.gender,
        guardianName: profile.guardian_name,
        guardianPhone: profile.guardian_phone,
        guardianEmail: profile.guardian_email,
        emergencyContactName: profile.emergency_contact_name,
        emergencyContactPhone: profile.emergency_contact_phone,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        fieldOfStudy: profile.field_of_study,
        profilePicture: profile.profile_picture_url,
        // Donor specific fields
        organization: profile.organization,
        donationAmount: profile.donation_amount,
        donationFrequency: profile.donation_frequency,
        preferredContact: profile.preferred_contact,
        bio: profile.bio,
        createdAt: profile.created_at
      };

      storage.setItem('current_user', JSON.stringify(completeUser));

      return completeUser;
    } catch (error: any) {
      // Handle network errors (API unreachable)
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_NAME_NOT_RESOLVED' || !error.response) {
        throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
      }
      // Handle API errors
      throw new Error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  }

  static async register(userData: RegisterData): Promise<User> {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;

      // Default to localStorage for registration (users can logout and choose session next time)
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(user));

      return user;
    } catch (error: any) {
      // Handle network errors (API unreachable)
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_NAME_NOT_RESOLVED' || !error.response) {
        throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
      }
      // Handle API errors
      throw new Error(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear both storages
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('current_user');
    }
  }

  static getCurrentUser(): User | null {
    // Check sessionStorage first (session-based login), then localStorage (remember me)
    const user = sessionStorage.getItem('current_user') || localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated(): boolean {
    // Check both sessionStorage and localStorage for auth token
    return sessionStorage.getItem('auth_token') !== null || localStorage.getItem('auth_token') !== null;
  }

  static async updateProfile(profileData: any): Promise<void> {
    try {
      await api.put('/auth/profile', profileData);

      // Update storage with new user data
      const response = await api.get('/auth/profile');
      const { profile } = response.data;

      const updatedUser: User = {
        id: profile.id.toString(),
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        userType: profile.user_type,
        phone: profile.phone,
        school: profile.school_name,
        gradeLevel: profile.grade_level,
        dateOfBirth: profile.date_of_birth,
        guardianName: profile.guardian_name,
        guardianPhone: profile.guardian_phone,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        fieldOfStudy: profile.field_of_study,
        bio: profile.bio,
        organization: profile.organization,
        createdAt: profile.created_at
      };

      // Save to the storage that has the token (maintains session type)
      const storage = sessionStorage.getItem('auth_token') ? sessionStorage : localStorage;
      storage.setItem('current_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  }
}

export class ProductionStudentService {
  static async getProfile(): Promise<User> {
    try {
      const response = await api.get('/students/profile');
      const profile = response.data;

      // Backend now returns camelCase, just ensure proper typing
      const user: User = {
        id: profile.id?.toString() || profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        userType: profile.userType,
        phone: profile.phone,
        school: profile.school,
        gradeLevel: profile.gradeLevel,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        guardianName: profile.guardianName,
        guardianPhone: profile.guardianPhone,
        guardianEmail: profile.guardianEmail,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactPhone: profile.emergencyContactPhone,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        fieldOfStudy: profile.fieldOfStudy,
        bio: profile.bio,
        profilePicture: profile.profilePicture,
        createdAt: profile.createdAt
      };

      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  static async updateProfile(profileData: Partial<User>): Promise<void> {
    try {
      // Map camelCase to snake_case for backend
      const backendData: any = {};
      if (profileData.firstName) backendData.firstName = profileData.firstName;
      if (profileData.lastName) backendData.lastName = profileData.lastName;
      if (profileData.phone) backendData.phone = profileData.phone;
      if (profileData.school) backendData.schoolName = profileData.school;
      if (profileData.gradeLevel) backendData.gradeLevel = profileData.gradeLevel;
      if (profileData.dateOfBirth) backendData.dateOfBirth = profileData.dateOfBirth;
      if (profileData.gender) backendData.gender = profileData.gender;
      if (profileData.address) backendData.address = profileData.address;
      if (profileData.city) backendData.city = profileData.city;
      if (profileData.country) backendData.country = profileData.country;
      if (profileData.fieldOfStudy) backendData.fieldOfStudy = profileData.fieldOfStudy;
      if (profileData.guardianName) backendData.guardianName = profileData.guardianName;
      if (profileData.guardianPhone) backendData.guardianPhone = profileData.guardianPhone;
      if (profileData.guardianEmail) backendData.guardianEmail = profileData.guardianEmail;
      if (profileData.emergencyContactName) backendData.emergencyContactName = profileData.emergencyContactName;
      if (profileData.emergencyContactPhone) backendData.emergencyContactPhone = profileData.emergencyContactPhone;
      if (profileData.bio) backendData.bio = profileData.bio;

      await api.put('/students/profile', backendData);

      // Fetch updated profile
      const response = await api.get('/students/profile');
      const profile = response.data;

      // Update storage
      const updatedUser: User = {
        id: profile.id.toString(),
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        userType: profile.userType,
        phone: profile.phone,
        school: profile.school,
        gradeLevel: profile.gradeLevel,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        guardianName: profile.guardianName,
        guardianPhone: profile.guardianPhone,
        guardianEmail: profile.guardianEmail,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactPhone: profile.emergencyContactPhone,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        fieldOfStudy: profile.fieldOfStudy,
        bio: profile.bio,
        profilePicture: profile.profilePicture,
        createdAt: profile.createdAt
      };

      // Save to the storage that has the token (maintains session type)
      const storage = sessionStorage.getItem('auth_token') ? sessionStorage : localStorage;
      storage.setItem('current_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  static async uploadProfilePicture(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post('/students/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.profilePictureUrl;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to upload profile picture');
    }
  }

  static async uploadDocument(
    file: File, 
    documentType: string, 
    documentTitle: string, 
    description?: string,
    amount?: string
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('documentTitle', documentTitle);
      if (description) formData.append('description', description);
      if (amount) formData.append('amount', amount);
      
      const response = await api.post('/students/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to upload document');
    }
  }

  static async deleteDocument(documentId: string): Promise<void> {
    try {
      await api.delete(`/students/documents/${documentId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete document');
    }
  }

  static async getDocuments(): Promise<any[]> {
    try {
      const response = await api.get('/students/documents');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch documents');
    }
  }
}

export class ProductionDonorService {
  static async getProfile(): Promise<User> {
    try {
      const response = await api.get('/donors/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  static async getAssignedStudents(): Promise<User[]> {
    try {
      const response = await api.get('/donors/students');
      return response.data.students || [];  // Backend returns { students: [...] }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch assigned students');
    }
  }

  static async updateProfile(profileData: Partial<User>): Promise<void> {
    try {
      await api.put('/auth/profile', profileData);

      // Update storage with new user data
      const response = await api.get('/auth/profile');
      const { profile } = response.data;

      const updatedUser: User = {
        id: profile.id.toString(),
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        userType: profile.user_type,
        phone: profile.phone,
        organization: profile.organization,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        donationAmount: profile.donation_amount,
        donationFrequency: profile.donation_frequency,
        preferredContact: profile.preferred_contact,
        bio: profile.bio,
        createdAt: profile.created_at
      };

      // Save to the storage that has the token (maintains session type)
      const storage = sessionStorage.getItem('auth_token') ? sessionStorage : localStorage;
      storage.setItem('current_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }
}

export class ProductionAdminService {
  static async getDashboardData(): Promise<any> {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  static async createAssignment(donorId: string, studentId: string): Promise<void> {
    try {
      await api.post('/admin/assignments', { donorId, studentId });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create assignment');
    }
  }

  static async removeAssignment(assignmentId: string): Promise<void> {
    try {
      await api.delete(`/admin/assignments/${assignmentId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to remove assignment');
    }
  }
}

export default api;