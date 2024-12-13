import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  role: 'maid' | 'homeowner' | 'admin';
  passportPhoto?: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  numberOfKids: number;
  nextOfKin: {
    fullName: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['maid', 'homeowner', 'admin'],
      default: 'maid',
    },
    passportPhoto: {
      type: String,
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
      required: [true, 'Marital status is required'],
    },
    numberOfKids: {
      type: Number,
      default: 0,
      min: [0, 'Number of kids cannot be negative'],
    },
    nextOfKin: {
      fullName: {
        type: String,
        required: [true, 'Next of kin full name is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Next of kin phone number is required'],
        trim: true,
      },
      relationship: {
        type: String,
        required: [true, 'Next of kin relationship is required'],
        enum: ['brother', 'sister', 'cousin', 'mother', 'father', 'aunt', 'uncle'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);
