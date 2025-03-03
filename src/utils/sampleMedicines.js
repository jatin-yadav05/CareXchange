import Medicine from '../models/Medicine.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const sampleMedicines = [
  {
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    description: "Common pain reliever and fever reducer. Effective for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.",
    quantity: 100,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    condition: "new",
    originalPrice: 199,
    isFree: true,
    images: ["/images/medicines/paracetamol.jpg"],
    location: "Mumbai, Maharashtra",
    status: "available",
    prescriptionRequired: false,
    packaging: "sealed",
    storageInstructions: "Store below 30°C in a dry place. Protect from light.",
    dosageForm: "tablet",
    strength: "500mg",
    manufacturer: "GlaxoSmithKline",
    batchNumber: "BN2024001",
    verificationStatus: "verified",
    notes: "Standard paracetamol tablets in blister packaging"
  },
  {
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    description: "Antibiotic used to treat a number of bacterial infections. Works by stopping the growth of bacteria.",
    quantity: 50,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    condition: "new",
    originalPrice: 299,
    isFree: false,
    images: ["/images/medicines/amoxicillin.jpg"],
    location: "Delhi, NCR",
    status: "available",
    prescriptionRequired: true,
    packaging: "sealed",
    storageInstructions: "Store below 25°C in a dry place",
    dosageForm: "capsule",
    strength: "250mg",
    manufacturer: "Cipla",
    batchNumber: "BN2024002",
    verificationStatus: "verified",
    notes: "Requires prescription for dispensing"
  },
  {
    name: "Metformin 500mg",
    category: "Diabetes",
    description: "Oral diabetes medicine that helps control blood sugar levels. First-line medication for the treatment of type 2 diabetes.",
    quantity: 150,
    expiryDate: new Date(Date.now() + 545 * 24 * 60 * 60 * 1000), // 1.5 years from now
    condition: "new",
    originalPrice: 399,
    isFree: true,
    images: ["/images/medicines/metformin.jpg"],
    location: "Bangalore, Karnataka",
    status: "available",
    prescriptionRequired: true,
    packaging: "sealed",
    storageInstructions: "Store at room temperature away from moisture, heat, and light",
    dosageForm: "tablet",
    strength: "500mg",
    manufacturer: "Sun Pharma",
    batchNumber: "BN2024003",
    verificationStatus: "verified",
    notes: "Extended-release tablets"
  },
  {
    name: "Vitamin D3 1000IU",
    category: "Vitamins & Supplements",
    description: "Vitamin D supplement to support bone health, immune system, and overall wellness. Essential for calcium absorption.",
    quantity: 200,
    expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 years from now
    condition: "new",
    originalPrice: 599,
    isFree: true,
    images: ["/images/medicines/vitamind3.jpg"],
    location: "Chennai, Tamil Nadu",
    status: "available",
    prescriptionRequired: false,
    packaging: "sealed",
    storageInstructions: "Store in a cool, dry place",
    dosageForm: "capsule",
    strength: "1000IU",
    manufacturer: "Himalaya",
    batchNumber: "BN2024004",
    verificationStatus: "verified",
    notes: "Soft gel capsules for better absorption"
  },
  {
    name: "Salbutamol Inhaler",
    category: "Respiratory",
    description: "Bronchodilator that relaxes muscles in the airways and increases air flow to the lungs. Used to treat asthma and COPD.",
    quantity: 30,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    condition: "new",
    originalPrice: 699,
    isFree: false,
    images: ["/images/medicines/salbutamol.jpg"],
    location: "Hyderabad, Telangana",
    status: "available",
    prescriptionRequired: true,
    packaging: "sealed",
    storageInstructions: "Store at room temperature. Keep away from heat and direct sunlight",
    dosageForm: "inhaler",
    strength: "100mcg",
    manufacturer: "Cipla",
    batchNumber: "BN2024005",
    verificationStatus: "verified",
    notes: "Each inhaler contains 200 metered doses"
  }
];

export async function seedMedicines() {
  try {
    // Hash a default password for sample users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    // First, let's create a sample donor user if it doesn't exist
    let donor = await User.findOne({ email: "donor@example.com" });
    if (!donor) {
      donor = await User.create({
        name: "Sample Donor",
        email: "donor@example.com",
        role: "donor",
        isVerified: true,
        password: hashedPassword,
        phone: "+91 9876543210",
        address: "123 Donor Street, Mumbai"
      });
      console.log('Created sample donor user');
    }

    // Create a sample verifier if it doesn't exist
    let verifier = await User.findOne({ email: "verifier@example.com" });
    if (!verifier) {
      verifier = await User.create({
        name: "Sample Verifier",
        email: "verifier@example.com",
        role: "admin",
        isVerified: true,
        password: hashedPassword,
        phone: "+91 9876543211",
        address: "456 Admin Street, Delhi"
      });
      console.log('Created sample verifier user');
    }

    // Add donor and verifier IDs to each medicine
    const medicinesWithIds = sampleMedicines.map(medicine => ({
      ...medicine,
      donor: donor._id,
      verifiedBy: verifier._id
    }));

    // Delete existing medicines
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Insert the sample medicines
    const result = await Medicine.insertMany(medicinesWithIds);
    console.log(`Inserted ${result.length} medicines`);
    
    return result;
  } catch (error) {
    console.error('Error in seedMedicines:', error);
    throw error;
  }
}

// Function to get random medicines for testing
export async function getRandomMedicines(count = 5) {
  try {
    const medicines = await Medicine.aggregate([{ $sample: { size: count } }]);
    return medicines;
  } catch (error) {
    console.error('Error getting random medicines:', error);
    throw error;
  }
}

// Function to clear all medicines (use carefully!)
export async function clearMedicines() {
  try {
    await Medicine.deleteMany({});
    console.log('All medicines cleared from database');
  } catch (error) {
    console.error('Error clearing medicines:', error);
    throw error;
  }
} 