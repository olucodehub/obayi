import React, { useState, useEffect, useCallback } from 'react';
import { Users, BookOpen, Eye, Calendar, Heart, User, FileText, Award, GraduationCap, Download, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService, MatchingService, CertificateService, ReceiptService, AchievementService, FileService } from '../../utils/auth';
import { User as UserType } from '../../types/auth';
import PasswordChangeModal from '../../components/PasswordChangeModal';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [assignedStudents, setAssignedStudents] = useState<UserType[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const loadAssignedStudents = useCallback(() => {
    if (!user) return;
    
    try {
      const matches = MatchingService.getDonorMatches(user.id);
      const students = matches.map(match => {
        const student = AuthService.getUsers().find(u => u.id === match.studentId);
        if (student) {
          // Add document count and other calculated fields
          const documentStats = getStudentDocumentStats(student.id);
          return {
            ...student,
            documentCount: documentStats.total,
            assignedAt: match.createdAt,
            totalDonors: MatchingService.getStudentMatches(student.id).length,
            documents: [
              ...CertificateService.getCertificatesByUser(student.id).map(cert => ({
                id: cert.id,
                documentTitle: cert.name,
                documentType: 'certificate',
                fileName: cert.fileName || 'Certificate',
                uploadedAt: cert.uploadedAt
              })),
              ...ReceiptService.getReceiptsByUser(student.id).map(receipt => ({
                id: receipt.id,
                documentTitle: receipt.description,
                documentType: 'receipt',
                fileName: receipt.fileName || 'Receipt',
                uploadedAt: receipt.uploadedAt
              }))
            ]
          };
        }
        return student;
      }).filter(Boolean) as UserType[];
      
      setAssignedStudents(students);
      setError(null);
    } catch (err) {
      setError('Failed to load assigned students');
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAssignedStudents();
    }
  }, [user, loadAssignedStudents]);

  const getStudentDocumentStats = (studentId: string) => {
    const certificates = CertificateService.getCertificatesByUser(studentId);
    const receipts = ReceiptService.getReceiptsByUser(studentId);
    const achievements = AchievementService.getAchievementsByUser(studentId);
    return { 
      certificates: certificates.length, 
      receipts: receipts.length, 
      achievements: achievements.length,
      total: certificates.length + receipts.length
    };
  };

  const loadStudentDetails = useCallback((studentId: string) => {
    const student = assignedStudents.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
    }
  }, [assignedStudents]);

  const handleDownloadDocument = useCallback((studentId: string, docId: string, fileName: string) => {
    try {
      // Find the file in localStorage
      const file = FileService.getFileById(docId);
      if (file && file.data) {
        // Create a download link
        const link = document.createElement('a');
        link.href = file.data;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError('File not found');
      }
    } catch (err) {
      setError('Failed to download file');
      console.error('Download error:', err);
    }
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} at ${timeStr}`;
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      school_result: 'School Results',
      receipt: 'Receipt',
      primary_certificate: 'Primary Certificate',
      secondary_certificate: 'Secondary Certificate',
      university_certificate: 'University Certificate',
      other: 'Other Document'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your sponsored students and track their progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{assignedStudents.length}</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-cyan-600" />
                  Your Students
                </h2>
              </div>
              
              {assignedStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Yet</h3>
                  <p className="text-gray-600">
                    You haven't been assigned any students yet. Contact an administrator to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {assignedStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => loadStudentDetails(student.id)}
                    >
                      <div className="flex items-center space-x-4">
                        {student.profilePicture ? (
                          <img 
                            src={student.profilePicture} 
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-cyan-600" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {student.totalDonors} donors supporting
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            {student.schoolName && (
                              <span className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                {student.schoolName}
                              </span>
                            )}
                            {student.gradeLevel && (
                              <span>Grade {student.gradeLevel}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              Assigned {new Date(student.assignedAt).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-cyan-600">
                              {student.documentCount || 0} documents
                            </span>
                          </div>
                        </div>
                        
                        <Eye className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Student Details */}
          <div>
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
              </div>
              
              {!selectedStudent ? (
                <div className="p-6 text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a student to view details</p>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Profile */}
                  <div className="text-center">
                    {selectedStudent.profilePicture ? (
                      <img 
                        src={selectedStudent.profilePicture} 
                        alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-3">
                        <User className="w-10 h-10 text-cyan-600" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      {selectedStudent.schoolName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">School:</span>
                          <span className="font-medium">{selectedStudent.schoolName}</span>
                        </div>
                      )}
                      {selectedStudent.gradeLevel && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grade:</span>
                          <span className="font-medium">{selectedStudent.gradeLevel}</span>
                        </div>
                      )}
                      {selectedStudent.fieldOfStudy && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Field:</span>
                          <span className="font-medium">{selectedStudent.fieldOfStudy}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donors:</span>
                        <span className="font-medium">{selectedStudent.totalDonors}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Documents</h4>
                    {selectedStudent.documents.length === 0 ? (
                      <p className="text-gray-500 text-sm">No documents uploaded yet</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedStudent.documents.map((doc) => (
                          <div 
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.documentTitle}
                              </p>
                              <p className="text-xs text-gray-500">
                                {getDocumentTypeLabel(doc.documentType)} • 
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDownloadDocument(selectedStudent.id, doc.id, doc.fileName)}
                              className="ml-2 p-1 text-cyan-600 hover:text-cyan-800"
                              title="Download document"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {selectedStudent.bio && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">About</h4>
                      <p className="text-sm text-gray-600">{selectedStudent.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        <PasswordChangeModal 
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
};

export default DonorDashboard;