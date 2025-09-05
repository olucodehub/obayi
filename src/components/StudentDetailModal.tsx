import React from 'react';
import { User } from '../types/auth';
import { CertificateService, ReceiptService, FileService } from '../utils/auth';
import { X, FileText, Download, Eye, Check, Calendar, DollarSign, Award } from 'lucide-react';

interface StudentDetailModalProps {
  student: User;
  isOpen: boolean;
  onClose: () => void;
  hasAssignedDonor: boolean;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  hasAssignedDonor
}) => {
  const [savedCertificates, setSavedCertificates] = React.useState<Array<{
    id: string;
    userId: string;
    name: string;
    description: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }>>([]);
  
  const [savedReceipts, setSavedReceipts] = React.useState<Array<{
    id: string;
    userId: string;
    description: string;
    amount: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }>>([]);

  React.useEffect(() => {
    if (isOpen && student) {
      const certs = CertificateService.getCertificatesByUser(student.id);
      const recs = ReceiptService.getReceiptsByUser(student.id);
      setSavedCertificates(certs);
      setSavedReceipts(recs);
    }
  }, [isOpen, student]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} at ${timeStr}`;
  };

  const viewDocument = (fileId: string) => {
    const file = FileService.getFileById(fileId);
    if (file && file.data) {
      // Open in new window/tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${file.name}</title></head>
            <body style="margin:0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f3f4f6;">
              ${file.data.startsWith('data:image') 
                ? `<img src="${file.data}" style="max-width: 90vw; max-height: 90vh; object-fit: contain;" alt="${file.name}" />`
                : `<embed src="${file.data}" width="90%" height="90%" type="application/pdf" />`
              }
            </body>
          </html>
        `);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-cyan-600">
                {student.firstName[0]}{student.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-gray-600">{student.email}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hasAssignedDonor 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {hasAssignedDonor ? 'Has Donor' : 'No Donor'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">School:</span>
                    <p className="text-gray-600 mt-1">{student.school || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Grade Level:</span>
                    <p className="text-gray-600 mt-1">{student.gradeLevel || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date of Birth:</span>
                    <p className="text-gray-600 mt-1">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Joined:</span>
                    <p className="text-gray-600 mt-1">{new Date(student.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {student.guardianName && (
                  <div>
                    <span className="font-medium text-gray-700">Guardian:</span>
                    <p className="text-gray-600 mt-1">
                      {student.guardianName} 
                      {student.guardianPhone && ` • ${student.guardianPhone}`}
                    </p>
                  </div>
                )}
                {student.address && (
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-600 mt-1">{student.address}</p>
                  </div>
                )}
                {student.bio && (
                  <div>
                    <span className="font-medium text-gray-700">Bio:</span>
                    <p className="text-gray-600 mt-1">{student.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Summary</h3>
              <div className="space-y-4">
                <div className="bg-cyan-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-cyan-900 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Certificates
                    </h4>
                    <span className="bg-cyan-200 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
                      {savedCertificates.length}
                    </span>
                  </div>
                  <p className="text-sm text-cyan-700">
                    Academic certificates and achievements uploaded
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-900 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Fee Receipts
                    </h4>
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {savedReceipts.length}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Payment receipts and financial documents
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates Detail */}
          {savedCertificates.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-cyan-600" />
                Uploaded Certificates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCertificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {cert.name === 'Other (specify)' ? cert.description : cert.name}
                        </h4>
                        {cert.name !== 'Other (specify)' && cert.description && (
                          <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
                        )}
                      </div>
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    </div>
                    
                    {cert.fileName && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">{cert.fileName}</span>
                        </div>
                        {cert.fileId && (
                          <button
                            onClick={() => viewDocument(cert.fileId!)}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDateTime(cert.uploadedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receipts Detail */}
          {savedReceipts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Uploaded Fee Receipts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedReceipts.map((receipt) => (
                  <div key={receipt.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{receipt.description}</h4>
                        <p className="text-lg font-semibold text-green-600 mt-1">{receipt.amount}</p>
                      </div>
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    </div>
                    
                    {receipt.fileName && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">{receipt.fileName}</span>
                        </div>
                        {receipt.fileId && (
                          <button
                            onClick={() => viewDocument(receipt.fileId!)}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDateTime(receipt.uploadedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Documents Message */}
          {savedCertificates.length === 0 && savedReceipts.length === 0 && (
            <div className="mt-8 text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Uploaded</h3>
              <p className="text-gray-600">This student hasn't uploaded any certificates or receipts yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;