import mongoose, { Schema, Document } from 'mongoose';

// Interface for Districts
export interface IDistrict extends Document {
  name: string;
  region: string;
  active: boolean;
}

// Interface for Tribes
export interface ITribe extends Document {
  name: string;
  active: boolean;
}

// Interface for Languages
export interface ILanguage extends Document {
  name: string;
  active: boolean;
}

// Interface for Relationships
export interface IRelationship extends Document {
  name: string;
  active: boolean;
}

// District Schema
const DistrictSchema = new Schema({
  name: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Tribe Schema
const TribeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Language Schema
const LanguageSchema = new Schema({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Relationship Schema
const RelationshipSchema = new Schema({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const District = mongoose.model<IDistrict>('District', DistrictSchema);
export const Tribe = mongoose.model<ITribe>('Tribe', TribeSchema);
export const Language = mongoose.model<ILanguage>('Language', LanguageSchema);
export const Relationship = mongoose.model<IRelationship>('Relationship', RelationshipSchema);
