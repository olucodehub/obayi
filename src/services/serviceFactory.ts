import APP_CONFIG from '../config/appConfig';

// Import localStorage services
import { 
  AuthService as LocalAuthService,
  MatchingService,
  CertificateService,
  ReceiptService,
  AchievementService,
  FileService
} from '../utils/auth';

// Import production API services
import {
  ProductionAuthService,
  ProductionStudentService,
  ProductionDonorService,
  ProductionAdminService
} from './productionApi';

// Service factory that returns the appropriate service based on configuration
export class ServiceFactory {
  static getAuthService() {
    if (APP_CONFIG.AUTH_MODE === 'api') {
      return ProductionAuthService;
    } else {
      // Extend LocalAuthService with additional methods
      return {
        ...LocalAuthService,
        updateProfile: (profileData: any) => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const updatedUser = { ...user, ...profileData };
          LocalAuthService.updateUser(user.id, updatedUser);
          return Promise.resolve();
        },
        changePassword: (currentPassword: string, newPassword: string) => {
          // For localStorage mode, simulate password change
          return Promise.resolve();
        }
      };
    }
  }
  
  static getStudentService() {
    if (APP_CONFIG.AUTH_MODE === 'api') {
      return ProductionStudentService;
    } else {
      // Return localStorage-based student service wrapper
      return {
        getProfile: () => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          // Simulate API response format
          const certificates = CertificateService.getCertificatesByUser(user.id);
          const receipts = ReceiptService.getReceiptsByUser(user.id);
          const profileFiles = FileService.getFilesByUser(user.id, 'profile');
          
          return Promise.resolve({
            ...user,
            profilePicture: profileFiles.length > 0 ? profileFiles[0].data : null,
            documents: [
              ...certificates.map(cert => ({
                id: cert.id,
                documentTitle: cert.name,
                documentType: 'certificate',
                fileName: cert.fileName || 'Certificate',
                uploadedAt: cert.uploadedAt,
                description: cert.description
              })),
              ...receipts.map(receipt => ({
                id: receipt.id,
                documentTitle: receipt.description,
                documentType: 'receipt', 
                fileName: receipt.fileName || 'Receipt',
                uploadedAt: receipt.uploadedAt,
                amount: receipt.amount
              }))
            ]
          });
        },
        
        updateProfile: (profileData: any) => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const updatedUser = { ...user, ...profileData };
          LocalAuthService.updateUser(user.id, updatedUser);
          return Promise.resolve();
        },
        
        uploadProfilePicture: async (file: File) => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const fileId = await FileService.uploadFile(file, user.id, 'profile');
          const fileData = FileService.getFileById(fileId);
          return Promise.resolve(fileData?.data || '');
        },
        
        uploadDocument: async (file: File, documentType: string, documentTitle: string, description?: string, amount?: string) => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          if (documentType === 'certificate') {
            const certId = await CertificateService.addCertificate(user.id, documentTitle, description || '', file);
            return Promise.resolve({ documentId: certId });
          } else if (documentType === 'receipt') {
            const receiptId = await ReceiptService.addReceipt(user.id, documentTitle, amount || '0', file);
            return Promise.resolve({ documentId: receiptId });
          }
          
          throw new Error('Unsupported document type');
        },
        
        deleteDocument: (documentId: string) => {
          // Try certificates first, then receipts
          try {
            const certificates = CertificateService.getCertificates();
            if (certificates.find(c => c.id === documentId)) {
              // Delete certificate - no direct delete method, so skip for localStorage mode
              return Promise.resolve();
            }
            
            ReceiptService.deleteReceipt(documentId);
            return Promise.resolve();
          } catch (error) {
            return Promise.reject(error);
          }
        },
        
        getDocuments: () => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const certificates = CertificateService.getCertificatesByUser(user.id);
          const receipts = ReceiptService.getReceiptsByUser(user.id);
          
          return Promise.resolve([
            ...certificates.map(cert => ({
              id: cert.id,
              documentTitle: cert.name,
              documentType: 'certificate',
              fileName: cert.fileName || 'Certificate',
              uploadedAt: cert.uploadedAt,
              description: cert.description
            })),
            ...receipts.map(receipt => ({
              id: receipt.id,
              documentTitle: receipt.description,
              documentType: 'receipt',
              fileName: receipt.fileName || 'Receipt', 
              uploadedAt: receipt.uploadedAt,
              amount: receipt.amount
            }))
          ]);
        }
      };
    }
  }
  
  static getDonorService() {
    if (APP_CONFIG.AUTH_MODE === 'api') {
      return ProductionDonorService;
    } else {
      return {
        getProfile: () => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          return Promise.resolve(user);
        },
        
        getAssignedStudents: () => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          const matches = MatchingService.getDonorMatches(user.id);
          const students = matches.map(match => {
            const student = LocalAuthService.getUsers().find(u => u.id === match.studentId);
            if (student) {
              const certificates = CertificateService.getCertificatesByUser(student.id);
              const receipts = ReceiptService.getReceiptsByUser(student.id);
              
              return {
                ...student,
                assignedAt: match.createdAt,
                totalDonors: MatchingService.getStudentMatches(student.id).length,
                documentCount: certificates.length + receipts.length,
                documents: [
                  ...certificates.map(cert => ({
                    id: cert.id,
                    documentTitle: cert.name,
                    documentType: 'certificate',
                    fileName: cert.fileName || 'Certificate',
                    uploadedAt: cert.uploadedAt
                  })),
                  ...receipts.map(receipt => ({
                    id: receipt.id,
                    documentTitle: receipt.description,
                    documentType: 'receipt',
                    fileName: receipt.fileName || 'Receipt',
                    uploadedAt: receipt.uploadedAt
                  }))
                ]
              };
            }
            return null;
          }).filter(Boolean);
          
          return Promise.resolve(students);
        },
        
        updateProfile: (profileData: any) => {
          const user = LocalAuthService.getCurrentUser();
          if (!user) throw new Error('User not authenticated');
          
          LocalAuthService.updateUser(user.id, profileData);
          return Promise.resolve();
        }
      };
    }
  }
  
  static getAdminService() {
    if (APP_CONFIG.AUTH_MODE === 'api') {
      return ProductionAdminService;
    } else {
      return {
        getDashboardData: () => {
          const users = LocalAuthService.getUsers();
          const students = users.filter(u => u.userType === 'student');
          const donors = users.filter(u => u.userType === 'donor');
          const matches = MatchingService.getMatches();
          
          return Promise.resolve({
            students,
            donors,
            matches,
            totalUsers: users.length,
            totalStudents: students.length,
            totalDonors: donors.length,
            totalMatches: matches.length
          });
        },
        
        getAllUsers: () => {
          return Promise.resolve(LocalAuthService.getUsers());
        },
        
        createAssignment: (donorId: string, studentId: string) => {
          MatchingService.createMatch(donorId, studentId);
          return Promise.resolve();
        },
        
        removeAssignment: (assignmentId: string) => {
          // Find and remove match by ID
          const matches = MatchingService.getMatches();
          const match = matches.find(m => m.id === assignmentId);
          if (match) {
            MatchingService.removeMatch(match.donorId, match.studentId);
          }
          return Promise.resolve();
        }
      };
    }
  }
}

// Export convenience methods
export const AuthService = ServiceFactory.getAuthService();
export const StudentService = ServiceFactory.getStudentService();
export const DonorService = ServiceFactory.getDonorService();
export const AdminService = ServiceFactory.getAdminService();

export default ServiceFactory;