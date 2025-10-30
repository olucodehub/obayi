import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService, MatchingService, CertificateService, ReceiptService, AchievementService } from '../../utils/auth';
import { User } from '../../types/auth';
import { Heart, GraduationCap, Settings, Link as LinkIcon, Eye, FileText, AlertCircle, Users, Calendar, Lock } from 'lucide-react';
import StudentDetailModal from '../../components/StudentDetailModal';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import adminService from '../../services/adminService';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'students' | 'matches'>('overview');
  const [donors, setDonors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [matches, setMatches] = useState<Array<{ id: string; donorId: string; studentId: string; createdAt: string }>>([]);
  const [selectedDonor, setSelectedDonor] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<User | null>(null);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [donorsRes, studentsRes, assignmentsRes] = await Promise.all([
        adminService.getDonors(),
        adminService.getStudents(),
        adminService.getAssignments()
      ]);

      // Map API data to match the User interface expected by the component
      const mappedDonors = donorsRes.donors.map(d => ({
        id: String(d.id),
        email: d.email,
        firstName: d.first_name,
        lastName: d.last_name,
        phone: d.phone,
        createdAt: d.created_at,
        userType: 'donor' as const,
        occupation: d.organization || ''
      }));

      const mappedStudents = studentsRes.students.map(s => ({
        id: String(s.id),
        email: s.email,
        firstName: s.first_name,
        lastName: s.last_name,
        phone: s.phone,
        createdAt: s.created_at,
        userType: 'student' as const,
        school: s.school_name,
        gradeLevel: s.grade_level
      }));

      const mappedMatches = assignmentsRes.assignments.map(a => ({
        id: String(a.id),
        donorId: String(a.donor_id),
        studentId: String(a.student_id),
        createdAt: a.assigned_at
      }));

      setDonors(mappedDonors);
      setStudents(mappedStudents);
      setMatches(mappedMatches);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMatch = () => {
    if (selectedDonor && selectedStudent) {
      MatchingService.createMatch(selectedDonor, selectedStudent);
      loadData();
      setSelectedDonor('');
      setSelectedStudent('');
    }
  };

  const handleRemoveMatch = (donorId: string, studentId: string) => {
    MatchingService.removeMatch(donorId, studentId);
    loadData();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      AuthService.deleteUser(userId);
      loadData();
    }
  };

  const getMatchedStudentsForDonor = (donorId: string) => {
    return matches.filter(m => m.donorId === donorId).length;
  };

  const getMatchedDonorsForStudent = (studentId: string) => {
    return matches.filter(m => m.studentId === studentId).length;
  };

  const getStudentDocumentStats = (studentId: string) => {
    const certificates = CertificateService.getCertificatesByUser(studentId);
    const receipts = ReceiptService.getReceiptsByUser(studentId);
    return { certificates: certificates.length, receipts: receipts.length };
  };

  const getAdvancedStats = () => {
    const totalCertificates = CertificateService.getCertificates().length;
    const totalReceipts = ReceiptService.getReceipts().length;
    const totalAchievements = AchievementService.getAchievements().length;
    
    // Student stats
    const studentsWithDonors = matches.filter((m, i, arr) => arr.findIndex(x => x.studentId === m.studentId) === i).length;
    const studentsWithoutDonors = students.length - studentsWithDonors;
    
    // Donor engagement
    const activeDonors = matches.filter((m, i, arr) => arr.findIndex(x => x.donorId === m.donorId) === i).length;
    const inactiveDonors = donors.length - activeDonors;
    
    // School distribution
    const schoolStats = students.reduce((acc, student) => {
      const school = student.school || 'Not Specified';
      acc[school] = (acc[school] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Grade distribution
    const gradeStats = students.reduce((acc, student) => {
      const grade = student.gradeLevel || 'Not Specified';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Donor occupation distribution
    const occupationStats = donors.reduce((acc, donor) => {
      const occupation = donor.occupation || 'Not Specified';
      acc[occupation] = (acc[occupation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent activity (users joined in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = [...students, ...donors].filter(user => 
      new Date(user.createdAt) > thirtyDaysAgo
    ).length;
    
    return {
      totalCertificates,
      totalReceipts,
      totalAchievements,
      studentsWithDonors,
      studentsWithoutDonors,
      activeDonors,
      inactiveDonors,
      schoolStats,
      gradeStats,
      occupationStats,
      recentUsers,
      matchingRate: students.length > 0 ? Math.round((studentsWithDonors / students.length) * 100) : 0,
      donorEngagement: donors.length > 0 ? Math.round((activeDonors / donors.length) * 100) : 0
    };
  };

  const advancedStats = getAdvancedStats();

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    bgColor: string;
  }) => (
    <div className={`${bgColor} p-6 rounded-xl border border-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-gray-600 font-medium">{title}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      <div className={`text-sm ${color}`}>
        {subtitle}
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, color }: {
    label: string;
    value: number;
    total: number;
    color: string;
  }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <span>{label}</span>
          <span>{value}/{total} ({Math.round(percentage)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const NetworkVisualization = ({ donors, students, matches }: {
    donors: User[];
    students: User[];
    matches: Array<{ id: string; donorId: string; studentId: string; createdAt: string }>;
  }) => {
    // Smart layout algorithm based on connections
    const viewWidth = 800;
    const viewHeight = 500;
    
    // Create connection graph and calculate smart positions
    const calculateSmartPositions = () => {
      const connectionCount = (nodeId: string, isStudent: boolean) => {
        return matches.filter(m => isStudent ? m.studentId === nodeId : m.donorId === nodeId).length;
      };

      // Group nodes by connection count for better organization
      const studentsWithConnections = students
        .map(student => ({ ...student, connectionCount: connectionCount(student.id, true) }))
        .sort((a, b) => b.connectionCount - a.connectionCount);
      
      const donorsWithConnections = donors
        .map(donor => ({ ...donor, connectionCount: connectionCount(donor.id, false) }))
        .sort((a, b) => b.connectionCount - a.connectionCount);

      const positions: { [key: string]: { x: number; y: number } } = {};

      // Position students in rows based on their connections
      let currentY = 80;
      const rowHeight = 120;
      const studentsPerRow = Math.max(3, Math.ceil(Math.sqrt(studentsWithConnections.length)));
      
      studentsWithConnections.forEach((student, index) => {
        const row = Math.floor(index / studentsPerRow);
        const col = index % studentsPerRow;
        const studentsInThisRow = Math.min(studentsPerRow, studentsWithConnections.length - row * studentsPerRow);
        const startX = (viewWidth - (studentsInThisRow - 1) * 150) / 2;
        
        positions[`student-${student.id}`] = {
          x: startX + col * 150,
          y: currentY + row * rowHeight
        };
      });

      // Position donors intelligently relative to their students
      donorsWithConnections.forEach(donor => {
        const donorMatches = matches.filter(m => m.donorId === donor.id);
        
        if (donorMatches.length === 0) {
          // Unconnected donor - position at bottom
          const unconnectedDonors = donorsWithConnections.filter(d => 
            matches.filter(m => m.donorId === d.id).length === 0
          );
          const donorIndex = unconnectedDonors.findIndex(d => d.id === donor.id);
          const spacing = Math.min(200, viewWidth / Math.max(unconnectedDonors.length, 1));
          const startX = (viewWidth - (unconnectedDonors.length - 1) * spacing) / 2;
          
          positions[`donor-${donor.id}`] = {
            x: startX + donorIndex * spacing,
            y: viewHeight - 80
          };
        } else if (donorMatches.length === 1) {
          // Single connection - position directly below the student
          const studentPos = positions[`student-${donorMatches[0].studentId}`];
          if (studentPos) {
            positions[`donor-${donor.id}`] = {
              x: studentPos.x,
              y: studentPos.y + 80
            };
          }
        } else {
          // Multiple connections - position in the center of connected students
          const connectedStudentPositions = donorMatches
            .map(m => positions[`student-${m.studentId}`])
            .filter(Boolean);
          
          if (connectedStudentPositions.length > 0) {
            const centerX = connectedStudentPositions.reduce((sum, pos) => sum + pos.x, 0) / connectedStudentPositions.length;
            const centerY = connectedStudentPositions.reduce((sum, pos) => sum + pos.y, 0) / connectedStudentPositions.length;
            
            positions[`donor-${donor.id}`] = {
              x: centerX,
              y: centerY + 80
            };
          }
        }
      });

      return positions;
    };

    const positions = calculateSmartPositions();

    // Create positioned node arrays with connection counts
    const donorPositions = donors.map(donor => ({
      ...donor,
      x: positions[`donor-${donor.id}`]?.x || 400,
      y: positions[`donor-${donor.id}`]?.y || 300,
      isMatched: matches.some(m => m.donorId === donor.id),
      connectionCount: matches.filter(m => m.donorId === donor.id).length
    }));
    
    const studentPositions = students.map(student => ({
      ...student,
      x: positions[`student-${student.id}`]?.x || 400,
      y: positions[`student-${student.id}`]?.y || 200,
      isMatched: matches.some(m => m.studentId === student.id),
      connectionCount: matches.filter(m => m.studentId === student.id).length
    }));
    
    return (
      <svg width="100%" height="500" viewBox="0 0 800 500" className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Connection lines */}
        {matches.map((match) => {
          const donor = donorPositions.find(d => d.id === match.donorId);
          const student = studentPositions.find(s => s.id === match.studentId);
          if (!donor || !student) return null;
          
          return (
            <g key={match.id}>
              {/* Connection line */}
              <line
                x1={donor.x}
                y1={donor.y}
                x2={student.x}
                y2={student.y}
                stroke="#06b6d4"
                strokeWidth="2"
                opacity="0.6"
                className="hover:opacity-100 transition-opacity"
              />
              {/* Connection pulse animation */}
              <circle r="3" fill="#06b6d4" opacity="0.8">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M${donor.x},${donor.y} L${student.x},${student.y}`}
                />
              </circle>
            </g>
          );
        })}
        
        {/* Donor nodes */}
        {donorPositions.map((donor) => (
          <g key={`donor-${donor.id}`} className="cursor-pointer">
            {/* Node circle */}
            <circle
              cx={donor.x}
              cy={donor.y}
              r={donor.connectionCount > 1 ? "30" : "25"}
              fill={donor.isMatched ? '#ec4899' : '#f9a8d4'}
              stroke={donor.isMatched ? '#be185d' : '#ec4899'}
              strokeWidth={donor.connectionCount > 1 ? "3" : "2"}
              className="hover:r-30 transition-all duration-200 drop-shadow-md"
            />
            {/* Connection count badge */}
            {donor.connectionCount > 1 && (
              <circle
                cx={donor.x + 18}
                cy={donor.y - 18}
                r="8"
                fill="#10b981"
                stroke="#059669"
                strokeWidth="1"
              />
            )}
            {donor.connectionCount > 1 && (
              <text
                x={donor.x + 18}
                y={donor.y - 14}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {donor.connectionCount}
              </text>
            )}
            {/* Donor icon */}
            <foreignObject x={donor.x - 12} y={donor.y - 12} width="24" height="24">
              <Heart className="w-6 h-6 text-white" />
            </foreignObject>
            {/* Donor name */}
            <text
              x={donor.x}
              y={donor.y + 40}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-700"
            >
              {donor.firstName}
            </text>
            <text
              x={donor.x}
              y={donor.y + 54}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {donor.lastName}
            </text>
            {/* Donor badge */}
            {donor.connectionCount === 0 && (
              <>
                <circle
                  cx={donor.x + 18}
                  cy={donor.y - 18}
                  r="8"
                  fill="#3b82f6"
                  className="drop-shadow-sm"
                />
                <text
                  x={donor.x + 18}
                  y={donor.y - 14}
                  textAnchor="middle"
                  className="text-xs fill-white font-bold"
                >
                  D
                </text>
              </>
            )}
          </g>
        ))}
        
        {/* Student nodes */}
        {studentPositions.map((student) => (
          <g key={`student-${student.id}`} className="cursor-pointer">
            {/* Node circle */}
            <circle
              cx={student.x}
              cy={student.y}
              r={student.connectionCount > 1 ? "28" : "22"}
              fill={student.isMatched ? '#10b981' : '#86efac'}
              stroke={student.isMatched ? '#059669' : '#10b981'}
              strokeWidth={student.connectionCount > 1 ? "3" : "2"}
              className="hover:r-26 transition-all duration-200 drop-shadow-md"
            />
            {/* Connection count badge */}
            {student.connectionCount > 1 && (
              <circle
                cx={student.x + 20}
                cy={student.y - 20}
                r="8"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1"
              />
            )}
            {student.connectionCount > 1 && (
              <text
                x={student.x + 20}
                y={student.y - 16}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {student.connectionCount}
              </text>
            )}
            {/* Student icon */}
            <foreignObject x={student.x - 10} y={student.y - 10} width="20" height="20">
              <GraduationCap className="w-5 h-5 text-white" />
            </foreignObject>
            {/* Student name */}
            <text
              x={student.x}
              y={student.y + 36}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-700"
            >
              {student.firstName}
            </text>
            <text
              x={student.x}
              y={student.y + 50}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {student.lastName}
            </text>
            {/* Student badge for unconnected students only */}
            {student.connectionCount === 0 && (
              <>
                <circle
                  cx={student.x + 15}
                  cy={student.y - 15}
                  r="7"
                  fill="#8b5cf6"
                  className="drop-shadow-sm"
                />
                <text
                  x={student.x + 15}
                  y={student.y - 11}
                  textAnchor="middle"
                  className="text-xs fill-white font-bold"
                >
                  S
                </text>
              </>
            )}
          </g>
        ))}
        
        {/* Legend */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="200" height="130" fill="white" stroke="#e5e7eb" rx="8" className="drop-shadow-sm" />
          
          {/* Donor legend */}
          <circle cx="15" cy="20" r="8" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
          <text x="30" y="25" className="text-xs fill-gray-700 font-medium">Active Donor</text>
          
          {/* Student legend */}
          <circle cx="15" cy="40" r="8" fill="#10b981" stroke="#059669" strokeWidth="1" />
          <text x="30" y="45" className="text-xs fill-gray-700 font-medium">Matched Student</text>
          
          {/* Multiple connections legend */}
          <circle cx="15" cy="60" r="10" fill="#10b981" stroke="#059669" strokeWidth="2" />
          <circle cx="22" cy="53" r="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
          <text x="9" y="56" className="text-xs font-bold fill-white">2</text>
          <text x="30" y="65" className="text-xs fill-gray-700 font-medium">Multiple Connections</text>
          
          {/* Connection line legend */}
          <line x1="10" y1="80" x2="25" y2="80" stroke="#06b6d4" strokeWidth="2" />
          <text x="30" y="85" className="text-xs fill-gray-700 font-medium">Connection</text>
          
          {/* Smart positioning note */}
          <text x="10" y="102" className="text-xs fill-gray-500">Smart Layout:</text>
          <text x="10" y="115" className="text-xs fill-gray-500">Students on top, donors centered below</text>
          <text x="10" y="125" className="text-xs fill-gray-500">Size indicates connection count</text>
        </g>
        
        {/* Stats info */}
        <g transform={`translate(${viewWidth - 120}, 20)`}>
          <rect x="0" y="0" width="100" height="80" fill="white" stroke="#e5e7eb" rx="8" className="drop-shadow-sm" opacity="0.95" />
          <text x="50" y="20" textAnchor="middle" className="text-sm font-bold fill-gray-900">{matches.length}</text>
          <text x="50" y="35" textAnchor="middle" className="text-xs fill-gray-600">Active</text>
          <text x="50" y="48" textAnchor="middle" className="text-xs fill-gray-600">Connections</text>
          <text x="50" y="65" textAnchor="middle" className="text-xs fill-gray-500">{donors.length} Donors</text>
          <text x="50" y="75" textAnchor="middle" className="text-xs fill-gray-500">{students.length} Students</text>
        </g>
      </svg>
    );
  };

  const openStudentDetail = (student: User) => {
    setSelectedStudentForDetail(student);
    setIsStudentDetailOpen(true);
  };

  const closeStudentDetail = () => {
    setSelectedStudentForDetail(null);
    setIsStudentDetailOpen(false);
  };

  if (!user || user.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin access required.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100">
      <div className="container pt-24 pb-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-700 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage users, matches, and monitor the scholarship program.</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-card mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Settings },
            { id: 'donors', label: 'Donors', icon: Heart },
            { id: 'students', label: 'Students', icon: GraduationCap },
            { id: 'matches', label: 'Matches', icon: LinkIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'donors' | 'students' | 'matches')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                icon={GraduationCap}
                title="Total Students"
                value={students.length}
                subtitle={`${advancedStats.recentUsers} joined recently`}
                color="text-blue-600"
                bgColor="bg-blue-50"
              />
              <StatCard
                icon={Heart}
                title="Total Donors"
                value={donors.length}
                subtitle={`${advancedStats.activeDonors} actively sponsoring`}
                color="text-pink-600"
                bgColor="bg-pink-50"
              />
              <StatCard
                icon={LinkIcon}
                title="Active Matches"
                value={matches.length}
                subtitle={`${advancedStats.matchingRate}% matching rate`}
                color="text-green-600"
                bgColor="bg-green-50"
              />
            </div>

            {/* Network Visualization */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center mb-6">
                <Users className="w-5 h-5 mr-2 text-cyan-600" />
                <h3 className="text-xl font-semibold text-gray-900">Donor-Student Network</h3>
                <span className="ml-auto text-sm text-gray-500">{matches.length} active connections</span>
              </div>
              
              {matches.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Connections Yet</h4>
                  <p className="text-gray-600">Create matches between donors and students to see the network visualization.</p>
                </div>
              ) : (
                <div className="relative overflow-hidden" style={{ height: '500px' }}>
                  <NetworkVisualization donors={donors} students={students} matches={matches} />
                </div>
              )}
            </div>

            {/* Quick Insights */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="font-semibold text-gray-900">{advancedStats.totalCertificates}</div>
                  <div className="text-gray-600">Total Certificates</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="font-semibold text-gray-900">{advancedStats.totalReceipts}</div>
                  <div className="text-gray-600">Total Receipts</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="font-semibold text-gray-900">{advancedStats.recentUsers}</div>
                  <div className="text-gray-600">New Users (30d)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Donors</h2>
              <span className="text-sm text-gray-500">{donors.length} total</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Occupation</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor) => (
                    <tr key={donor.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {donor.firstName} {donor.lastName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{donor.email}</td>
                      <td className="py-3 px-4 text-gray-600">{donor.occupation || 'Not specified'}</td>
                      <td className="py-3 px-4">
                        <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getMatchedStudentsForDonor(donor.id)} students
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(donor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteUser(donor.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Students</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{students.filter(s => getMatchedDonorsForStudent(s.id) > 0).length} with donors</span>
                <span>•</span>
                <span>{students.length} total</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">School & Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Documents</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const donorCount = getMatchedDonorsForStudent(student.id);
                    const docStats = getStudentDocumentStats(student.id);
                    const hasDocuments = docStats.certificates > 0 || docStats.receipts > 0;
                    
                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-cyan-600">
                                {student.firstName[0]}{student.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.school || 'School not specified'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Grade: {student.gradeLevel || 'Not specified'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              donorCount > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {donorCount > 0 ? (
                                <><Heart className="w-3 h-3 mr-1" /> {donorCount} donor{donorCount > 1 ? 's' : ''}</>
                              ) : (
                                <><AlertCircle className="w-3 h-3 mr-1" /> No donor</>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {hasDocuments ? (
                              <div className="flex items-center space-x-3">
                                {docStats.certificates > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {docStats.certificates} cert{docStats.certificates > 1 ? 's' : ''}
                                  </span>
                                )}
                                {docStats.receipts > 0 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {docStats.receipts} receipt{docStats.receipts > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No documents</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openStudentDetail(student)}
                              className="flex items-center space-x-1 px-3 py-1 text-sm bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(student.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {students.length === 0 && (
                <div className="text-center py-8">
                  <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No students registered yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Create New Match */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Match</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Donor
                  </label>
                  <select
                    value={selectedDonor}
                    onChange={(e) => setSelectedDonor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Choose a donor</option>
                    {donors.map((donor) => (
                      <option key={donor.id} value={donor.id}>
                        {donor.firstName} {donor.lastName} ({donor.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Choose a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCreateMatch}
                    disabled={!selectedDonor || !selectedStudent}
                    className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Match
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Matches */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Matches</h2>
              
              {matches.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No matches created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => {
                    const donor = donors.find(d => d.id === match.donorId);
                    const student = students.find(s => s.id === match.studentId);
                    
                    return (
                      <div key={match.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-5 h-5 text-cyan-600" />
                            <span className="font-medium text-gray-900">
                              {donor?.firstName} {donor?.lastName}
                            </span>
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">
                              {student?.firstName} {student?.lastName}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {new Date(match.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleRemoveMatch(match.donorId, match.studentId)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Student Detail Modal */}
        {selectedStudentForDetail && (
          <StudentDetailModal
            student={selectedStudentForDetail}
            isOpen={isStudentDetailOpen}
            onClose={closeStudentDetail}
            hasAssignedDonor={getMatchedDonorsForStudent(selectedStudentForDetail.id) > 0}
          />
        )}

        {/* Password Change Modal */}
        <PasswordChangeModal 
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;