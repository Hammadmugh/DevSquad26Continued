import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/cardeposit';

/* ── Schemas (inline for seed script) ─────────────────────── */
const UserSchema = new mongoose.Schema({ fullName: String, email: String, passwordHash: String, mobile: String, wishlist: [mongoose.Schema.Types.ObjectId] }, { timestamps: true });
const AuctionSchema = new mongoose.Schema({
  carName: String, carImage: String, currentBid: Number, startingBid: Number,
  trending: Boolean, isLive: Boolean, sold: Boolean, rating: Number, review: String,
  endTime: Date, seller: mongoose.Schema.Types.ObjectId, bids: Array,
  make: String, model: String, year: String, color: String, style: String, type: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Auction = mongoose.model('Auction', AuctionSchema);

const AUCTION_DATA = [
  /* Live auctions (home page) */
  { carName: 'Mazda MX-5', carImage: '/live-auction-1.png', currentBid: 1079.99, startingBid: 1000, trending: true, isLive: true, rating: 5, make: 'Mazda', model: 'MX-5', year: '2022', color: 'Red', style: 'Convertible', type: 'Sports', endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { carName: 'Porsche 911', carImage: '/live-auction-2.png', currentBid: 1079.99, startingBid: 1000, trending: true, isLive: true, rating: 5, make: 'Porsche', model: '911', year: '2023', color: 'Silver', style: 'Coupe', type: 'Sports', endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  { carName: 'Alpine A110', carImage: '/live-auction-3.png', currentBid: 1079.99, startingBid: 1000, trending: false, isLive: true, rating: 5, make: 'Alpine', model: 'A110', year: '2022', color: 'Blue', style: 'Coupe', type: 'Sports', endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
  { carName: 'BMW M4', carImage: '/live-auction-4.png', currentBid: 60000, startingBid: 50000, trending: true, isLive: true, rating: 5, make: 'BMW', model: 'M4', year: '2023', color: 'White', style: 'Coupe', type: 'Sports', endTime: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000) },
  /* Car auction listings */
  { carName: 'Range Rover', carImage: '/car auction (1).png', currentBid: 107899.99, startingBid: 100000, trending: true, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Land Rover', model: 'Range Rover', year: '2022', color: 'Black', style: 'SUV', type: 'SUV', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Kia Carnival', carImage: '/car auction (2).png', currentBid: 107899.99, startingBid: 100000, trending: false, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Kia', model: 'Carnival', year: '2022', color: 'White', style: 'MPV', type: 'MPV', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Bentley', carImage: '/car auction (3).png', currentBid: 107899.99, startingBid: 100000, trending: false, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Bentley', model: 'Continental', year: '2023', color: 'Blue', style: 'Coupe', type: 'Luxury', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Hyundai Verna', carImage: '/car auction (4).png', currentBid: 107899.99, startingBid: 100000, trending: true, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Hyundai', model: 'Verna', year: '2022', color: 'Silver', style: 'Sedan', type: 'Sedan', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Mahindra Thar', carImage: '/car auction (5).png', currentBid: 107899.99, startingBid: 100000, trending: false, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Mahindra', model: 'Thar', year: '2022', color: 'Red', style: 'SUV', type: 'SUV', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Ferrari', carImage: '/car auction (6).png', currentBid: 107899.99, startingBid: 100000, trending: true, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Ferrari', model: '488', year: '2022', color: 'Red', style: 'Coupe', type: 'Sports', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'BMW M4', carImage: '/car auction (7).png', currentBid: 107899.99, startingBid: 100000, trending: false, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'BMW', model: 'M4', year: '2021', color: 'Grey', style: 'Coupe', type: 'Sports', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Maruti Brezza', carImage: '/car auction (8).png', currentBid: 107899.99, startingBid: 100000, trending: false, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Maruti', model: 'Brezza', year: '2022', color: 'White', style: 'SUV', type: 'Compact SUV', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Jaguar XF', carImage: '/car auction (9).png', currentBid: 107899.99, startingBid: 100000, trending: true, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Jaguar', model: 'XF', year: '2022', color: 'Black', style: 'Sedan', type: 'Luxury', endTime: new Date('2023-01-03T18:00:00') },
  { carName: 'Tata Tiago', carImage: '/car auction (10).png', currentBid: 107899.99, startingBid: 100000, trending: false, isLive: false, rating: 5, review: 'Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....', make: 'Tata', model: 'Tiago', year: '2022', color: 'Blue', style: 'Hatchback', type: 'Hatchback', endTime: new Date('2023-01-03T18:00:00') },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clean
  await User.deleteMany({});
  await Auction.deleteMany({});
  console.log('Cleared existing data');

  // Seed demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await User.create({
    fullName: 'Manish Sharma',
    email: 'manish@cardeposit.com',
    passwordHash,
    mobile: '1234567890',
  });
  console.log(`Demo user created: ${demoUser.email}`);

  // Seed auctions
  const auctions = await Auction.insertMany(
    AUCTION_DATA.map((a) => ({ ...a, seller: demoUser._id, bids: [] })),
  );
  console.log(`${auctions.length} auctions seeded`);

  // Add first 6 auctions to demo user's wishlist
  await User.findByIdAndUpdate(demoUser._id, {
    wishlist: auctions.slice(4, 10).map((a) => a._id),
  });
  console.log('Wishlist populated for demo user');

  await mongoose.disconnect();
  console.log('\nSeed complete!');
  console.log('Demo login → email: manish@cardeposit.com | password: password123');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
