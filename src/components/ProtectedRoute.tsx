
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    }
  }, [loading, user, toast]);

  // If still loading auth state, show a spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login page with the return URL
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render children
  return <Outlet />;
};
