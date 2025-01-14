export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
}

export interface WorkHistory {
  id: string;
  employerId: string;
  employerName: string;
  jobType: string;
  startDate: string;
  endDate?: string;
  rating: number;
  review?: string;
  duties: string[];
}

export interface MaidProfile {
  id: string;
  fullName: string;
  photoUrl?: string;
  age: number;
  location: {
    city: string;
    area: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  skills: Skill[];
  languages: string[];
  certifications: Certification[];
  workHistory: WorkHistory[];
  averageRating: number;
  totalReviews: number;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  profileProgress: number;
  hourlyRate: number;
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    schedule: {
      day: string;
      slots: {
        start: string;
        end: string;
      }[];
    }[];
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  employerId: string;
  employerName: string;
  location: {
    city: string;
    area: string;
  };
  jobType: string[];
  workingHours: {
    start: string;
    end: string;
  };
  payRate: {
    amount: number;
    type: 'hourly' | 'daily' | 'monthly';
  };
  status: 'open' | 'applied' | 'accepted' | 'completed';
  startDate: string;
  endDate?: string;
  requirements: string[];
  postedAt: string;
}

export interface Payment {
  id: string;
  jobId: string;
  employerId: string;
  employerName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  paymentMethod: string;
  description: string;
}

export interface Notification {
  id: string;
  type: 'job_request' | 'application_status' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}
