import { HomeownerProfile, MaidRequest, PaymentTransaction, HomeownerNotification, AvailableMaid } from '../types/homeowner';

export const mockHomeownerProfile: HomeownerProfile = {
  id: '1',
  fullName: 'Cedric Ahumuza',
  photoUrl: require('../../assets/maid.jpg'),
  location: {
    city: 'Kampala',
    area: 'Kololo',
    coordinates: {
      latitude: 0.3476,
      longitude: 32.5825
    }
  },
  contact: {
    phone: '+256 778934567',
    email: 'cedric@maidmatch.com',
    whatsapp: '+256 778934567'
  },
  rating: 4.9,
  totalHires: 15,
  memberSince: '2023-06-01'
};

export const mockAvailableMaids: AvailableMaid[] = [
  {
    id: '1',
    fullName: 'Claire Agaba',
    photoUrl: require('../../assets/wel.jpg'),
    distance: 2.5,
    rating: 4.8,
    totalJobs: 45,
    skills: ['Cleaning', 'Cooking', 'Childcare'],
    languages: ['English', 'Luganda'],
    hourlyRate: 15000,
    availability: {
      status: 'available'
    },
    verificationStatus: 'approved',
    experience: {
      years: 3,
      specialties: ['Deep Cleaning', 'Local Cuisine']
    },
    location: {
      city: 'Kampala',
      area: 'Kisaasi',
      coordinates: {
        latitude: 0.3476,
        longitude: 32.6062
      }
    },
  },
  {
    id: '2',
    fullName: 'Mary Williams',
    photoUrl: 'https://example.com/mary.jpg',
    distance: 3.8,
    rating: 4.9,
    totalJobs: 78,
    skills: ['Cleaning', 'Elderly Care', 'Pet Care'],
    languages: ['English', 'Swahili'],
    hourlyRate: 18000,
    availability: {
      status: 'busy',
      nextAvailable: '2024-01-15T14:00:00'
    },
    verificationStatus: 'approved',
    experience: {
      years: 5,
      specialties: ['Senior Care', 'Pet Handling']
    }
  }
];

export const mockMaidRequests: MaidRequest[] = [
  {
    id: '1',
    maidId: '1',
    maidName: 'Claire Agaba',
    maidPhoto: 'https://example.com/sarah.jpg',
    type: 'temporary',
    status: 'accepted',
    serviceType: ['Cleaning', 'Cooking'],
    location: {
      city: 'Kampala',
      area: 'Kololo'
    },
    schedule: {
      date: '2024-01-14',
      startTime: '09:00',
      endTime: '17:00'
    },
    payment: {
      amount: 120000,
      status: 'held',
      transactionId: 'tx_123'
    },
    createdAt: '2024-01-13T15:00:00',
    updatedAt: '2024-01-13T15:05:00'
  },
  {
    id: '2',
    maidId: '2',
    maidName: 'Shiba Tushe',
    maidPhoto: 'https://example.com/mary.jpg',
    type: 'permanent',
    status: 'pending',
    serviceType: ['Cleaning', 'Elderly Care'],
    location: {
      city: 'Kampala',
      area: 'Nakawa'
    },
    schedule: {
      date: '2024-01-20',
      startTime: '08:00'
    },
    payment: {
      amount: 800000,
      status: 'pending'
    },
    createdAt: '2024-01-14T10:00:00',
    updatedAt: '2024-01-14T10:00:00'
  }
];

export const mockPayments: PaymentTransaction[] = [
  {
    id: '1',
    requestId: '1',
    maidId: '1',
    maidName: 'Claire Agaba',
    amount: 120000,
    type: 'payment',
    status: 'completed',
    method: 'mobile_money',
    reference: 'MM123456',
    date: '2024-01-13T15:00:00'
  }
];

export const mockNotifications: HomeownerNotification[] = [
  {
    id: '1',
    type: 'request_update',
    title: 'Maid Request Accepted',
    message: 'Claire Agaba has accepted your cleaning request for today',
    requestId: '1',
    maidId: '1',
    date: '2024-01-13T15:05:00',
    read: false,
    action: {
      type: 'view_request',
      data: { requestId: '1' }
    }
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Held in Escrow',
    message: 'Your payment of UGX 120,000 is held securely until service completion',
    requestId: '1',
    date: '2024-01-13T15:01:00',
    read: true,
    action: {
      type: 'release_payment',
      data: { requestId: '1', amount: 120000 }
    }
  }
];
