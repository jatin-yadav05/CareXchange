import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedMedicines } from '../src/utils/sampleMedicines.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verify environment variables are loaded
console.log('Environment check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');

// Add this to your process to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

async function runSeed() {
  try {
    console.log('Starting to seed medicines...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('Connected to MongoDB successfully');

    // Seed the data
    const result = await seedMedicines();
    console.log(`Successfully seeded ${result.length} medicines`);
    console.log('Sample medicines added:');
    result.forEach((medicine, index) => {
      console.log(`${index + 1}. ${medicine.name} (${medicine.category})`);
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding medicines:', error);
    // Ensure we disconnect even if there's an error
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB after error');
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
    process.exit(1);
  }
}

runSeed(); 