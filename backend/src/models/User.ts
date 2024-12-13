import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: 'maid' | 'homeowner' | 'admin';
  nationality: string;
  district?: string;
  tribe?: string;
  languages?: string[];
  relationship?: string;
  profilePicture?: string;
  rating?: number;
  reviews?: mongoose.Types.ObjectId[];
  isAvailable?: boolean;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  preferredSchedule?: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isFirstLogin: boolean;
  documents?: {
    type: string;
    url: string;
    verified: boolean;
  }[];
  medicalHistory?: {
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    vaccinations?: string[];
    additionalInfo?: string;
  };
  generateAuthToken(): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  role: { type: String, enum: ['maid', 'homeowner', 'admin'], required: true },
  nationality: { type: String, default: 'Uganda' },
  district: String,
  tribe: String,
  languages: [String],
  relationship: String,
  profilePicture: String,
  rating: { type: Number, min: 0, max: 5 },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  isAvailable: { type: Boolean, default: true },
  skills: [String],
  experience: Number,
  hourlyRate: Number,
  preferredSchedule: [String],
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending',
    required: true 
  },
  isFirstLogin: { 
    type: Boolean, 
    default: true 
  },
  documents: [{
    type: { type: String },
    url: String,
    verified: { type: Boolean, default: false }
  }],
  medicalHistory: {
    bloodType: String,
    allergies: [String],
    chronicConditions: [String],
    vaccinations: [String],
    additionalInfo: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function(): Promise<string> {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  return token;
};

// Compare password
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
