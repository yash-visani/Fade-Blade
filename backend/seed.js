const mongoose = require('mongoose');
const Service = require('./models/Service');

// PASTE YOUR WORKING MONGODB URL HERE
const MONGO_URI = "mongodb+srv://yashvisani45_db_user:Yash1708@cluster0.qu7rn0m.mongodb.net/barbershop?retryWrites=true&w=majority";

const defaultServices = [
  {
    name: "Classic Men's Haircut",
    description: "Standard haircut with scissors and clippers.",
    category: "Haircut",
    price: 300, // ₹300
    duration: 30, // 30 minutes
  },
  {
    name: "Beard Trim & Shape",
    description: "Professional beard grooming and line-up.",
    category: "Beard Grooming",
    price: 150,
    duration: 15,
  },
  {
    name: "The Full Combo (Hair & Beard)",
    description: "Haircut and beard trim combo for the ultimate look.",
    category: "Combos",
    price: 400,
    duration: 45,
  },
  {
    name: "Hair Wash & Styling",
    description: "Premium wash, blow-dry, and styling with product.",
    category: "Styling",
    price: 200,
    duration: 20,
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database for seeding...');

    // Clear out any old services just in case
    await Service.deleteMany();
    console.log('Cleared old services.');

    // Insert the new services
    await Service.insertMany(defaultServices);
    console.log('Successfully added default services to the database!');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();