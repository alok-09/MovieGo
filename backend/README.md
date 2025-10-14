# Cinema Booking Backend

Express.js + MongoDB backend for the Cinema Booking application.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure MongoDB

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Get your connection string

### 3. Environment Variables

The `.env` file is already configured in the backend directory with MongoDB Atlas connection.

### 4. Seed the Database

Before running the server, seed the database with initial data:

```bash
npm run seed
```

This will populate the database with:
- 4 cinemas (PVR Phoenix, INOX Nehru Place, Cinepolis RCube, PVR Pavilion)
- 400 showtimes across multiple dates and times for popular movies

### 5. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:5000

### 6. Grant Admin Access

To make a user an admin:

```bash
node src/makeAdmin.js user@example.com
```

This will grant admin privileges to the user with the specified email address.

## API Endpoints

### Cinemas

- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/:id` - Get cinema by ID
- `POST /api/cinemas` - Create new cinema
- `PUT /api/cinemas/:id` - Update cinema
- `DELETE /api/cinemas/:id` - Delete cinema
- `POST /api/cinemas/seed` - Seed sample cinemas

### Showtimes

- `GET /api/showtimes/cinema/:cinemaId/movie/:imdbID` - Get showtimes for a specific movie at a cinema
- `GET /api/showtimes/cinema/:cinemaId` - Get all showtimes for a cinema
- `POST /api/showtimes` - Create new showtime
- `PUT /api/showtimes/:id` - Update showtime
- `DELETE /api/showtimes/:id` - Delete showtime
- `POST /api/showtimes/seed` - Seed sample showtimes

### Bookings

- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - Get all bookings for a user
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/cancel` - Cancel a booking

## Data Structure

The backend uses a flexible structure where:

- **Cinemas** store basic cinema information (name, location, rating, etc.)
- **Showtimes** are stored separately and reference both cinema ID and movie IMDB ID
- **Movies** are fetched from OMDB API on the frontend
- This allows any movie from OMDB to be shown at any cinema without pre-defining movies in the database

## Deployment

This backend needs to be deployed separately on platforms like:

- **Railway**: https://railway.app/
- **Render**: https://render.com/
- **Heroku**: https://heroku.com/
- **Vercel**: https://vercel.com/ (with limitations)
- **DigitalOcean**: https://www.digitalocean.com/

## Connect Frontend

The frontend is already configured to use the backend API URL through Vite proxy configuration:

- **Development**: API calls to `/api` are proxied to `http://localhost:5000`
- **Production**: Update `VITE_API_BASE_URL` environment variable

Make sure the backend server is running before starting the frontend development server.
