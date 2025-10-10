import { X } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerKey: string;
  movieTitle: string;
}

export default function TrailerModal({ isOpen, onClose, trailerKey, movieTitle }: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-800">
          <h2 className="text-xl font-bold text-white">{movieTitle} - Trailer</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title={`${movieTitle} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
