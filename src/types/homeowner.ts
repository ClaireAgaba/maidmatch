export interface HomeownerProfile {
  id: string;
  fullName: string;
  photoUrl?: string;
  location: {
    city: string;
    area: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  rating: number;
  totalHires: number;
  memberSince: string;
}

export interface MaidRequest {
  id: string;
  maidId: string;
  maidName: string;
  maidPhoto?: string;
  type: 'temporary' | 'permanent';
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  serviceType: string[];
  location: {
    city: string;
    area: string;
  };
  schedule: {
    date: string;
    startTime: string;
    endTime?: string;
  };
  payment: {
    amount: number;
    status: 'pending' | 'held' | 'released' | 'refunded';
    transactionId?: string;
  };
  rating?: {
    score: number;
    review?: string;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  requestId: string;
  maidId: string;
  maidName: string;
  amount: number;
  type: 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  method: 'mobile_money' | 'card' | 'bank_transfer';
  reference: string;
  date: string;
}

export interface HomeownerNotification {
  id: string;
  type: 'request_update' | 'payment' | 'maid_status' | 'system';
  title: string;
  message: string;
  requestId?: string;
  maidId?: string;
  date: string;
  read: boolean;
  action?: {
    type: 'view_request' | 'release_payment' | 'rate_maid' | 'contact_support';
    data?: any;
  };
}

export interface AvailableMaid {
  id: string;
  fullName: string;
  photoUrl?: string;
  distance: number; // in kilometers
  rating: number;
  totalJobs: number;
  skills: string[];
  languages: string[];
  hourlyRate: number;
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    nextAvailable?: string;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected';
  experience: {
    years: number;
    specialties: string[];
  };
}
