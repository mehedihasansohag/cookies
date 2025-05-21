
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Models
const Platform = require('../models/platform.model');
const Plan = require('../models/plan.model');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Coupon = require('../models/coupon.model');
const Credential = require('../models/credential.model');
const TutorialVideo = require('../models/tutorial.model');

// Initial data
const INITIAL_PLATFORMS = [
  { name: 'Coursera', logo: '/placeholder.svg', url: 'https://coursera.org', description: 'Online learning platform' },
  { name: 'Udemy', logo: '/placeholder.svg', url: 'https://udemy.com', description: 'Online course marketplace' },
  { name: 'Pluralsight', logo: '/placeholder.svg', url: 'https://pluralsight.com', description: 'Technical training platform' },
  { name: 'LinkedIn Learning', logo: '/placeholder.svg', url: 'https://linkedin.com/learning', description: 'Professional skill development' },
  { name: 'Skillshare', logo: '/placeholder.svg', url: 'https://skillshare.com', description: 'Creative skills community' },
  { name: 'MasterClass', logo: '/placeholder.svg', url: 'https://masterclass.com', description: 'Classes taught by experts' },
];

const INITIAL_USERS = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { name: 'Manager User', email: 'manager@example.com', password: 'manager123', role: 'manager' },
  { name: 'Support User', email: 'support@example.com', password: 'support123', role: 'support' },
  { name: 'Regular User', email: 'user@example.com', password: 'user123', role: 'user' },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing data
    await Promise.all([
      Platform.deleteMany({}),
      Plan.deleteMany({}),
      User.deleteMany({}),
      Coupon.deleteMany({}),
      Credential.deleteMany({}),
      TutorialVideo.deleteMany({})
    ]);
    
    console.log('Existing data cleared');
    
    // Insert platforms
    const platforms = await Platform.insertMany(INITIAL_PLATFORMS);
    console.log(`${platforms.length} platforms inserted`);
    
    // Create a mapping of platform names to IDs
    const platformMap = {};
    platforms.forEach(p => {
      platformMap[p.name] = p._id;
    });
    
    // Insert plans
    const plans = await Plan.insertMany([
      { 
        name: 'Basic Developer Pack', 
        description: 'Access to basic programming courses', 
        price: 29.99, 
        platforms: [platformMap['Udemy'], platformMap['Pluralsight']],
        stickerText: 'Popular',
        stickerColor: '#8B5CF6',
        durationType: 'months',
        durationValue: 1,
        showOnHomepage: true
      },
      { 
        name: 'Premium Learning Bundle', 
        description: 'Comprehensive access to top learning platforms', 
        price: 49.99, 
        platforms: [platformMap['Coursera'], platformMap['Udemy'], platformMap['LinkedIn Learning']],
        stickerText: 'Featured',
        stickerColor: '#F59E0B',
        durationType: 'months',
        durationValue: 3,
        showOnHomepage: true
      },
      { 
        name: 'Creative Pro Package', 
        description: 'Perfect for designers and creative professionals', 
        price: 39.99, 
        platforms: [platformMap['Skillshare'], platformMap['MasterClass']], 
        durationType: 'months',
        durationValue: 1,
        showOnHomepage: true
      },
    ]);
    console.log(`${plans.length} plans inserted`);
    
    // Insert users with hashed passwords
    const users = [];
    for (const user of INITIAL_USERS) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      });
      
      const savedUser = await newUser.save();
      users.push(savedUser);
    }
    const planId = plans
    console.log(planId)
    let expirationDate = new Date();
    console.log(`${users.length} users inserted`);
    
    // Insert coupons
    const coupons = await Coupon.insertMany([
      { code: 'DEV10', discount: 10, planId: plans[0]._id, active: true },
      { code: 'BUNDLE20', discount: 20, planId: plans[1]._id, active: true },
      { code: 'CREATIVE15', discount: 15, planId: plans[2]._id, active: true },
    ]);
    console.log(`${coupons.length} coupons inserted`);
    const order = new Order({
      userId: users[3]._id,
      userName: users[3].name,
      planId:plans[0]._id,
      planName: plans[0].name,
      originalPrice:200,
      finalPrice:200,
      lastFourDigits:5241,
      paymentLastFour: 5241, // For backward compatibility
      couponCode:"DEV10",
      couponDiscount:100,
      expirationDate: expirationDate.setMonth(expirationDate.getMonth() + 10)
      ,
      paymentMethod: 'credit_card',
      status: 'approved'
    });
    
    await order.save();
    // Insert credentials
    const credentials = await Credential.insertMany([
      { 
        planId: plans[0]._id, 
        platformId: platformMap['Udemy'], 
        platform: 'Udemy', 
        username: 'basicdev@example.com', 
        password: 'password123' 
      },
      { 
        planId: plans[0]._id, 
        platformId: platformMap['Pluralsight'], 
        platform: 'Pluralsight', 
        username: 'basicdev@example.com', 
        password: 'password123' 
      },
      { 
        planId: plans[1]._id, 
        platformId: platformMap['Coursera'], 
        platform: 'Coursera', 
        username: 'premiumbundle@example.com', 
        password: 'password456' 
      },
      { 
        planId: plans[1]._id, 
        platformId: platformMap['Udemy'], 
        platform: 'Udemy', 
        username: 'premiumbundle@example.com', 
        password: 'password456' 
      },
      { 
        planId: plans[2]._id, 
        platformId: platformMap['Skillshare'], 
        platform: 'Skillshare', 
        username: 'creativepro@example.com', 
        password: 'password789' 
      },
    ]);
    console.log(`${credentials.length} credentials inserted`);
    
    // Insert tutorial videos
    const tutorials = await TutorialVideo.insertMany([
      {
        title: 'How to Login on Desktop',
        description: 'Step by step guide to login on desktop',
        type: 'login',
        thumbnailUrl: '/placeholder.svg',
        contentUrl: 'https://example.com/videos/login-desktop.mp4'
      },
      {
        title: 'How to Login on Mobile',
        description: 'Step by step guide to login on mobile',
        type: 'login-mobile',
        thumbnailUrl: '/placeholder.svg',
        contentUrl: 'https://example.com/videos/login-mobile.mp4'
      },
      {
        title: 'How to Use Cookies on Desktop',
        description: 'Step by step guide to use cookies on desktop',
        type: 'cookie',
        thumbnailUrl: '/placeholder.svg',
        contentUrl: 'https://example.com/videos/cookie-desktop.mp4'
      },
      {
        title: 'How to Use Cookies on Mobile',
        description: 'Step by step guide to use cookies on mobile',
        type: 'cookie-mobile',
        thumbnailUrl: '/placeholder.svg',
        contentUrl: 'https://example.com/videos/cookie-mobile.mp4'
      }
    ]);
    console.log(`${tutorials.length} tutorial videos inserted`);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
