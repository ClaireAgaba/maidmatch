import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { District, Tribe, Language, Relationship } from '../models/ReferenceData';
import { connectDatabase } from '../config/database';

dotenv.config();

const districts = [
  { name: 'Kampala', region: 'Central', active: true },
  { name: 'Wakiso', region: 'Central', active: true },
  { name: 'Mukono', region: 'Central', active: true },
  { name: 'Jinja', region: 'Eastern', active: true },
  { name: 'Mbale', region: 'Eastern', active: true },
  { name: 'Gulu', region: 'Northern', active: true },
  { name: 'Lira', region: 'Northern', active: true },
  { name: 'Mbarara', region: 'Western', active: true },
  { name: 'Kabale', region: 'Western', active: true }
];

const tribes = [
  { name: 'Baganda', active: true },
  { name: 'Banyankole', active: true },
  { name: 'Basoga', active: true },
  { name: 'Bakiga', active: true },
  { name: 'Iteso', active: true },
  { name: 'Langi', active: true },
  { name: 'Acholi', active: true },
  { name: 'Bagisu', active: true },
  { name: 'Lugbara', active: true },
  { name: 'Banyoro', active: true }
];

const languages = [
  { name: 'Luganda', active: true },
  { name: 'English', active: true },
  { name: 'Swahili', active: true },
  { name: 'Runyankole', active: true },
  { name: 'Lusoga', active: true },
  { name: 'Luo', active: true },
  { name: 'Runyoro', active: true },
  { name: 'Ateso', active: true },
  { name: 'Lugisu', active: true }
];

const relationships = [
  { name: 'Single', active: true },
  { name: 'Married', active: true },
  { name: 'Divorced', active: true },
  { name: 'Widowed', active: true }
];

async function seedData() {
  try {
    console.log('Connecting to database...');
    await connectDatabase();
    console.log('Connected successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      District.deleteMany({}),
      Tribe.deleteMany({}),
      Language.deleteMany({}),
      Relationship.deleteMany({})
    ]);
    console.log('Existing data cleared');

    // Insert new data
    console.log('Inserting new data...');
    const [insertedDistricts, insertedTribes, insertedLanguages, insertedRelationships] = await Promise.all([
      District.insertMany(districts),
      Tribe.insertMany(tribes),
      Language.insertMany(languages),
      Relationship.insertMany(relationships)
    ]);

    console.log(`Inserted ${insertedDistricts.length} districts`);
    console.log(`Inserted ${insertedTribes.length} tribes`);
    console.log(`Inserted ${insertedLanguages.length} languages`);
    console.log(`Inserted ${insertedRelationships.length} relationships`);

    console.log('Reference data seeded successfully!');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reference data:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing connection:', err);
    process.exit(1);
  }
});

seedData();
