import { MaidProfile, Job, Payment, Notification } from '../types/maid';

export const mockMaidProfile: MaidProfile = {
  id: '1',
  fullName: 'Sarah Johnson',
  photoUrl: 'https://example.com/photo.jpg',
  age: 28,
  location: {
    city: 'Kampala',
    area: 'Nakawa'
  },
  contact: {
    phone: '+256 778934413',
    email: 'sarah.j@example.com',
    whatsapp: '+256 778934413'
  },
  skills: [
    { id: '1', name: 'Cleaning', description: 'Deep cleaning, organizing', icon: 'broom' },
    { id: '2', name: 'Cooking', description: 'Local and international cuisine', icon: 'food' },
    { id: '3', name: 'Childcare', description: 'Experience with infants and toddlers', icon: 'baby' },
    { id: '4', name: 'Laundry', description: 'Washing, ironing, and folding', icon: 'tshirt-crew' }
  ],
  languages: ['English', 'Luganda', 'Swahili'],
  certifications: [
    {
      id: '1',
      name: 'First Aid Certificate',
      issuer: 'Red Cross Uganda',
      issueDate: '2024-01-01',
      expiryDate: '2026-01-01'
    },
    {
      id: '2',
      name: 'Food Safety Handling',
      issuer: 'UNBS',
      issueDate: '2023-12-01'
    }
  ],
  workHistory: [
    {
      id: '1',
      employerId: 'emp1',
      employerName: 'Mrs. Alice Brown',
      jobType: 'Full-time Housekeeper',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      rating: 4.8,
      review: 'Sarah is an excellent housekeeper. Very thorough and professional.',
      duties: ['Cleaning', 'Cooking', 'Laundry']
    }
  ],
  averageRating: 4.8,
  totalReviews: 15,
  verificationStatus: 'approved',
  profileProgress: 90,
  hourlyRate: 15000,
  availability: {
    status: 'available',
    schedule: [
      {
        day: 'Monday',
        slots: [{ start: '08:00', end: '17:00' }]
      },
      {
        day: 'Tuesday',
        slots: [{ start: '08:00', end: '17:00' }]
      }
    ]
  }
};

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Full-time Housekeeper Needed',
    description: 'Looking for an experienced housekeeper for daily cleaning and cooking',
    employerId: 'emp2',
    employerName: 'Mr. David Wilson',
    location: {
      city: 'Kampala',
      area: 'Kololo'
    },
    jobType: ['Cleaning', 'Cooking'],
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    payRate: {
      amount: 80000,
      type: 'monthly'
    },
    status: 'open',
    startDate: '2024-02-01',
    requirements: ['3 years experience', 'References required'],
    postedAt: '2024-01-14'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    jobId: 'job1',
    employerId: 'emp1',
    employerName: 'Mrs. Alice Brown',
    amount: 80000,
    status: 'completed',
    date: '2024-01-01',
    paymentMethod: 'Mobile Money',
    description: 'December 2023 salary'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'job_request',
    title: 'New Job Request',
    message: 'You have a new job request from Mr. David Wilson',
    date: '2024-01-14T10:00:00',
    read: false,
    actionUrl: '/jobs/1'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of UGX 80,000 received from Mrs. Alice Brown',
    date: '2024-01-01T15:30:00',
    read: true
  }
];
