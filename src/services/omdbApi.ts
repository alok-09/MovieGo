import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNGM4NTNlZjJlOWEzODMyOGVmYTVhMzNmNDQzMWVhNiIsIm5iZiI6MTY2NjU1Mjg2MC4wMDMsInN1YiI6IjYzNTU5NDFiODgwYzkyMDA3ZTcwYWFhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kKzYLHv_uw5jtP2CNkP4ftr5Miqt0y3BqOj0k435Pg8';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
  },
});

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieListItem {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  vote_average?: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieDetailsWithCredits extends MovieDetails {
  cast: CastMember[];
}

export const getPopularMovies = async () => {
  const [hollywood, bollywood, tollywood] = await Promise.all([
    api.get('/discover/movie', {
      params: {
        language: 'en-US',
        region: 'US',
        sort_by: 'popularity.desc',
        page: 1,
        'primary_release_date.gte': new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    }),
    api.get('/discover/movie', {
      params: {
        language: 'hi-IN',
        region: 'IN',
        with_original_language: 'hi',
        sort_by: 'popularity.desc',
        page: 1,
        'primary_release_date.gte': new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    }),
    api.get('/discover/movie', {
      params: {
        language: 'te-IN',
        region: 'IN',
        with_original_language: 'te',
        sort_by: 'popularity.desc',
        page: 1,
        'primary_release_date.gte': new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    }),
  ]);

  const hollywoodMovies = hollywood.data.results.slice(0, 7);
  const bollywoodMovies = bollywood.data.results.slice(0, 7);
  const tollywoodMovies = tollywood.data.results.slice(0, 6);

  const mixedMovies = [];
  const maxLength = Math.max(hollywoodMovies.length, bollywoodMovies.length, tollywoodMovies.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < hollywoodMovies.length) mixedMovies.push(hollywoodMovies[i]);
    if (i < bollywoodMovies.length) mixedMovies.push(bollywoodMovies[i]);
    if (i < tollywoodMovies.length) mixedMovies.push(tollywoodMovies[i]);
  }

  return { results: mixedMovies };
};

export const getNowPlayingMovies = async (page: number = 1): Promise<MovieListItem[]> => {
  const [hollywood, bollywood, tollywood] = await Promise.all([
    // 🎬 Hollywood
    api.get('/movie/now_playing', {
      params: {
        language: 'en-US',
        region: 'US',
        with_original_language: 'en',
        page,
      },
    }),

    // 🎥 Bollywood
    api.get('/movie/now_playing', {
      params: {
        language: 'en-US',
        region: 'IN',
        with_original_language: 'hi',
        page,
      },
    }),

    // 🎭 Tollywood
    api.get('/movie/now_playing', {
      params: {
        language: 'en-US',
        region: 'IN',
        with_original_language: 'te',
        page,
      },
    }),
  ]);

  // Combine all results
  const allMovies = [
    ...hollywood.data.results,
    ...bollywood.data.results,
    ...tollywood.data.results,
  ];

  // 🧹 Remove duplicates by movie ID
  const uniqueMoviesMap = new Map<number, Movie>();
  allMovies.forEach((movie: Movie) => {
    if (!uniqueMoviesMap.has(movie.id)) {
      uniqueMoviesMap.set(movie.id, movie);
    }
  });

  // Convert back to array
  const uniqueMovies = Array.from(uniqueMoviesMap.values());

  // 🎛 Interleave for variety
  const mixedMovies: Movie[] = [];
  const hollywoodMovies = hollywood.data.results;
  const bollywoodMovies = bollywood.data.results;
  const tollywoodMovies = tollywood.data.results;
  const maxLength = Math.max(
    hollywoodMovies.length,
    bollywoodMovies.length,
    tollywoodMovies.length
  );

  for (let i = 0; i < maxLength; i++) {
    if (i < hollywoodMovies.length && !mixedMovies.find(m => m.id === hollywoodMovies[i].id))
      mixedMovies.push(hollywoodMovies[i]);
    if (i < bollywoodMovies.length && !mixedMovies.find(m => m.id === bollywoodMovies[i].id))
      mixedMovies.push(bollywoodMovies[i]);
    if (i < tollywoodMovies.length && !mixedMovies.find(m => m.id === tollywoodMovies[i].id))
      mixedMovies.push(tollywoodMovies[i]);
  }

  // 🖼 Format for UI
  return uniqueMovies.map((movie: Movie) => ({
    imdbID: movie.id.toString(),
    Title: movie.title,
    Poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'N/A',
    Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
    vote_average: movie.vote_average,
  }));
};



export const getUpcomingMovies = async (page: number = 1) => {
  const response = await api.get('/movie/upcoming', {
    params: {
      language: 'en-US',
      page,
    },
  });
  return response.data;
};

export const getMovieCredits = async (id: number) => {
  const response = await api.get(`/movie/${id}/credits`);
  return response.data;
};

export const searchMovies = async (query: string): Promise<MovieListItem[]> => {
  const response = await api.get('/search/movie', {
    params: {
      query,
      language: 'en-US',
    },
  });

  const movies = response.data.results || [];
  return movies.map((movie: Movie) => ({
    imdbID: movie.id.toString(),
    Title: movie.title,
    Poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'N/A',
    Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
    vote_average: movie.vote_average,
  }));
};

export const getMovieById = async (id: number): Promise<MovieDetails> => {
  const response = await api.get(`/movie/${id}`, {
    params: {
      language: 'en-US',
    },
  });
  return response.data;
};

export const getMovieVideos = async (id: number) => {
  const response = await api.get(`/movie/${id}/videos`, {
    params: {
      language: 'en-US',
    },
  });
  return response.data;
};

export const getMovieDetailsWithCredits = async (id: number): Promise<MovieDetailsWithCredits> => {
  const [movieDetails, credits] = await Promise.all([
    getMovieById(id),
    getMovieCredits(id),
  ]);

  return {
    ...movieDetails,
    cast: credits.cast.slice(0, 20),
  };
};
