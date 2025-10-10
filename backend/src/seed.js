import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Cinema from './models/Cinema.js';
import Showtime from './models/Showtime.js';

dotenv.config();

const cinemas = [
  {
    name: 'PVR Phoenix',
    location: 'High Street Phoenix, Lower Parel, Mumbai',
    distance: '2.5 km',
    rating: 4.5,
    totalSeats: 100
  },
  {
    name: 'INOX Nehru Place',
    location: 'Nehru Place, South Delhi',
    distance: '3.2 km',
    rating: 4.3,
    totalSeats: 100
  },
  {
    name: 'Cinepolis RCube',
    location: 'Rajaji Nagar, Bangalore',
    distance: '1.8 km',
    rating: 4.7,
    totalSeats: 100
  },
  {
    name: 'PVR Pavilion',
    location: 'Shivaji Nagar, Pune',
    distance: '4.1 km',
    rating: 4.4,
    totalSeats: 100
  }
];

const showtimes = ['11:00 AM', '2:00 PM', '6:30 PM', '9:45 PM'];

const generateDates = (numDays = 7) => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const fetchNowPlayingMovies = async () => {
  try {
    const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNGM4NTNlZjJlOWEzODMyOGVmYTVhMzNmNDQzMWVhNiIsIm5iZiI6MTY2NjU1Mjg2MC4wMDMsInN1YiI6IjYzNTU5NDFiODgwYzkyMDA3ZTcwYWFhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kKzYLHv_uw5jtP2CNkP4ftr5Miqt0y3BqOj0k435Pg8';

    const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_TOKEN}`,
      },
      params: {
        language: 'en-US',
        page: 1,
      },
    });

    return response.data.results.map(movie => movie.id.toString());
  } catch (error) {
    console.error('Failed to fetch movies from TMDB:', error.message);
    console.log('Using fallback movie list');
    return [
      '278', '238', '240', '424', '389', '129', '19404', '372058',
      '278927', '122', '13', '769', '550', '155', '497', '680',
      '429', '346', '637', '539'
    ];
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await Cinema.deleteMany({});
    await Showtime.deleteMany({});
    console.log('Cleared existing data');

    const createdCinemas = await Cinema.insertMany(cinemas);
    console.log(`Created ${createdCinemas.length} cinemas`);

    console.log('Fetching now playing movies from TMDB...');
    const movieIds = await fetchNowPlayingMovies();
    console.log(`Found ${movieIds.length} movies`);

    const dates = generateDates(7);

    const showtimeData = [];
    for (const cinema of createdCinemas) {
      for (const date of dates) {
        for (const movieId of movieIds) {
          for (const time of showtimes) {
            showtimeData.push({
              cinemaId: cinema._id,
              imdbID: movieId,
              movieId: movieId,
              date,
              time,
              price: 200 + Math.floor(Math.random() * 100),
              totalSeats: 100,
              availableSeats: 100
            });
          }
        }
      }
    }

    await Showtime.insertMany(showtimeData);
    console.log(`Created ${showtimeData.length} showtimes`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
