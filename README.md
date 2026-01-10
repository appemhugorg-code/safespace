# 🧠 SafeSpace - Mental Health Management Platform

SafeSpace is a comprehensive mental health management platform designed to support children, parents/guardians, and therapists in tracking emotional wellbeing, managing therapy appointments, and maintaining secure communication under administrative oversight.

## 🌟 What is SafeSpace?

SafeSpace provides a safe, supportive digital environment where:

- **Children** can track their daily moods, play therapeutic games, and access help when needed
- **Parents/Guardians** can monitor their children's emotional progress and communicate with therapists
- **Therapists** can manage their young clients, track progress, and provide ongoing support
- **Administrators** can oversee the platform, approve users, and ensure safety standards

## ✨ Key Features

### 🔐 **Role-Based Access Control**
- Four distinct user roles with appropriate permissions
- Admin approval workflow for new users
- Secure child account creation and management

### 😊 **Mood Tracking System**
- Child-friendly mood selector with emojis
- Visual mood history and trend analytics
- Streak tracking and positive reinforcement
- Guardian and therapist monitoring capabilities

### 📅 **Appointment Management**
- Therapist-child appointment scheduling
- Guardian approval workflow
- Calendar integration with available time slots
- Video meeting integration (Google Meet ready)

### 💬 **Secure Communication**
- Real-time messaging between all user types
- Role-based contact restrictions
- Content moderation and flagging system
- Emergency alert capabilities

### 🎮 **Educational Content**
- Age-appropriate mental health games
- Therapeutic activities and exercises
- Achievement system with badges
- Progress tracking for therapists

### 🚨 **Emergency Features**
- Panic button for children in crisis
- Immediate alert system for guardians and therapists
- Crisis resources and contact information
- Safety monitoring and incident logging

### 📊 **Analytics & Reporting**
- Mood trend analysis and insights
- Progress tracking and reports
- System usage analytics
- Engagement metrics

## 🛠️ Technology Stack

- **Backend**: Laravel 12 (PHP 8.3)
- **Frontend**: React 18 with TypeScript
- **UI Framework**: ShadCN UI + TailwindCSS
- **Database**: SQLite (development) / PostgreSQL (production)
- **Real-time**: Laravel Reverb (WebSockets)
- **Authentication**: Laravel Sanctum
- **Authorization**: Spatie Laravel Permission
- **Build Tool**: Vite (with HMR support)

## 🚀 Quick Start

### Prerequisites

