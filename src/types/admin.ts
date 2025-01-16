export type AdminRole = 'admin' | 'super_admin';

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface SystemStats {
  users: {
    total: number;
    maids: {
      active: number;
      pending: number;
      suspended: number;
      banned: number;
    };
    homeowners: {
      active: number;
      pending: number;
      suspended: number;
      banned: number;
    };
  };
  transactions: {
    total: number;
    pending: number;
    completed: number;
    disputed: number;
    totalAmount: number;
  };
  reports: {
    total: number;
    pending: number;
    resolved: number;
    byCategory: {
      [key: string]: number;
    };
  };
}

export interface PendingApproval {
  id: string;
  userType: 'maid' | 'homeowner';
  fullName: string;
  email: string;
  phone: string;
  location: {
    city: string;
    area: string;
  };
  documents: {
    id: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  submittedAt: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedId: string;
  type: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}
