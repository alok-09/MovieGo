import { useNavigate } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Movie } from '../services/omdbApi';

interface MovieCarouselProps {
  movies: Movie[];
}

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  const navigate = useNavigate();

  if (movies.length === 0) return null;

  return (
    <div className="flex overflow-x-auto pb-4 gap-4 sm:gap-6 scrollbar-hide snap-x snap-mandatory">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/300x450?text=No+Poster';

        return (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex-shrink-0 w-48 sm:w-56 md:w-64 snap-start cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-500 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-amber-500 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-white text-white" />
                      <span className="text-white font-bold text-xs">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-white text-xs font-medium">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-amber-600 transition-colors">
                {movie.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Coming Soon'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
