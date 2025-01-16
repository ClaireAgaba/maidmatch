import {
  EDUCATION_LEVELS,
  LANGUAGES,
  SKILLS,
  RELATIONSHIPS,
  EA_COUNTRIES,
  UGANDAN_TRIBES,
  MARITAL_STATUS,
  GENDER,
} from '../constants/registrationOptions';

export type EducationLevel = typeof EDUCATION_LEVELS[number];
export type Language = typeof LANGUAGES[number];
export type Skill = typeof SKILLS[number];
export type Relationship = typeof RELATIONSHIPS[number];
export type EACountry = typeof EA_COUNTRIES[number];
export type UgandanTribe = typeof UGANDAN_TRIBES[number];
export type MaritalStatus = typeof MARITAL_STATUS[number];
export type Gender = typeof GENDER[number];

export interface MaidRegistrationFormData {
  // Bio Data
  firstName: string;
  lastName: string;
  profilePhoto: string;
  dateOfBirth: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  numberOfChildren: number;
  nationality: EACountry;
  tribe?: UgandanTribe;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };

  // Education Background
  educationLevel: EducationLevel;
  
  // Others
  languages: Language[];
  skills: Skill[];

  // Next of Kin
  nextOfKin: {
    name: string;
    contact: string;
    relationship: Relationship;
  };

  // Medical History
  medicalHistory: {
    allergies: string;
    chronicDiseases: string;
    others: string;
  };

  // Documents
  documents: {
    idCard: string;
    medicalCertificate: string;
    policeLetter: string;
    referenceLetter: string;
    educationCertificates: string[];
  };
}
