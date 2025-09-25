import { User, UserRole } from '../types/auth';

const USERS_KEY = 'obayi_users';
const CURRENT_USER_KEY = 'obayi_current_user';
const MATCHES_KEY = 'obayi_matches';
const CERTIFICATES_KEY = 'obayi_certificates';
const RECEIPTS_KEY = 'obayi_receipts';
const ACHIEVEMENTS_KEY = 'obayi_achievements';

export class AuthService {
  static getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  static register(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  static login(email: string, password: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    this.setCurrentUser(user);
    return user;
  }

  static logout(): void {
    this.setCurrentUser(null);
  }

  static updateUser(userId: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    this.saveUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(updatedUser);
    }

    return updatedUser;
  }

  static deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);
  }

  static getUsersByRole(role: UserRole): User[] {
    return this.getUsers().filter(u => u.userType === role);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.userType === role;
  }

  // Clear all data (for debugging)
  static clearAllData(): void {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(MATCHES_KEY);
    localStorage.removeItem(CERTIFICATES_KEY);
    localStorage.removeItem(RECEIPTS_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  }

  // Initialize with only default admin user
  static initializeDefaultUsers(): void {
    const users = this.getUsers();
    // Check if admin user exists by email
    const adminExists = users.some(u => u.email === 'admin@obayi.co');
    if (!adminExists) {
      const defaultAdmin: User = {
        id: 'admin-1',
        email: 'admin@obayi.co',
        password: 'admin123',
        userType: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: new Date().toISOString(),
      };

      const existingUsers = this.getUsers();
      this.saveUsers([...existingUsers, defaultAdmin]);
    }
  }

  // Force create admin user (for debugging)
  static forceCreateAdminUser(): void {
    const users = this.getUsers();
    // Remove any existing admin users
    const filteredUsers = users.filter(u => u.email !== 'admin@obayi.co');

    const defaultAdmin: User = {
      id: 'admin-1',
      email: 'admin@obayi.co',
      password: 'admin123',
      userType: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      createdAt: new Date().toISOString(),
    };

    this.saveUsers([...filteredUsers, defaultAdmin]);
  }
}

// Matching system
export class MatchingService {
  static getMatches(): Array<{ id: string; donorId: string; studentId: string; createdAt: string }> {
    const matches = localStorage.getItem(MATCHES_KEY);
    return matches ? JSON.parse(matches) : [];
  }

  static saveMatches(matches: Array<{ id: string; donorId: string; studentId: string; createdAt: string }>): void {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  }

  static createMatch(donorId: string, studentId: string): void {
    const matches = this.getMatches();
    const newMatch = {
      id: Date.now().toString(),
      donorId,
      studentId,
      createdAt: new Date().toISOString(),
    };
    matches.push(newMatch);
    this.saveMatches(matches);
  }

  static removeMatch(donorId: string, studentId: string): void {
    const matches = this.getMatches().filter(
      m => !(m.donorId === donorId && m.studentId === studentId)
    );
    this.saveMatches(matches);
  }

  static getDonorMatches(donorId: string): Array<{ id: string; donorId: string; studentId: string; createdAt: string }> {
    return this.getMatches().filter(m => m.donorId === donorId);
  }

  static getStudentMatches(studentId: string): Array<{ id: string; donorId: string; studentId: string; createdAt: string }> {
    return this.getMatches().filter(m => m.studentId === studentId);
  }
}

// File upload simulation
export class FileService {
  static uploadFile(file: File, userId: string, type: 'profile' | 'transcript' | 'receipt'): Promise<string> {
    return new Promise((resolve) => {
      // Simulate file upload
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          id: Date.now().toString(),
          userId,
          type,
          name: file.name,
          data: reader.result as string,
          uploadedAt: new Date().toISOString(),
        };
        
        const files = JSON.parse(localStorage.getItem('obayi_files') || '[]');
        files.push(fileData);
        localStorage.setItem('obayi_files', JSON.stringify(files));
        
        resolve(fileData.id);
      };
      reader.readAsDataURL(file);
    });
  }

  static getFilesByUser(userId: string, type?: string): Array<{ id: string; name: string; type: string; uploadedAt: string; userId: string }> {
    const files = JSON.parse(localStorage.getItem('obayi_files') || '[]');
    return files.filter((f: { id: string; name: string; type: string; uploadedAt: string; userId: string }) => f.userId === userId && (!type || f.type === type));
  }

  static deleteFile(fileId: string): void {
    const files = JSON.parse(localStorage.getItem('obayi_files') || '[]');
    const updatedFiles = files.filter((f: { id: string; name: string; type: string; uploadedAt: string; userId: string }) => f.id !== fileId);
    localStorage.setItem('obayi_files', JSON.stringify(updatedFiles));
  }

  static getFileById(fileId: string): { id: string; name: string; type: string; uploadedAt: string; userId: string; data: string } | null {
    const files = JSON.parse(localStorage.getItem('obayi_files') || '[]');
    return files.find((f: { id: string; name: string; type: string; uploadedAt: string; userId: string; data: string }) => f.id === fileId) || null;
  }
}

// Certificate management
export class CertificateService {
  static getCertificates(): Array<{
    id: string;
    userId: string;
    name: string;
    description: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }> {
    const certificates = localStorage.getItem(CERTIFICATES_KEY);
    return certificates ? JSON.parse(certificates) : [];
  }

