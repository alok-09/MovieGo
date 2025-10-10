import { X, AlertTriangle, Check, Film } from 'lucide-react';
import { useEffect } from 'react';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  movieTitle: string;
  seats: string[];
}

export default function CancelConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  movieTitle,
  seats,
}: CancelConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{
          opacity: isOpen ? 0.7 : 0,
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      ></div>

      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 overflow-hidden"
        style={{
          animation: isOpen ? 'modalSlideIn 0.3s ease-out' : 'none',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors duration-200 hover:rotate-90 transform z-10"
          style={{ transition: 'all 0.3s' }}
        >
          <X className="w-7 h-7" />
        </button>

        <div className="p-8 pt-10">
          <div className="relative mb-6">
            <div
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
              style={{
                animation: 'iconPulse 2s ease-in-out infinite',
              }}
            >
              <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500 to-orange-500 opacity-20 animate-ping"></div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Cancel Booking?
          </h2>

          <p className="text-gray-500 text-center mb-6 text-base">
            You're about to cancel your reservation
          </p>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl p-5 mb-6 border-2 border-amber-200 shadow-inner">
            <div className="flex items-center justify-center mb-3">
              <Film className="w-5 h-5 text-amber-600 mr-2" />
              <h3 className="font-bold text-gray-900 text-lg text-center">
                {movieTitle}
              </h3>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200">
              <p className="text-sm text-gray-700 text-center">
                Seats: <span className="font-bold text-amber-700 text-base">{seats.join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-8 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700 font-semibold">
              This action cannot be undone
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <X className="w-5 h-5" />
              Keep Booking
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-br from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 35px rgba(239, 68, 68, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
