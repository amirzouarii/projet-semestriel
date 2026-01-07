import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Vehicules } from './src/entities/vehicules.entity';
import { Reservation } from './src/entities/reservation.entity';
import { Payment } from './src/entities/payment.entity';
import { Maintenance } from './src/entities/maintenance.entity';
import { Review } from './src/entities/review.entity';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'prj_voitures2',
  entities: [User, Vehicules, Reservation, Payment, Maintenance, Review],
  synchronize: true,
  logging: false,
});

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Clear existing data using raw SQL to handle foreign key constraints
    console.log('🧹 Clearing existing data...');
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      await queryRunner.query('TRUNCATE TABLE "review" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "payment" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "maintenance" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "reservation" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "vehicules" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "user" CASCADE');
    } finally {
      await queryRunner.release();
    }

    // Create Users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await AppDataSource.getRepository(User).save([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        role: 'USER',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        role: 'USER',
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        password: hashedPassword,
        role: 'USER',
      },
      {
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@example.com',
        password: hashedPassword,
        role: 'USER',
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create Vehicles
    console.log('🚗 Creating vehicles...');
    const vehicles = await AppDataSource.getRepository(Vehicules).save([
      {
        marque: 'Toyota',
        modele: 'Camry',
        immatriculation: 'ABC-123-TN',
        etat: 'Disponible',
        prixJour: 150.0,
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb',
        annee: 2022,
        couleur: 'Blanc',
        kilometrage: 25000,
        carburant: 'Essence',
        transmission: 'Automatique',
        places: 5,
        description: 'Berline confortable et fiable, idéale pour les longs trajets.',
      },
      {
        marque: 'Honda',
        modele: 'Civic',
        immatriculation: 'DEF-456-TN',
        etat: 'Disponible',
        prixJour: 120.0,
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588',
        annee: 2021,
        couleur: 'Gris',
        kilometrage: 35000,
        carburant: 'Essence',
        transmission: 'Manuelle',
        places: 5,
        description: 'Voiture compacte économique, parfaite pour la ville.',
      },
      {
        marque: 'BMW',
        modele: 'X5',
        immatriculation: 'GHI-789-TN',
        etat: 'En maintenance',
        prixJour: 300.0,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
        annee: 2023,
        couleur: 'Noir',
        kilometrage: 15000,
        carburant: 'Diesel',
        transmission: 'Automatique',
        places: 7,
        description: 'SUV luxueux avec espace généreux et performances exceptionnelles.',
      },
      {
        marque: 'Mercedes',
        modele: 'C-Class',
        immatriculation: 'JKL-101-TN',
        etat: 'Disponible',
        prixJour: 280.0,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
        annee: 2023,
        couleur: 'Argent',
        kilometrage: 12000,
        carburant: 'Hybride',
        transmission: 'Automatique',
        places: 5,
        description: 'Berline de luxe allemande avec intérieur raffiné.',
      },
      {
        marque: 'Audi',
        modele: 'A4',
        immatriculation: 'MNO-202-TN',
        etat: 'Loué',
        prixJour: 250.0,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
        annee: 2022,
        couleur: 'Bleu',
        kilometrage: 28000,
        carburant: 'Diesel',
        transmission: 'Automatique',
        places: 5,
        description: 'Berline sportive avec technologie avancée.',
      },
      {
        marque: 'Volkswagen',
        modele: 'Golf',
        immatriculation: 'PQR-303-TN',
        etat: 'Disponible',
        prixJour: 100.0,
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89',
        annee: 2020,
        couleur: 'Rouge',
        kilometrage: 45000,
        carburant: 'Essence',
        transmission: 'Manuelle',
        places: 5,
        description: 'Compacte polyvalente, idéale pour tous les jours.',
      },
      {
        marque: 'Ford',
        modele: 'Mustang',
        immatriculation: 'STU-404-TN',
        etat: 'Disponible',
        prixJour: 350.0,
        image: 'https://images.unsplash.com/photo-1584345604476-8ec5f8f1e4ee',
        annee: 2023,
        couleur: 'Jaune',
        kilometrage: 8000,
        carburant: 'Essence',
        transmission: 'Automatique',
        places: 4,
        description: 'Voiture sportive emblématique avec performances impressionnantes.',
      },
      {
        marque: 'Tesla',
        modele: 'Model 3',
        immatriculation: 'VWX-505-TN',
        etat: 'Disponible',
        prixJour: 400.0,
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89',
        annee: 2024,
        couleur: 'Blanc',
        kilometrage: 5000,
        carburant: 'Électrique',
        transmission: 'Automatique',
        places: 5,
        description: 'Berline électrique innovante avec autonomie exceptionnelle.',
      },
      {
        marque: 'Peugeot',
        modele: '308',
        immatriculation: 'YZA-606-TN',
        etat: 'Disponible',
        prixJour: 90.0,
        image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a',
        annee: 2021,
        couleur: 'Gris',
        kilometrage: 38000,
        carburant: 'Diesel',
        transmission: 'Manuelle',
        places: 5,
        description: 'Compacte française confortable et économique.',
      },
      {
        marque: 'Renault',
        modele: 'Clio',
        immatriculation: 'BCD-707-TN',
        etat: 'Disponible',
        prixJour: 80.0,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
        annee: 2020,
        couleur: 'Noir',
        kilometrage: 42000,
        carburant: 'Essence',
        transmission: 'Manuelle',
        places: 5,
        description: 'Petite citadine parfaite pour la ville et le stationnement facile.',
      },
    ]);
    console.log(`✅ Created ${vehicles.length} vehicles`);

    // Create Reservations
    console.log('📅 Creating reservations...');
    const now = new Date();
    const reservations = await AppDataSource.getRepository(Reservation).save([
      {
        userId: users[1].id,
        vehicleId: vehicles[0].id,
        startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        status: 'APPROVED',
        totalPrice: 450.0,
      },
      {
        userId: users[2].id,
        vehicleId: vehicles[1].id,
        startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        endDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'APPROVED',
        totalPrice: 360.0,
      },
      {
        userId: users[3].id,
        vehicleId: vehicles[3].id,
        startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'APPROVED',
        totalPrice: 840.0,
      },
      {
        userId: users[4].id,
        vehicleId: vehicles[4].id,
        startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // yesterday
        endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        status: 'APPROVED',
        totalPrice: 1250.0,
      },
      {
        userId: users[1].id,
        vehicleId: vehicles[6].id,
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: 'PENDING',
        totalPrice: 1050.0,
      },
      {
        userId: users[2].id,
        vehicleId: vehicles[5].id,
        startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        endDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        status: 'CANCELLED',
        totalPrice: 200.0,
      },
    ]);
    console.log(`✅ Created ${reservations.length} reservations`);

    // Create Payments
    console.log('💳 Creating payments...');
    const payments = await AppDataSource.getRepository(Payment).save([
      {
        reservationId: reservations[0].id,
        userId: users[1].id,
        amount: 450.0,
        method: 'CARD' as const,
        status: 'COMPLETED' as const,
        paidAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        notes: 'Payment completed via credit card - TXN-001-' + Date.now(),
      },
      {
        reservationId: reservations[1].id,
        userId: users[2].id,
        amount: 360.0,
        method: 'CASH' as const,
        status: 'COMPLETED' as const,
        paidAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        notes: 'Cash payment received at office - TXN-002-' + Date.now(),
      },
      {
        reservationId: reservations[2].id,
        userId: users[3].id,
        amount: 840.0,
        method: 'BANK_TRANSFER' as const,
        status: 'COMPLETED' as const,
        paidAt: new Date(now.getTime()),
        notes: 'Bank transfer confirmed - TXN-003-' + Date.now(),
      },
      {
        reservationId: reservations[3].id,
        userId: users[4].id,
        amount: 1250.0,
        method: 'CARD' as const,
        status: 'COMPLETED' as const,
        paidAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Payment completed via debit card - TXN-004-' + Date.now(),
      },
      {
        reservationId: reservations[4].id,
        userId: users[1].id,
        amount: 1050.0,
        method: 'CARD' as const,
        status: 'PENDING' as const,
        paidAt: undefined,
        notes: 'Payment pending confirmation',
      },
    ]);
    console.log(`✅ Created ${payments.length} payments`);

    // Create Maintenance records
    console.log('🔧 Creating maintenance records...');
    const maintenances = await AppDataSource.getRepository(Maintenance).save([
      {
        vehicleId: vehicles[2].id, // BMW X5
        description: 'Oil change and filter replacement',
        date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        cost: 150.0,
      },
      {
        vehicleId: vehicles[2].id, // BMW X5
        description: 'Brake pad replacement',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        cost: 350.0,
      },
      {
        vehicleId: vehicles[0].id, // Toyota Camry
        description: 'Tire rotation and alignment',
        date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        cost: 100.0,
      },
      {
        vehicleId: vehicles[1].id, // Honda Civic
        description: 'Battery replacement',
        date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        cost: 200.0,
      },
      {
        vehicleId: vehicles[3].id, // Mercedes C-Class
        description: 'Air conditioning service',
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        cost: 250.0,
      },
    ]);
    console.log(`✅ Created ${maintenances.length} maintenance records`);

    // Create Reviews
    console.log('⭐ Creating reviews...');
    const reviews = await AppDataSource.getRepository(Review).save([
      {
        userId: users[1].id,
        vehicleId: vehicles[0].id,
        reservationId: reservations[0].id,
        rating: 5,
        comment:
          'Excellent car! Very comfortable and fuel efficient. Highly recommend!',
        verified: true,
      },
      {
        userId: users[2].id,
        vehicleId: vehicles[1].id,
        reservationId: reservations[1].id,
        rating: 4,
        comment: 'Great car, smooth ride. Had a minor issue but overall good experience.',
        verified: true,
      },
      {
        userId: users[1].id,
        vehicleId: vehicles[3].id,
        reservationId: undefined,
        rating: 5,
        comment:
          'Luxury at its finest! The Mercedes was in perfect condition.',
        verified: false,
      },
      {
        userId: users[3].id,
        vehicleId: vehicles[6].id,
        reservationId: undefined,
        rating: 5,
        comment:
          'The Mustang is a beast! Amazing driving experience. Will rent again!',
        verified: false,
      },
      {
        userId: users[4].id,
        vehicleId: vehicles[4].id,
        reservationId: reservations[3].id,
        rating: 4,
        comment: 'Beautiful Audi, great performance. A bit pricey but worth it.',
        verified: true,
      },
      {
        userId: users[2].id,
        vehicleId: vehicles[5].id,
        reservationId: undefined,
        rating: 3,
        comment: 'Decent car for the price. Good for city driving.',
        verified: false,
      },
      {
        userId: users[3].id,
        vehicleId: vehicles[7].id,
        reservationId: undefined,
        rating: 5,
        comment:
          'Tesla Model 3 is incredible! Silent, fast, and eco-friendly. Love it!',
        verified: false,
      },
    ]);
    console.log(`✅ Created ${reviews.length} reviews`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Vehicles: ${vehicles.length}`);
    console.log(`   - Reservations: ${reservations.length}`);
    console.log(`   - Payments: ${payments.length}`);
    console.log(`   - Maintenance: ${maintenances.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log('\n🔐 Default login credentials:');
    console.log('   Admin: admin@example.com / password123');
    console.log('   User: john.doe@example.com / password123');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seed();