  static saveCertificates(certificates: Array<{
    id: string;
    userId: string;
    name: string;
    description: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }>): void {
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certificates));
  }

  static addCertificate(userId: string, name: string, description: string, file?: File): Promise<string> {
    return new Promise(async (resolve) => {
      const certificates = this.getCertificates();
      const newCertificate = {
        id: Date.now().toString(),
        userId,
        name,
        description,
        uploadedAt: new Date().toISOString(),
      };

      if (file) {
        const fileId = await FileService.uploadFile(file, userId, 'certificate' as any);
        (newCertificate as any).fileName = file.name;
        (newCertificate as any).fileId = fileId;
      }

      certificates.push(newCertificate);
      this.saveCertificates(certificates);
      resolve(newCertificate.id);
    });
  }

  static updateCertificate(certificateId: string, updates: Partial<{
    name: string;
    description: string;
    fileName?: string;
    fileId?: string;
  }>, file?: File): Promise<void> {
    return new Promise(async (resolve) => {
      const certificates = this.getCertificates();
      const certIndex = certificates.findIndex(c => c.id === certificateId);
      
      if (certIndex !== -1) {
        const cert = certificates[certIndex];
        certificates[certIndex] = { ...cert, ...updates };

        if (file) {
          const fileId = await FileService.uploadFile(file, cert.userId, 'certificate' as any);
          certificates[certIndex].fileName = file.name;
          certificates[certIndex].fileId = fileId;
        }

        this.saveCertificates(certificates);
      }
      resolve();
    });
  }

  static getCertificatesByUser(userId: string): Array<{
    id: string;
    userId: string;
    name: string;
    description: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }> {
    return this.getCertificates().filter(c => c.userId === userId);
  }
}

// Receipt management
export class ReceiptService {
  static getReceipts(): Array<{
    id: string;
    userId: string;
    description: string;
    amount: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }> {
    const receipts = localStorage.getItem(RECEIPTS_KEY);
    return receipts ? JSON.parse(receipts) : [];
  }

  static saveReceipts(receipts: Array<{
    id: string;
    userId: string;
    description: string;
    amount: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }>): void {
    localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
  }

  static addReceipt(userId: string, description: string, amount: string, file?: File): Promise<string> {
    return new Promise(async (resolve) => {
      const receipts = this.getReceipts();
      const newReceipt = {
        id: Date.now().toString(),
        userId,
        description,
        amount,
        uploadedAt: new Date().toISOString(),
      };

      if (file) {
        const fileId = await FileService.uploadFile(file, userId, 'receipt');
        (newReceipt as any).fileName = file.name;
        (newReceipt as any).fileId = fileId;
      }

      receipts.push(newReceipt);
      this.saveReceipts(receipts);
      resolve(newReceipt.id);
    });
  }

  static updateReceipt(receiptId: string, updates: Partial<{
    description: string;
    amount: string;
    fileName?: string;
    fileId?: string;
  }>, file?: File): Promise<void> {
    return new Promise(async (resolve) => {
      const receipts = this.getReceipts();
      const receiptIndex = receipts.findIndex(r => r.id === receiptId);
      
      if (receiptIndex !== -1) {
        const receipt = receipts[receiptIndex];
        receipts[receiptIndex] = { ...receipt, ...updates };

        if (file) {
          const fileId = await FileService.uploadFile(file, receipt.userId, 'receipt');
          receipts[receiptIndex].fileName = file.name;
          receipts[receiptIndex].fileId = fileId;
        }

        this.saveReceipts(receipts);
      }
      resolve();
    });
  }

  static deleteReceipt(receiptId: string): void {
    const receipts = this.getReceipts().filter(r => r.id !== receiptId);
    this.saveReceipts(receipts);
  }

  static getReceiptsByUser(userId: string): Array<{
    id: string;
    userId: string;
    description: string;
    amount: string;
    fileName?: string;
    fileId?: string;
    uploadedAt: string;
  }> {
    return this.getReceipts().filter(r => r.userId === userId);
  }
}

// Achievement management
export class AchievementService {
  static getAchievements(): Array<{
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    dateAchieved: string;
    createdAt: string;
  }> {
    const achievements = localStorage.getItem(ACHIEVEMENTS_KEY);
    return achievements ? JSON.parse(achievements) : [];
  }

  static saveAchievements(achievements: Array<{
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    dateAchieved: string;
    createdAt: string;
  }>): void {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }

  static addAchievement(userId: string, title: string, description: string, category: string, dateAchieved: string): string {
    const achievements = this.getAchievements();
    const newAchievement = {
      id: Date.now().toString(),
      userId,
      title,
      description,
      category,
      dateAchieved,
      createdAt: new Date().toISOString()
    };
    achievements.push(newAchievement);
    this.saveAchievements(achievements);
    return newAchievement.id;
  }

  static getAchievementsByUser(userId: string): Array<{
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    dateAchieved: string;
    createdAt: string;
  }> {
    return this.getAchievements().filter(a => a.userId === userId);
  }

  static deleteAchievement(achievementId: string): void {
    const achievements = this.getAchievements().filter(a => a.id !== achievementId);
    this.saveAchievements(achievements);
  }

  static updateAchievement(achievementId: string, updates: Partial<{
    title: string;
    description: string;
    category: string;
    dateAchieved: string;
  }>): void {
    const achievements = this.getAchievements();
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1) {
      achievements[achievementIndex] = {
        ...achievements[achievementIndex],
        ...updates
      };
      this.saveAchievements(achievements);
    }
  }
}