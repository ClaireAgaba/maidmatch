export type AdminRole = 'normal_admin' | 'super_admin';

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
    status: 'pending' | 'verified' | 'rejected';
    notes?: string;
  }[];
  submittedAt: string;
  reviewedBy?: {
    adminId: string;
    adminName: string;
    date: string;
    status: 'approved' | 'rejected';
    notes?: string;
  };
}

export interface UserReport {
  id: string;
  type: 'complaint' | 'dispute' | 'feedback' | 'support';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  subject: string;
  description: string;
  reportedBy: {
    id: string;
    type: 'maid' | 'homeowner';
    name: string;
  };
  reportedUser?: {
    id: string;
    type: 'maid' | 'homeowner';
    name: string;
  };
  attachments?: {
    id: string;
    type: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    adminId: string;
    adminName: string;
    assignedAt: string;
  };
  resolution?: {
    action: string;
    notes: string;
    date: string;
    by: {
      adminId: string;
      adminName: string;
    };
  };
}

export interface AuditLogEntry {
  id: string;
  action: string;
  category: 'user_management' | 'approval' | 'payment' | 'report' | 'system';
  performedBy: {
    adminId: string;
    adminName: string;
    role: AdminRole;
  };
  details: {
    [key: string]: any;
  };
  timestamp: string;
  ipAddress: string;
}

export interface AdminNotification {
  id: string;
  type: 'approval_needed' | 'report' | 'system_alert' | 'payment_issue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: string;
  read: boolean;
  action?: {
    type: string;
    route: string;
    params?: any;
  };
}
