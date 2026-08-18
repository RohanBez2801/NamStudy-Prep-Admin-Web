import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div className="flex items-center">
        {/* Placeholder for breadcrumbs or page title if needed */}
        <h1 className="text-xl font-semibold text-slate-800">NamibStudy Prep Admin</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-none">{profile?.name}</p>
            <p className="text-xs text-slate-500 mt-1 leading-none">{profile?.email}</p>
          </div>
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Avatar"
              loading="lazy"
              className="h-9 w-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {profile?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        
        <button
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-slate-100 flex items-center"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Sign out</span>
        </button>
      </div>
    </header>
  );
}

