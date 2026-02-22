import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService, MatchingService, FileService, AchievementService } from '../../utils/auth';
import { StudentService } from '../../services/serviceFactory';
import { User } from '../../types/auth';
import { User as UserIcon, Heart, FileText, Upload, Camera, Plus, X, Check, AlertCircle, Award, Star, Trophy, Lock, Settings } from 'lucide-react';
import PasswordChangeModal from '../../components/PasswordChangeModal';

const StudentDashboard: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [assignedDonors, setAssignedDonors] = useState<User[]>([]);
  const [myFiles, setMyFiles] = useState<Array<{ id: string; name: string; type: string; uploadedAt: string }>>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [certificates, setCertificates] = useState<Array<{
    id: string;
    name: string;
    description: string;
    file?: File;
    fileName?: string;
    uploadedAt?: string;
    isUploading: boolean;
    uploadSuccess: boolean;
    isSaved?: boolean;
  }>>([]);
  const [receipts, setReceipts] = useState<Array<{
    id: string;
    description: string;
    amount: string;
    file?: File;
    fileName?: string;
    uploadedAt?: string;
    isUploading: boolean;
    uploadSuccess: boolean;
    isSaved?: boolean;
  }>>([]);
  const [savedCertificates, setSavedCertificates] = useState<Array<{
    id: string;
    userId: string;
    name: string;
    description: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }>>([]);
  const [savedReceipts, setSavedReceipts] = useState<Array<{
    id: string;
    userId: string;
    description: string;
    amount: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }>>([]);
  const [achievements, setAchievements] = useState<Array<{
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    dateAchieved: string;
    createdAt: string;
  }>>([]);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    category: 'Academic',
    dateAchieved: new Date().toISOString().split('T')[0]
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const achievementCategories = [
    'Academic',
    'Sports',
    'Arts & Culture',
    'Community Service',
    'Leadership',
    'Competition',
    'Certification',
    'Other'
  ];
  
  const certificateOptions = [
    'High School Diploma',
    'University Transcript',
    'College Degree',
    'Certificate of Achievement',
    'Academic Excellence Award',
    'Scholarship Certificate',
    'Vocational Certificate',
    'Professional Certification',
    'Other (specify)'
  ];
  
  const receiptTypes = [
    'Tuition Fee',
    'Registration Fee',
    'Examination Fee',
    'Library Fee',
    'Laboratory Fee',
    'Sports Fee',
    'Transportation Fee',
    'Accommodation Fee',
    'Textbooks',
    'Other (specify)'
  ];
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    school: user?.school || '',
    gradeLevel: user?.gradeLevel || '',
    dateOfBirth: user?.dateOfBirth || '',
    guardianName: user?.guardianName || '',
    guardianPhone: user?.guardianPhone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    fieldOfStudy: user?.fieldOfStudy || '',
    bio: user?.bio || '',
  });

  const loadAssignedDonors = useCallback(() => {
    if (!user) return;
    
    const matches = MatchingService.getStudentMatches(user.id);
    const donors = matches.map(match => {
      const donor = AuthService.getUsers().find(u => u.id === match.donorId);
      return donor;
    }).filter(Boolean) as User[];
    
    setAssignedDonors(donors);
  }, [user]);

  const loadMyFiles = useCallback(() => {
    if (!user) return;
    
    const files = FileService.getFilesByUser(user.id);
    setMyFiles(files);
  }, [user]);

  const loadSavedDocuments = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch profile with documents from API
      const profile: any = await StudentService.getProfile();

      // Separate documents by type
      const certificates = profile.documents?.filter((doc: any) =>
        doc.documentType === 'certificate' ||
        doc.documentType === 'primary_certificate' ||
        doc.documentType === 'secondary_certificate' ||
        doc.documentType === 'university_certificate'
      ) || [];

      const receipts = profile.documents?.filter((doc: any) =>
        doc.documentType === 'receipt'
      ) || [];

      setSavedCertificates(certificates.map((doc: any) => ({
        id: doc.id,
        userId: user.id,
        name: doc.documentTitle,
        description: doc.description || '',
        fileName: doc.fileName,
        uploadedAt: doc.uploadedAt
      })));

      setSavedReceipts(receipts.map((doc: any) => ({
        id: doc.id,
        userId: user.id,
        description: doc.documentTitle,
        amount: doc.amount || '0',
        fileName: doc.fileName,
        uploadedAt: doc.uploadedAt
      })));

      // Set profile picture if exists
      if (profile.profilePicture) {
        setProfilePicture(profile.profilePicture);
      }
    } catch (error) {
      console.error('Failed to load documents from API:', error);
    }

    // Load achievements (still using localStorage for now)
    const userAchievements = AchievementService.getAchievementsByUser(user.id);
    setAchievements(userAchievements);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAssignedDonors();
      loadMyFiles();
      loadSavedDocuments();
    }
  }, [user, loadAssignedDonors, loadMyFiles, loadSavedDocuments]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentService.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        school: profileData.school,
        gradeLevel: profileData.gradeLevel,
        dateOfBirth: profileData.dateOfBirth,
        guardianName: profileData.guardianName,
        guardianPhone: profileData.guardianPhone,
        address: profileData.address,
        city: profileData.city,
        country: profileData.country,
        fieldOfStudy: profileData.fieldOfStudy,
        bio: profileData.bio
      });
      
      // Refresh the user context
      await refreshProfile();
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'transcript' | 'receipt') => {
    const file = e.target.files?.[0];
    if (file && user) {
      setUploadingFile(type);
      try {
        await FileService.uploadFile(file, user.id, type);
        loadMyFiles();
      } catch (error) {
        console.error('Failed to upload file:', error);
      } finally {
        setUploadingFile(null);
      }
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setUploadingProfile(true);
      try {
        // Create a temporary URL to preview the image immediately
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl);
        
        // Upload to backend (this would update the user profile)
        await FileService.uploadFile(file, user.id, 'profile');
        
        // Note: In a real app, you'd get the permanent URL from the server response
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        setProfilePicture(user?.profilePicture || null); // Revert on error
      } finally {
        setUploadingProfile(false);
      }
    }
  };

  const addCertificate = () => {
    const newCertificate = {
      id: Date.now().toString(),
      name: certificateOptions[0],
      description: '',
      isUploading: false,
      uploadSuccess: false
    };
    setCertificates([...certificates, newCertificate]);
  };

  const updateCertificate = (id: string, field: string, value: string) => {
    setCertificates(certs => 
      certs.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const handleCertificateFileUpload = async (id: string, file: File) => {
    setCertificates(certs =>
      certs.map(cert =>
        cert.id === id ? { ...cert, isUploading: true, file, fileName: file.name } : cert
      )
    );

    try {
      const cert = certificates.find(c => c.id === id);
      if (cert && user) {
        // Upload to database via API
        await StudentService.uploadDocument(file, 'certificate', cert.name, cert.description);

        setCertificates(certs =>
          certs.map(cert =>
            cert.id === id
              ? { ...cert, isUploading: false, uploadSuccess: true, isSaved: true, uploadedAt: new Date().toISOString() }
              : cert
          )
        );

        // Refresh saved certificates from database
        loadSavedDocuments();
      }
    } catch (error) {
      console.error('Failed to upload certificate:', error);
      setCertificates(certs =>
        certs.map(cert =>
          cert.id === id ? { ...cert, isUploading: false, uploadSuccess: false } : cert
        )
      );
    }
  };

  const addReceipt = () => {
    const newReceipt = {
      id: Date.now().toString(),
      description: receiptTypes[0],
      amount: '',
      isUploading: false,
      uploadSuccess: false
    };
    setReceipts([...receipts, newReceipt]);
  };

  const updateReceipt = (id: string, field: string, value: string) => {
    setReceipts(recs => 
      recs.map(rec => 
        rec.id === id ? { ...rec, [field]: value } : rec
      )
    );
  };

  const handleReceiptFileUpload = async (id: string, file: File) => {
    setReceipts(recs =>
      recs.map(rec =>
        rec.id === id ? { ...rec, isUploading: true, file, fileName: file.name } : rec
      )
    );

    try {
      const receipt = receipts.find(r => r.id === id);
      if (receipt && user) {
        // Upload to database via API
        await StudentService.uploadDocument(file, 'receipt', receipt.description, receipt.description, receipt.amount);

        setReceipts(recs =>
          recs.map(rec =>
            rec.id === id
              ? { ...rec, isUploading: false, uploadSuccess: true, isSaved: true, uploadedAt: new Date().toISOString() }
              : rec
          )
        );

        // Refresh saved receipts from database
        loadSavedDocuments();
      }
    } catch (error) {
      console.error('Failed to upload receipt:', error);
      setReceipts(recs =>
        recs.map(rec =>
          rec.id === id ? { ...rec, isUploading: false, uploadSuccess: false } : rec
        )
      );
    }
  };

  const deleteReceipt = (id: string) => {
    setReceipts(recs => recs.filter(rec => rec.id !== id));
  };

  const deleteSavedReceipt = async (id: string) => {
    try {
      await StudentService.deleteDocument(id);
      loadSavedDocuments();
    } catch (error) {
      console.error('Failed to delete receipt:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} at ${timeStr}`;
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAchievement.title.trim()) return;

    try {
      AchievementService.addAchievement(
        user.id,
        newAchievement.title,
        newAchievement.description,
        newAchievement.category,
        newAchievement.dateAchieved
      );
      
      // Refresh achievements
      const userAchievements = AchievementService.getAchievementsByUser(user.id);
      setAchievements(userAchievements);
      
      // Reset form
      setNewAchievement({
        title: '',
        description: '',
        category: 'Academic',
        dateAchieved: new Date().toISOString().split('T')[0]
      });
      setIsAddingAchievement(false);
    } catch (error) {
      console.error('Failed to add achievement:', error);
    }
  };

  const handleDeleteAchievement = (achievementId: string) => {
    AchievementService.deleteAchievement(achievementId);
    const userAchievements = AchievementService.getAchievementsByUser(user!.id);
    setAchievements(userAchievements);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic': return '🎓';
      case 'Sports': return '🏆';
      case 'Arts & Culture': return '🎨';
      case 'Community Service': return '🤝';
      case 'Leadership': return '👑';
      case 'Competition': return '🥇';
      case 'Certification': return '📜';
      default: return '⭐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'bg-blue-100 text-blue-800';
      case 'Sports': return 'bg-green-100 text-green-800';
      case 'Arts & Culture': return 'bg-purple-100 text-purple-800';
      case 'Community Service': return 'bg-pink-100 text-pink-800';
      case 'Leadership': return 'bg-yellow-100 text-yellow-800';
      case 'Competition': return 'bg-orange-100 text-orange-800';
      case 'Certification': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100">
      <div className="container pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-700 mb-2">
            Welcome, {user.firstName}!
          </h1>
          <p className="text-gray-600">Manage your profile and track your educational progress.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  title="Change Password"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Password
                </button>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                >
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-12 h-12 text-cyan-600" />
                  )}
                  {uploadingProfile && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-cyan-600 text-white p-2 rounded-full cursor-pointer hover:bg-cyan-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                    disabled={uploadingProfile}
                  />
                </label>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-cyan-600 font-medium">Student</p>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="School"
                  value={profileData.school}
                  onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Grade Level"
                  value={profileData.gradeLevel}
                  onChange={(e) => setProfileData({ ...profileData, gradeLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Guardian Name"
                  value={profileData.guardianName}
                  onChange={(e) => setProfileData({ ...profileData, guardianName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Bio"
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">School:</span>
                  <span className="ml-2 text-gray-600">{user.school}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Grade:</span>
                  <span className="ml-2 text-gray-600">{user.gradeLevel}</span>
                </div>
                {user.dateOfBirth && (
                  <div>
                    <span className="font-medium text-gray-700">Date of Birth:</span>
                    <span className="ml-2 text-gray-600">{new Date(user.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {user.guardianName && (
                  <div>
                    <span className="font-medium text-gray-700">Guardian:</span>
                    <span className="ml-2 text-gray-600">{user.guardianName}</span>
                  </div>
                )}
                {user.bio && (
                  <div>
                    <span className="font-medium text-gray-700">About:</span>
                    <p className="mt-1 text-gray-600">{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Donors Section */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-cyan-600" />
              My Sponsors ({assignedDonors.length})
            </h2>

            {assignedDonors.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sponsors assigned yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Keep updating your profile and uploading your progress. Sponsors will be matched to you soon!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center mr-4">
                        <Heart className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Anonymous Sponsor</h3>
                        <p className="text-sm text-gray-600">
                          Supporting your education with care
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-700">
                        "We believe in your potential and are here to support your educational journey. Keep working hard!"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Achievements Section */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-cyan-600" />
                My Achievements
              </h2>
              <button
                onClick={() => setIsAddingAchievement(true)}
                className="flex items-center px-3 py-1 text-sm bg-cyan-100 text-cyan-700 rounded-md hover:bg-cyan-200 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Achievement
              </button>
            </div>

            {/* Add Achievement Form */}
            {isAddingAchievement && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <form onSubmit={handleAddAchievement} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Achievement Title *
                      </label>
                      <input
                        type="text"
                        value={newAchievement.title}
                        onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                        placeholder="e.g., Honor Roll, Science Fair Winner"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newAchievement.category}
                        onChange={(e) => setNewAchievement({...newAchievement, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                      >
                        {achievementCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newAchievement.description}
                        onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                        placeholder="Brief description"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Achieved
                      </label>
                      <input
                        type="date"
                        value={newAchievement.dateAchieved}
                        onChange={(e) => setNewAchievement({...newAchievement, dateAchieved: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-sm"
                    >
                      Save Achievement
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAchievement(false);
                        setNewAchievement({ title: '', description: '', category: 'Academic', dateAchieved: new Date().toISOString().split('T')[0] });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Achievements List */}
            {achievements.length === 0 ? (
              <div className="text-center py-6">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No achievements yet</h3>
                <p className="text-xs text-gray-600 mb-3">Start by adding your first achievement!</p>
                <button
                  onClick={() => setIsAddingAchievement(true)}
                  className="px-3 py-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-xs"
                >
                  Add Achievement
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {achievements.slice(-3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 text-lg">
                      {getCategoryIcon(achievement.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-xs">
                            {achievement.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                              {achievement.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(achievement.dateAchieved).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAchievement(achievement.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0 ml-1"
                          title="Delete achievement"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {achievements.length > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500">
                      Showing latest 3 of {achievements.length} achievements
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Documents Section - Now spans full width */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Upload Documents
          </h2>
          <div className="bg-white rounded-xl shadow-card p-6">

            <div className="space-y-8">
              {/* Certificates Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Academic Certificates & Achievements</h3>
                  <button
                    onClick={addCertificate}
                    className="flex items-center px-3 py-1 text-sm bg-cyan-100 text-cyan-700 rounded-md hover:bg-cyan-200 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certificate
                  </button>
                </div>

                {certificates.length === 0 ? (
                  <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg text-center">
                    No certificates added yet. Click "Add Certificate" to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Certificate Type
                            </label>
                            <select
                              value={cert.name}
                              onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                            >
                              {certificateOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          
                          {cert.name === 'Other (specify)' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Custom Certificate Name
                              </label>
                              <input
                                type="text"
                                value={cert.description}
                                onChange={(e) => updateCertificate(cert.id, 'description', e.target.value)}
                                placeholder="Enter certificate name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                              />
                            </div>
                          )}
                        </div>

                        {cert.name !== 'Other (specify)' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description (Optional)
                            </label>
                            <input
                              type="text"
                              value={cert.description}
                              onChange={(e) => updateCertificate(cert.id, 'description', e.target.value)}
                              placeholder="Additional details about this certificate"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Certificate
                          </label>
                          <div className="flex items-center space-x-3">
                            <label className="flex-1">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-400 transition-colors">
                                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-600">
                                  {cert.isUploading ? 'Uploading...' : (cert.fileName || 'Click to upload file')}
                                </p>
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleCertificateFileUpload(cert.id, file);
                                }}
                                disabled={cert.isUploading}
                              />
                            </label>
                            
                            {cert.isUploading && (
                              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-md">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-blue-700">Uploading...</span>
                              </div>
                            )}
                            
                            {cert.uploadSuccess && (
                              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-md">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-700">Uploaded!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fee Receipts Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Fee Receipts</h3>
                  <button
                    onClick={addReceipt}
                    className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Receipt
                  </button>
                </div>

                {receipts.length === 0 ? (
                  <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg text-center">
                    No receipts uploaded yet. Click "Add Receipt" to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {receipts.map((receipt) => (
                      <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Receipt Type
                            </label>
                            <select
                              value={receipt.description}
                              onChange={(e) => updateReceipt(receipt.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                            >
                              {receiptTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Amount
                            </label>
                            <input
                              type="text"
                              value={receipt.amount}
                              onChange={(e) => updateReceipt(receipt.id, 'amount', e.target.value)}
                              placeholder="Enter amount (e.g., $500, ₦50,000)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Receipt
                          </label>
                          <div className="flex items-center space-x-3">
                            <label className="flex-1">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 transition-colors">
                                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-600">
                                  {receipt.isUploading ? 'Uploading...' : (receipt.fileName || 'Click to upload receipt')}
                                </p>
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleReceiptFileUpload(receipt.id, file);
                                }}
                                disabled={receipt.isUploading}
                              />
                            </label>
                            
                            {receipt.isUploading && (
                              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-md">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-blue-700">Uploading...</span>
                              </div>
                            )}
                            
                            {receipt.uploadSuccess && (
                              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-md">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-700">Uploaded!</span>
                              </div>
                            )}
                            
                            <button
                              onClick={() => deleteReceipt(receipt.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete receipt"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Document Overview Section - Redesigned */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Document Overview
          </h2>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Certificates Overview */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-cyan-600" />
                    My Certificates
                  </h3>
                  <span className="text-sm bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full font-medium">
                    {savedCertificates.length}
                  </span>
                </div>
                
                {savedCertificates.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No certificates uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {savedCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {cert.name === 'Other (specify)' ? cert.description : cert.name}
                          </p>
                          {cert.fileName && (
                            <p className="text-xs text-gray-500 truncate">{cert.fileName}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            {formatDateTime(cert.uploadedAt)}
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Receipts Overview */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    My Receipts
                  </h3>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    {savedReceipts.length}
                  </span>
                </div>
                
                {savedReceipts.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No receipts uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {savedReceipts.map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="font-medium text-gray-900 text-sm">
                            {receipt.description}
                          </p>
                          <p className="text-sm text-green-600 font-semibold">
                            {receipt.amount}
                          </p>
                          {receipt.fileName && (
                            <p className="text-xs text-gray-500 truncate">{receipt.fileName}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            {formatDateTime(receipt.uploadedAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Check className="w-5 h-5 text-green-500" />
                          <button
                            onClick={() => deleteSavedReceipt(receipt.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete receipt"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

export default StudentDashboard;