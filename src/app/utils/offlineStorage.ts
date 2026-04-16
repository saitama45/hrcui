// Offline storage utilities for Harbor Review Center

export interface OfflineUser {
  email: string;
  fullName: string;
  phone: string;
  userId: string;
  lastSync: string;
}

export interface OfflineProgress {
  reviewHoursUsed: number;
  mockExamAttempts: number;
  lastUpdated: string;
  needsSync: boolean;
  sessionLogs: SessionLog[];
}

export interface SessionLog {
  moduleId: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  synced: boolean;
}

export interface AccessPermissions {
  subscriptionType: 'months' | 'unlimited';
  subscriptionMonths?: number; // 3, 6, 12, etc.
  subscriptionStartDate: string;
  subscriptionEndDate?: string;
  
  reviewHoursType: 'limited' | 'unlimited';
  reviewHoursTotal?: number; // 300, 600, etc.
  reviewHoursPrice?: number; // Price per 300 hours in pesos
  
  mockExamType: 'limited' | 'unlimited';
  mockExamTotal?: number; // 3, 6, etc.
  mockExamPrice?: number; // Price per 3 attempts in pesos
}

// Save user credentials for offline login
export function saveOfflineUser(user: OfflineUser): void {
  localStorage.setItem('harborOfflineUser', JSON.stringify(user));
}

// Get offline user
export function getOfflineUser(): OfflineUser | null {
  const data = localStorage.getItem('harborOfflineUser');
  return data ? JSON.parse(data) : null;
}

// Check if user can login offline
export function canLoginOffline(email: string, password: string): boolean {
  const user = getOfflineUser();
  if (!user) return false;
  
  // In production, you'd verify against a hashed password stored offline
  // For demo, we just check if the email matches
  return user.email === email;
}

// Save progress offline
export function saveOfflineProgress(progress: OfflineProgress): void {
  localStorage.setItem('harborOfflineProgress', JSON.stringify(progress));
}

// Get offline progress
export function getOfflineProgress(): OfflineProgress | null {
  const data = localStorage.getItem('harborOfflineProgress');
  return data ? JSON.parse(data) : null;
}

// Log a study session
export function logStudySession(moduleId: string, durationSeconds: number): void {
  const progress = getOfflineProgress() || {
    reviewHoursUsed: 0,
    mockExamAttempts: 0,
    lastUpdated: new Date().toISOString(),
    needsSync: false,
    sessionLogs: []
  };

  const session: SessionLog = {
    moduleId,
    startTime: new Date(Date.now() - durationSeconds * 1000).toISOString(),
    endTime: new Date().toISOString(),
    duration: durationSeconds,
    synced: false
  };

  progress.sessionLogs.push(session);
  progress.reviewHoursUsed += durationSeconds / 3600; // Convert to hours
  progress.lastUpdated = new Date().toISOString();
  progress.needsSync = true;

  saveOfflineProgress(progress);
}

// Save access permissions
export function saveAccessPermissions(permissions: AccessPermissions): void {
  localStorage.setItem('harborAccessPermissions', JSON.stringify(permissions));
}

// Get access permissions
export function getAccessPermissions(): AccessPermissions | null {
  const data = localStorage.getItem('harborAccessPermissions');
  return data ? JSON.parse(data) : null;
}

// Check if subscription is valid
export function isSubscriptionValid(): boolean {
  const permissions = getAccessPermissions();
  if (!permissions) return false;

  if (permissions.subscriptionType === 'unlimited') return true;

  if (permissions.subscriptionEndDate) {
    return new Date(permissions.subscriptionEndDate) > new Date();
  }

  return false;
}

// Check if user has review hours remaining
export function hasReviewHoursRemaining(): boolean {
  const permissions = getAccessPermissions();
  const progress = getOfflineProgress();
  
  if (!permissions) return true; // Default true for demo/wireframe
  if (permissions.reviewHoursType === 'unlimited') return true;

  const used = progress?.reviewHoursUsed || 0;
  const total = permissions.reviewHoursTotal || 300;

  return used < total;
}

// Check if user has mock exam attempts remaining
export function hasMockExamAttemptsRemaining(): boolean {
  const permissions = getAccessPermissions();
  const progress = getOfflineProgress();
  
  if (!permissions) return false;
  if (permissions.mockExamType === 'unlimited') return true;

  const used = progress?.mockExamAttempts || 0;
  const total = permissions.mockExamTotal || 0;

  return used < total;
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Sync data with server (mock implementation)
export async function syncWithServer(): Promise<boolean> {
  if (!isOnline()) return false;

  const progress = getOfflineProgress();
  if (!progress || !progress.needsSync) return true;

  try {
    // In production, this would send data to your backend API
    console.log('Syncing data to server...', progress);

    // Mark sessions as synced
    progress.sessionLogs = progress.sessionLogs.map(log => ({
      ...log,
      synced: true
    }));
    progress.needsSync = false;
    progress.lastUpdated = new Date().toISOString();
    
    saveOfflineProgress(progress);
    
    return true;
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
}

// Get sync status
export function getSyncStatus(): { needsSync: boolean; lastSync: string | null } {
  const progress = getOfflineProgress();
  const user = getOfflineUser();
  
  return {
    needsSync: progress?.needsSync || false,
    lastSync: user?.lastSync || progress?.lastUpdated || null
  };
}
