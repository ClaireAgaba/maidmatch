import {
  AdminProfile,
  SystemStats,
  PendingApproval,
  UserReport,
  AdminNotification,
  AuditLogEntry
} from '../types/admin';

export const mockAdminProfile: AdminProfile = {
  id: '1',
  fullName: 'Admin User',
  email: 'admin@maidmatch.com',
  role: 'super_admin',
  permissions: ['manage_users', 'approve_users', 'manage_payments', 'manage_reports', 'manage_admins'],
  lastLogin: '2024-01-14T08:00:00',
  twoFactorEnabled: true
};

export const mockSystemStats: SystemStats = {
  users: {
    total: 1250,
    maids: {
      active: 450,
      pending: 25,
      suspended: 10,
      banned: 5
    },
    homeowners: {
      active: 720,
      pending: 30,
      suspended: 8,
      banned: 2
    }
  },
  transactions: {
    total: 850,
    pending: 45,
    completed: 780,
    disputed: 25,
    totalAmount: 25000000 // in UGX
  },
  reports: {
    total: 75,
    pending: 15,
    resolved: 60,
    byCategory: {
      'payment_dispute': 20,
      'service_quality': 25,
      'behavior': 15,
      'technical_issue': 15
    }
  }
};

export const mockPendingApprovals: PendingApproval[] = [
  {
    id: '1',
    userType: 'maid',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+256 778934413',
    location: {
      city: 'Kampala',
      area: 'Nakawa'
    },
    documents: [
      {
        id: 'doc1',
        type: 'national_id',
        url: 'https://example.com/docs/national_id.pdf',
        status: 'pending'
      },
      {
        id: 'doc2',
        type: 'police_clearance',
        url: 'https://example.com/docs/police_clearance.pdf',
        status: 'pending'
      }
    ],
    submittedAt: '2024-01-13T10:00:00'
  },
  {
    id: '2',
    userType: 'homeowner',
    fullName: 'John Smith',
    email: 'john.s@example.com',
    phone: '+256 778934567',
    location: {
      city: 'Kampala',
      area: 'Kololo'
    },
    documents: [
      {
        id: 'doc3',
        type: 'proof_of_residence',
        url: 'https://example.com/docs/residence.pdf',
        status: 'pending'
      }
    ],
    submittedAt: '2024-01-14T09:00:00'
  }
];

export const mockReports: UserReport[] = [
  {
    id: '1',
    type: 'complaint',
    status: 'pending',
    priority: 'high',
    category: 'service_quality',
    subject: 'Maid did not complete agreed tasks',
    description: 'The maid left before completing all the agreed cleaning tasks...',
    reportedBy: {
      id: 'ho1',
      type: 'homeowner',
      name: 'Alice Brown'
    },
    reportedUser: {
      id: 'm1',
      type: 'maid',
      name: 'Sarah Johnson'
    },
    createdAt: '2024-01-14T10:00:00',
    updatedAt: '2024-01-14T10:00:00'
  }
];

export const mockNotifications: AdminNotification[] = [
  {
    id: '1',
    type: 'approval_needed',
    priority: 'high',
    title: 'New Maid Registration',
    message: 'Sarah Johnson has submitted documents for verification',
    metadata: {
      userId: 'm1',
      userType: 'maid'
    },
    createdAt: '2024-01-13T10:00:00',
    read: false,
    action: {
      type: 'view_approval',
      route: '/approvals/1',
      params: { id: '1' }
    }
  },
  {
    id: '2',
    type: 'report',
    priority: 'urgent',
    title: 'New Complaint Filed',
    message: 'Service quality complaint requires immediate attention',
    metadata: {
      reportId: '1',
      category: 'service_quality'
    },
    createdAt: '2024-01-14T10:00:00',
    read: false,
    action: {
      type: 'view_report',
      route: '/reports/1',
      params: { id: '1' }
    }
  }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    action: 'approve_user',
    category: 'approval',
    performedBy: {
      adminId: '1',
      adminName: 'Admin User',
      role: 'super_admin'
    },
    details: {
      userId: 'm1',
      userType: 'maid',
      userName: 'Sarah Johnson'
    },
    timestamp: '2024-01-13T15:00:00',
    ipAddress: '192.168.1.1'
  }
];