- PHP 8.3+
- Node.js 18+
- Composer
- SQLite (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safespace
   ```

2. **Install dependencies**
   ```bash
   # Install PHP dependencies
   composer install
   
   # Install Node.js dependencies
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Generate application key
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   # Create SQLite database (if not exists)
   touch database/database.sqlite
   
   # Run migrations and seed data
   php artisan migrate:fresh --seed
   ```

5. **Build frontend assets**
   ```bash
   npm run build
   ```

### Running the Application

#### Development Mode (with Hot Module Replacement)

1. **Start the Laravel server**
   ```bash
   php artisan serve
   ```

2. **Start Laravel Reverb (for real-time features)**
   ```bash
   php artisan reverb:start
   ```

3. **Start Vite development server (in another terminal)**
   ```bash
   npm run dev
   ```

The application will be available at:
- **Main App**: http://localhost:8000
- **Vite Dev Server**: http://localhost:5173 (for HMR)
- **Reverb WebSocket**: http://localhost:8080

#### Production Mode

```bash
# Build production assets
npm run build

# Start Laravel server
php artisan serve

# Start Reverb server
php artisan reverb:start
```

## 👥 Default Test Users

After running the seeders, you can login with these test accounts (password: `password`):

| Role | Email | Access Level |
|------|-------|--------------|
| **Admin** | admin@safespace.test | Full system access |
| **Therapist** | therapist@safespace.test | Client management |
| **Guardian** | guardian@safespace.test | Child monitoring |
| **Child** | child@safespace.test | Mood tracking & games |

## 🎯 User Workflows

### Guardian Journey
1. Register as Guardian → Wait for admin approval
2. Create child accounts → Wait for admin approval  
3. Monitor child mood data and progress
4. Request therapy appointments
5. Communicate securely with therapists

### Therapist Journey
1. Register as Therapist → Wait for admin approval
2. View assigned children and their progress
3. Manage appointment requests and scheduling
4. Monitor mood trends and provide insights
5. Conduct secure messaging with families

### Child Journey
1. Log daily mood using emoji selector
2. View personal mood history and streaks
3. Play therapeutic games and activities
4. Communicate with therapists and guardians
5. Access emergency help when needed

### Admin Journey
1. Review and approve user registrations
2. Monitor system usage and flagged content
3. Manage user accounts and permissions
4. View system-wide analytics and reports

## 📁 Project Structure

```
safespace/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # API and web controllers
│   ├── Models/            # Eloquent models
│   ├── Policies/          # Authorization policies
│   └── Services/          # Business logic services
├── database/
│   ├── migrations/        # Database schema migrations
│   ├── seeders/          # Database seeders
│   └── database.sqlite   # SQLite database (local)
├── resources/
│   ├── js/               # React frontend code
│   │   ├── Components/   # Reusable UI components
│   │   ├── Pages/        # Page components (Inertia.js)
│   │   └── Types/        # TypeScript type definitions
│   └── css/              # Stylesheets
├── routes/
│   ├── web.php           # Web routes
│   └── api.php           # API routes
├── docker/               # Docker configuration
├── docs/                 # Project documentation
└── public/               # Public assets
```

## 🔧 Development Commands

```bash
# Frontend development
npm run dev              # Start Vite dev server with HMR
npm run build           # Build production assets
npm run lint            # Run ESLint
npm run format          # Format code with Prettier

# Backend development
php artisan serve       # Start Laravel development server
php artisan migrate     # Run database migrations
php artisan db:seed     # Seed database with test data
php artisan queue:work  # Process background jobs
php artisan reverb:start # Start WebSocket server

# Testing
php artisan test        # Run PHP tests
npm run test           # Run frontend tests (if configured)

# Cache management
php artisan cache:clear    # Clear application cache
php artisan config:clear   # Clear configuration cache
php artisan route:clear    # Clear route cache
php artisan view:clear     # Clear compiled views
```

## 🐳 Docker Development

For a containerized development environment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access application container
docker-compose exec safespace-app bash

# Stop services
docker-compose down
```

## 🔒 Security Features

- **Authentication**: Secure login with Laravel Sanctum
- **Authorization**: Role-based permissions with Spatie
- **Input Validation**: Comprehensive request validation
- **CSRF Protection**: Built-in Laravel CSRF protection
- **Content Moderation**: Message flagging and admin review
- **Emergency Protocols**: Panic button and crisis intervention
- **Data Privacy**: Secure handling of sensitive mental health data

## 🎨 Design System

SafeSpace uses a calming, child-friendly design system:

- **Colors**: Soft blues, greens, and purples
- **Typography**: Clean, readable fonts (Inter, Poppins)
- **Components**: ShadCN UI for consistent, accessible components
- **Responsive**: Mobile-first design for all devices
- **Accessibility**: WCAG 2.1 AA compliant

## 📚 API Documentation

The application provides RESTful APIs for:

- **Authentication**: `/api/auth/*`
- **User Management**: `/api/users/*`
- **Mood Tracking**: `/api/mood-logs/*`
- **Appointments**: `/api/appointments/*`
- **Messaging**: `/api/messages/*`
- **Emergency**: `/api/panic-alerts/*`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [documentation](docs/)
2. Review existing [issues](../../issues)
3. Create a new issue if needed

## 🙏 Acknowledgments

SafeSpace is built with care to support mental health awareness and provide a safe digital space for children and families seeking therapeutic support.

---

**Made with ❤️ for mental health awareness and child wellbeing**
