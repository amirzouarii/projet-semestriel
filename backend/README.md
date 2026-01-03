# 🚗 Vehicle Rental Management System

A comprehensive REST API for managing vehicle rentals built with NestJS, TypeScript, and PostgreSQL. Features include role-based access control, automated payment processing, vehicle reviews, and maintenance tracking.

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication & Authorization** - Secure login/register with role-based access (ADMIN/USER)
- 🚙 **Vehicle Management** - Full CRUD with search, filtering, and availability tracking
- 📅 **Reservation System** - Smart booking with conflict detection and auto-pricing
- 💰 **Payment Processing** - Cash payment tracking with status management
- ⭐ **Review System** - User ratings and verified reviews for vehicles
- 🔧 **Maintenance Tracking** - Service history and cost management

### Technical Features
- ✅ **Input Validation** - Comprehensive DTO validation with class-validator
- 📄 **Pagination** - Consistent pagination across all list endpoints
- 🔒 **RBAC** - Role-based access control with guard decorators
- 🛡️ **Security** - Password hashing, JWT tokens, SQL injection prevention
- 📊 **Database Relations** - Properly structured entities with cascade operations
- 🎯 **Type Safety** - Full TypeScript support throughout

## 🛠️ Tech Stack

- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** class-validator & class-transformer
- **Security:** bcrypt for password hashing
- **ORM:** TypeORM with decorators and query builder

## 📦 Database Entities

### User
- Authentication and profile management
- Roles: ADMIN | USER
- Relations: OneToMany(Reservations)

### Vehicules
- Vehicle inventory with specifications
- Fields: marque, modele, immatriculation (unique), etat, prixJour, image
- Relations: OneToMany(Reservations, Maintenances)

### Reservation
- Booking system with date ranges
- Status: PENDING | APPROVED | CANCELLED
- Auto-calculated totalPrice based on duration
- Relations: ManyToOne(User, Vehicules), OneToOne(Payment)

### Payment
- Payment tracking for reservations
- Method: CASH | CARD | BANK_TRANSFER
- Status: PENDING | COMPLETED | FAILED
- Relations: OneToOne(Reservation), ManyToOne(User)

### Maintenance
- Service history for vehicles
- Tracks description, date, cost
- Relations: ManyToOne(Vehicules)

### Review
- User reviews for vehicles
- Rating: 1-5 stars with optional comment
- Verified flag for admin approval
- Relations: ManyToOne(User, Vehicules, Reservation)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd projet-semestriel

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=admin
DATABASE_NAME=prj_voitures

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Server
PORT=3000
```

### Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE prj_voitures;
\q

# TypeORM will auto-sync tables on first run (synchronize: true in app.module.ts)
# For production, use migrations instead
```

## 🏃 Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production build and run
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

#### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and receive JWT token

#### Users
- `GET /users/me` - Get current user profile
- `GET /users` - [ADMIN] List all users with pagination

#### Vehicles
- `GET /vehicles` - List vehicles with filters (search, etat, price range)
- `GET /vehicles/:id` - Get vehicle details
- `POST /vehicles` - [ADMIN] Create vehicle
- `PATCH /vehicles/:id` - [ADMIN] Update vehicle
- `DELETE /vehicles/:id` - [ADMIN] Delete vehicle

#### Reservations
- `POST /reservations` - Create reservation (auto-calculates price)
- `GET /reservations` - List reservations (users see only theirs)
- `PATCH /reservations/:id/status` - [ADMIN] Update status
- `PATCH /reservations/:id/cancel` - Cancel reservation

#### Payments
- `POST /payments` - Create payment for reservation
- `GET /payments` - List payments with filters
- `PATCH /payments/:id/complete` - Mark payment as completed
- `PATCH /payments/:id/fail` - Mark payment as failed

