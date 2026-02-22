export type UserRole = 'donor' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserRole;
  password?: string;
  createdAt: string;
  phone?: string;
  bio?: string;
  // Student specific fields
  school?: string;
  gradeLevel?: string;
  dateOfBirth?: string;
  gender?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  fieldOfStudy?: string;
  profilePicture?: string;
  // Donor specific fields
  occupation?: string;
  company?: string;
  organization?: string;
}

export interface Match {
  id: string;
  donorId: string;
  studentId: string;
  createdAt: string;
}

export interface FileUpload {
  id: string;
  userId: string;
  type: 'profile' | 'transcript' | 'receipt';
  name: string;
  data: string;
  uploadedAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  term: string;
  year: string;
  grades: { subject: string; grade: string }[];
  transcriptFileId?: string;
  feeReceiptFileId?: string;
  notes?: string;
  createdAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'donor' | 'student';
  phone?: string;
  bio?: string;
  // Donor fields
  occupation?: string;
  company?: string;
  // Student fields
  school?: string;
  gradeLevel?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  refreshProfile: () => Promise<void>;
}