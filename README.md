<div align="center">

# 🎬 BookMyRadiant

### Modern Cinema Booking Platform

A full-stack cinema booking application built with React, TypeScript, Express.js, and MongoDB. Browse movies, select seats, and book your favorite shows seamlessly.

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) | [Report Bug](https://github.com/deeptimaan-k/BookMyRadiant/issues) | [Request Feature](https://github.com/deeptimaan-k/BookMyRadiant/issues)

</div>

---

## ✨ Features

### 🎭 For Movie Lovers
- **Browse Movies**: Explore a wide range of movies with detailed information from themoviedb API
- **Interactive Seat Selection**: Visual seat map with real-time availability
- **Multiple Cinemas**: Choose from various cinema locations
- **Flexible Showtimes**: Browse and select from multiple show timings
- **Booking Management**: View, track, and cancel your bookings
- **User Profiles**: Manage your personal information and preferences

### 👨‍💼 For Administrators
- **Cinema Management**: Add, edit, and manage cinema locations
- **Showtime Scheduling**: Create and manage movie showtimes
- **Seat Layout Control**: Configure seat arrangements for different screens
- **Booking Overview**: Monitor all bookings and system activity

### 🚀 Technical Highlights
- **Modern Tech Stack**: React 18 with TypeScript for type-safe development
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Instant seat availability updates
- **State Management**: Zustand for efficient global state
- **API Integration**: Seamless integration with themoviedb API
- **Secure Authentication**: JWT-based user authentication
- **Database**: MongoDB for flexible data storage

---

## 📸 Screenshots

<div align="center">

### Home Page
Browse featured movies and popular cinemas

### Seat Selection
Interactive seat selection with live availability

### My Bookings
Manage all your cinema bookings in one place

</div>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | Modern UI library with hooks |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Lightning-fast build tool |
| **TailwindCSS** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **Zustand** | Lightweight state management |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Beautiful icon library |
| **React Hot Toast** | Elegant notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | Secure authentication |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin resource sharing |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **themoviedb API Key** (optional) - [Get your key](http://www.themoviedbapi.com/apikey.aspx)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/deeptimaan-k/BookMyRadiant.git
cd BookMyRadiant
```

#### 2️⃣ Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
# The .env file should contain:
# MONGODB_URI=your_mongodb_connection_string
# PORT=5000
# NODE_ENV=development
# JWT_SECRET=your_jwt_secret_key

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on **http://localhost:5000**

#### 3️⃣ Setup Frontend

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:5173**

---

## 📁 Project Structure

```
BookMyRadiant/
├── 📂 backend/                 # Backend application
│   ├── 📂 src/
│   │   ├── 📂 config/         # Database configuration
│   │   ├── 📂 controllers/    # Route controllers
│   │   ├── 📂 models/         # MongoDB models
│   │   ├── 📂 routes/         # API routes
│   │   ├── server.js          # Express server
│   │   ├── seed.js            # Database seeder
│   │   └── makeAdmin.js       # Admin user utility
│   ├── package.json
│   └── .env                   # Environment variables
│
├── 📂 src/                     # Frontend application
│   ├── 📂 components/         # Reusable components
│   │   ├── Header.tsx
│   │   ├── MovieCard.tsx
│   │   ├── SeatGrid.tsx
│   │   └── ...
│   ├── 📂 pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── CinemaPage.tsx
│   │   ├── MovieDetailsPage.tsx
│   │   ├── SeatSelectionPage.tsx
│   │   └── ...
│   ├── 📂 services/           # API services
│   │   ├── api.ts
│   │   └── themoviedbApi.ts
│   ├── 📂 store/              # State management
│   │   ├── userStore.ts
│   │   └── bookingStore.ts
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cinema-booking
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_jwt_secret_key_here
```

### Frontend Environment Variables

Create a `.env` file in the root directory (if using themoviedb API):

```env
VITE_themoviedb_API_KEY=your_themoviedb_api_key
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Cinema Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cinemas` | Get all cinemas |
| GET | `/api/cinemas/:id` | Get cinema by ID |
| POST | `/api/cinemas` | Create cinema (Admin) |
| PUT | `/api/cinemas/:id` | Update cinema (Admin) |
| DELETE | `/api/cinemas/:id` | Delete cinema (Admin) |

### Showtime Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/showtimes/cinema/:cinemaId` | Get all showtimes for cinema |
| GET | `/api/showtimes/cinema/:cinemaId/movie/:imdbID` | Get movie showtimes |
| POST | `/api/showtimes` | Create showtime (Admin) |
| PUT | `/api/showtimes/:id` | Update showtime (Admin) |
| DELETE | `/api/showtimes/:id` | Delete showtime (Admin) |

### Booking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/user/:userId` | Get user bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |

---

## 👨‍💼 Admin Access

To grant admin privileges to a user:

```bash
cd backend
node src/makeAdmin.js user@example.com
```

This will allow the user to access the admin panel and manage cinemas and showtimes.

---

## 🎯 Key Features Breakdown

### Seat Selection System
- Visual representation of cinema seats
- Real-time seat availability
- Multiple seat selection
- Price calculation based on selected seats

### Booking Management
- View all past and upcoming bookings
- Cancel bookings (with confirmation)
- Booking details with QR code
- Email notifications (optional feature)

### Movie Integration
- Integration with themoviedb API for movie data
- Movie posters, ratings, and descriptions
- Search functionality
- Genre filtering

### Admin Dashboard
- Cinema CRUD operations
- Showtime management
- Seat layout customization
- Booking overview and analytics

---

## 🚢 Deployment

### Backend Deployment

**Recommended Platforms:**

1. **Railway** (Easiest)
   - Connect your GitHub repository
   - Add MongoDB connection string
   - Deploy with one click

2. **Render**
   - Create new Web Service
   - Connect repository
   - Add environment variables

3. **Heroku**
   - Install Heroku CLI
   - Create new app
   - Push to Heroku

### Frontend Deployment

**Recommended Platforms:**

1. **Vercel** (Recommended)
   ```bash
   npm run build
   vercel --prod
   ```

2. **Netlify**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **GitHub Pages**
   - Configure base URL in vite.config.ts
   - Build and deploy to gh-pages branch

---

## 🧪 Development Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript types
```

### Backend Scripts

```bash
npm start            # Start production server
npm run dev          # Start development server with auto-reload
npm run seed         # Seed database with sample data
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues

- themoviedb API has rate limits on free tier
- Seat selection may need refresh after network interruption
- Admin panel requires manual user promotion via script

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications for bookings
- [ ] Movie reviews and ratings
- [ ] Social authentication (Google, Facebook)
- [ ] Mobile app (React Native)
- [ ] Advanced seat selection (premium seats, couple seats)
- [ ] Food and beverage ordering
- [ ] Loyalty points system
- [ ] Multi-language support

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Deeptimaan K**

- GitHub: [@deeptimaan-k](https://github.com/deeptimaan-k)
- Project Link: [https://github.com/deeptimaan-k/BookMyRadiant](https://github.com/deeptimaan-k/BookMyRadiant)

---

## 🙏 Acknowledgments

- [themoviedb API](http://www.themoviedbapi.com/) for movie data
- [Pexels](https://www.pexels.com/) for stock images
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [TailwindCSS](https://tailwindcss.com/) for styling utilities
- All contributors and supporters of this project

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by Deeptimaan K

</div>