#### Reviews
- `POST /reviews` - Create review for vehicle
- `GET /reviews` - List reviews with filters
- `GET /reviews/vehicle/:id/average` - Get average rating
- `PATCH /reviews/:id` - Update own review
- `PATCH /reviews/:id/verify` - [ADMIN] Verify review

#### Maintenance
- `POST /maintenance` - [ADMIN] Create maintenance record
- `GET /maintenance` - [ADMIN] List maintenance records
- `PATCH /maintenance/:id` - [ADMIN] Update maintenance
- `DELETE /maintenance/:id` - [ADMIN] Delete maintenance

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example Requests

**Register a new user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure123"
  }'
```

**Create a reservation:**
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": 1,
    "startDate": "2026-01-15T08:00:00Z",
    "endDate": "2026-01-20T18:00:00Z"
  }'
```

**Search vehicles:**
```bash
curl "http://localhost:3000/vehicles?page=1&limit=10&search=Toyota&minPrice=30&maxPrice=100"
```

## 📁 Project Structure

```
src/
├── auth/               # Authentication module (login, register, JWT)
├── user/               # User management (profile, list)
├── voiture/            # Vehicle CRUD with search/filters
├── reservation/        # Booking system with conflict detection
├── payment/            # Payment processing and tracking
├── review/             # Review and rating system
├── maintenance/        # Vehicle maintenance records
├── common/
│   ├── guard/          # RolesGuard & decorators for RBAC
│   ├── hashing/        # bcrypt password hashing service
│   ├── jwt-service/    # JWT token generation/verification
│   ├── dto/            # Shared DTOs (pagination)
│   ├── types/          # TypeScript types and interfaces
│   └── utils/          # Utility functions and constants
├── entities/           # TypeORM entities (database models)
├── app.module.ts       # Root module with global configuration
└── main.ts             # Application entry point with ValidationPipe
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT-based authentication with role claims
- ✅ Role-based authorization on endpoints
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (TypeORM parameterized queries)
- ✅ Rate limiting ready (add middleware as needed)
- ✅ CORS configuration ready (configure in main.ts)

## 🎯 Key Business Logic

### Reservation System
- Automatic price calculation: `(endDate - startDate) × vehicleDailyRate`
- Conflict detection: Prevents double-booking of vehicles
- Status workflow: PENDING → APPROVED (on payment) → CANCELLED

### Payment Processing
- Amount validation against reservation total
- Auto-approval of reservation when payment completed
- Multiple payment methods supported (CASH, CARD, BANK_TRANSFER)

### Review System
- One review per user per vehicle (prevents spam)
- Admin verification system for trusted reviews
- Average rating calculation per vehicle
- Optional linking to completed reservations

### Access Control
| Feature | USER | ADMIN |
|---------|------|-------|
| View vehicles | ✅ | ✅ |
| Create reservation | ✅ (own) | ✅ (any user) |
| View reservations | ✅ (own) | ✅ (all) |
| Approve reservations | ❌ | ✅ |
| Manage vehicles | ❌ | ✅ |
| Manage maintenance | ❌ | ✅ |
| Create payments | ✅ (own) | ✅ (any) |
| Create reviews | ✅ | ✅ |
| Verify reviews | ❌ | ✅ |

## 🚀 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `synchronize: false` in TypeORM config
- [ ] Set up database migrations
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Add rate limiting middleware
- [ ] Set up logging and monitoring
- [ ] Configure environment variables properly
- [ ] Set up automated backups for PostgreSQL
- [ ] Add health check endpoint

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_HOST=<your-db-host>
DATABASE_PORT=5432
DATABASE_USER=<your-db-user>
DATABASE_PASSWORD=<strong-password>
DATABASE_NAME=prj_voitures
JWT_SECRET=<strong-random-secret>
PORT=3000
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database ORM: [TypeORM](https://typeorm.io/)
- Validation: [class-validator](https://github.com/typestack/class-validator)

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Made with ❤️ using NestJS and TypeScript**
