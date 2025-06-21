import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAccess = () => {
      const token = localStorage.getItem('sharaein_token');
      const roomData = localStorage.getItem('sharaein_room');

      if (!token || !roomData) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      try {
        const room = JSON.parse(roomData);
        if (room.id === roomId) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      }

      setIsValidating(false);
    };

    validateAccess();
  }, [roomId]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};