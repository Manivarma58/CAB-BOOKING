require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Car = require('./models/Car');
const User = require('./models/User');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ucab_db';
    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // 1. Clean existing records
    console.log('Cleaning existing collection records...');
    await Admin.deleteMany({});
    await Car.deleteMany({});
    console.log('Collections cleared.');

    // 2. Seed Admin account
    console.log('Seeding default administrator account...');
    const admin = await Admin.create({
      name: 'UCab System Admin',
      email: 'admin@ucab.com',
      password: 'adminpassword123', // Will be hashed automatically by pre-save schema hook
      profileImage: ''
    });
    console.log(`✓ Admin created: ${admin.email} (Password: adminpassword123)`);

    // 3. Seed Cars
    console.log('Generating 60 sample fleet cabs (12 per category)...');
    const cabs = [];

    const driverNames = [
      'Robert Johnson', 'Sarah Connor', 'Marcus Miller', 'Emma Watson', 'Akira Kurosawa',
      'Amit Sharma', 'Priya Patel', 'Rahul Verma', 'Sanjay Kumar', 'Deepa Nair',
      'Rajesh Iyer', 'Sunita Rao', 'Vijay Chauhan', 'Ananya Gupta', 'Vikram Singh',
      'Karan Johar', 'Neha Sharma', 'Arjun Kapoor', 'Pooja Hegde', 'Rohan Mehta',
      'Siddharth Malhotra', 'Shraddha Kapoor', 'Aditya Roy', 'Kriti Sanon', 'Varun Dhawan',
      'Ranbir Kapoor', 'Alia Bhatt', 'Ranveer Singh', 'Deepika Padukone', 'Ayushmann Khurrana',
      'Kartik Aaryan', 'Bhumi Pednekar', 'Vicky Kaushal', 'Katrina Kaif', 'Taapsee Pannu',
      'Rajkummar Rao', 'Patralekha Paul', 'Manoj Bajpayee', 'Pankaj Tripathi', 'Nawazuddin Siddiqui',
      'Saif Ali Khan', 'Kareena Kapoor', 'Abhishek Bachchan', 'Aishwarya Rai', 'Hrithik Roshan',
      'Bobby Deol', 'Sunny Deol', 'Dharmendra Singh', 'Hema Malini', 'Jaya Bachchan',
      'Anupam Kher', 'Kirron Kher', 'Boman Irani', 'Paresh Rawal', 'Akshay Kumar',
      'Twinkle Khanna', 'Suniel Shetty', 'Mana Shetty', 'Sanjay Dutt', 'Manyata Dutt'
    ];

    const carStates = ['DL', 'MH', 'KA', 'HR', 'UP', 'KA', 'TS', 'TN', 'GJ', 'WB'];

    const getCarNumber = (idx) => {
      const state = carStates[idx % carStates.length];
      const series = 10 + (idx % 89);
      const code = String.fromCharCode(65 + (idx % 26)) + String.fromCharCode(65 + ((idx + 3) % 26));
      const num = 1000 + (idx * 137) % 9000;
      return `${state}-${series}-${code}-${num}`;
    };

    // 12 Hatchbacks (₹11 - ₹14 / km)
    const hatchbacks = [
      { model: 'Hyundai i20', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
      { model: 'Maruti Suzuki Swift', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600&auto=format&fit=crop' },
      { model: 'Tata Altroz Premium', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Honda Jazz Comfort', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Maruti Suzuki Baleno', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop' },
      { model: 'Volkswagen Polo GT', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' },
      { model: 'Toyota Prius Hybrid', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
      { model: 'Ford Figo Titanium', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600&auto=format&fit=crop' },
      { model: 'Renault Clio Sport', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Nissan Micra Active', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Kia Rio Hatch', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=600&auto=format&fit=crop' },
      { model: 'Toyota Glanza Tour', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' }
    ];

    hatchbacks.forEach((car, idx) => {
      cabs.push({
        model: car.model,
        carType: 'Hatchback',
        carNumber: getCarNumber(idx),
        driverName: driverNames[idx],
        pricePerKm: 11 + (idx % 4), // ₹11 - ₹14
        carImage: car.image,
        seats: 4,
        availability: true
      });
    });

    // 12 Sedans (₹16 - ₹20 / km)
    const sedans = [
      { model: 'Honda City i-VTEC', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop' },
      { model: 'Hyundai Verna Turbo', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop' },
      { model: 'Maruti Suzuki Ciaz', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop' },
      { model: 'Skoda Slavia Style', image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=600&auto=format&fit=crop' },
      { model: 'Volkswagen Virtus GT', image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Tesla Model 3 Electric', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop' },
      { model: 'Toyota Corolla Altis', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop' },
      { model: 'Hyundai Elantra Premium', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop' },
      { model: 'Skoda Octavia L&K', image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=600&auto=format&fit=crop' },
      { model: 'Audi A3 Executive', image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600&auto=format&fit=crop' },
      { model: 'BMW 2 Series Gran Coupe', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop' },
      { model: 'Mercedes-Benz A-Class', image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop' }
    ];

    sedans.forEach((car, idx) => {
      cabs.push({
        model: car.model,
        carType: 'Sedan',
        carNumber: getCarNumber(idx + 12),
        driverName: driverNames[idx + 12],
        pricePerKm: 16 + (idx % 5), // ₹16 - ₹20
        carImage: car.image,
        seats: 4,
        availability: true
      });
    });

    // 12 SUVs (₹22 - ₹28 / km)
    const suvs = [
      { model: 'Mahindra XUV700 AX7', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop' },
      { model: 'Tata Safari Gold', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' },
      { model: 'Toyota Fortuner Legender', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop' },
      { model: 'Hyundai Creta SX', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' },
      { model: 'Kia Seltos GT-Line', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop' },
      { model: 'MG Hector Sharp', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' },
      { model: 'Chevrolet Suburban Tour', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop' },
      { model: 'Mahindra Scorpio-N', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' },
      { model: 'Tata Harrier XZ', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop' },
      { model: 'Jeep Compass Limited', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' },
      { model: 'Hyundai Alcazar Signature', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop' },
      { model: 'Skoda Kodiaq L&K', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop' }
    ];

    suvs.forEach((car, idx) => {
      cabs.push({
        model: car.model,
        carType: 'SUV',
        carNumber: getCarNumber(idx + 24),
        driverName: driverNames[idx + 24],
        pricePerKm: 22 + (idx % 7), // ₹22 - ₹28
        carImage: car.image,
        seats: 6,
        availability: true
      });
    });

    // 12 Minis (₹9 - ₹11 / km)
    const minis = [
      { model: 'Maruti Suzuki WagonR', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Tata Tiago Revotron', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
      { model: 'Hyundai Grand i10 Nios', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Maruti Suzuki Celerio', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
      { model: 'Renault Kwid Climber', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Nissan Leaf Mini EV', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
      { model: 'Maruti Suzuki Alto K10', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Maruti Suzuki S-Presso', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
      { model: 'Tata Tiago EV', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Hyundai Santro Era', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
      { model: 'Datsun GO D', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop' },
      { model: 'Maruti Suzuki Tour H1', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' }
    ];

    minis.forEach((car, idx) => {
      cabs.push({
        model: car.model,
        carType: 'Mini',
        carNumber: getCarNumber(idx + 36),
        driverName: driverNames[idx + 36],
        pricePerKm: 9 + (idx % 3), // ₹9 - ₹11
        carImage: car.image,
        seats: 4,
        availability: true
      });
    });

    // 12 Bikes (₹5 - ₹7 / km)
    const bikes = [
      { model: 'Yamaha MT-15 V2', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Royal Enfield Classic 350', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'KTM Duke 200 BS6', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'TVS Apache RTR 160', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Bajaj Pulsar NS200', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Hero Splendor Plus', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Honda Activa 6G Scooter', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Suzuki Access 125', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'TVS Jupiter SmartXonnect', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Honda Hornet 2.0', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Yamaha FZ-S FI V4', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' },
      { model: 'Royal Enfield Bullet 350', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop' }
    ];

    bikes.forEach((car, idx) => {
      cabs.push({
        model: car.model,
        carType: 'Bike',
        carNumber: getCarNumber(idx + 48),
        driverName: driverNames[idx + 48],
        pricePerKm: 5 + (idx % 3), // ₹5 - ₹7
        carImage: car.image,
        seats: 1,
        availability: true
      });
    });

    console.log(`Inserting ${cabs.length} cabs into the database...`);
    for (const cab of cabs) {
      await Car.create(cab);
    }
    console.log('✓ Successfully inserted 60 cabs (12 per category).');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding database failed:', err);
    process.exit(1);
  }
};

seedData();
