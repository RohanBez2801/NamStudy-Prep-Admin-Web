import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ShieldAlert, LogOut } from 'lucide-react';

export default function AccessDenied() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-[var(--red)]" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-base text-[var(--text-secondary)]">
          You do not have the required permissions to access the Admin Console. 
          This area is restricted to Platform Administrators and School Administrators.
        </p>
        
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out & Return
          </button>
        </div>
      </div>
    </div>
  );
}

