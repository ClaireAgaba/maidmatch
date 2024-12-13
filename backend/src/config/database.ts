import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });

    console.log('Connected to MongoDB');

    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const createIndexes = async () => {
  try {
    // User indexes
    await mongoose.connection.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { phone: 1 }, unique: true },
      { key: { role: 1 } },
      { key: { district: 1 } },
      { key: { tribe: 1 } },
      { key: { languages: 1 } },
    ]);

    // Job indexes
    await mongoose.connection.collection('jobs').createIndexes([
      { key: { status: 1 } },
      { key: { maid: 1 } },
      { key: { homeowner: 1 } },
      { key: { createdAt: -1 } },
    ]);

    // Review indexes
    await mongoose.connection.collection('reviews').createIndexes([
      { key: { maid: 1 } },
      { key: { homeowner: 1 } },
      { key: { rating: -1 } },
    ]);

    // Reference data indexes
    await mongoose.connection.collection('districts').createIndexes([
      { key: { name: 1 }, unique: true },
      { key: { region: 1 } },
      { key: { active: 1 } },
    ]);

    await mongoose.connection.collection('tribes').createIndexes([
      { key: { name: 1 }, unique: true },
      { key: { active: 1 } },
    ]);

    await mongoose.connection.collection('languages').createIndexes([
      { key: { name: 1 }, unique: true },
      { key: { active: 1 } },
    ]);

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    // Don't throw error here, just log it
    // The application can still function without indexes
  }
};
