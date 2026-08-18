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
    <div className="auth-page">
      <div className="auth-panel">
        <div style={{ textAlign: 'center' }}>
          <ShieldAlert className="nav-icon" style={{ width: 64, height: 64, color: 'var(--red)' }} />
          <h2 className="auth-title">Access Denied</h2>
          <p className="auth-subtitle">You do not have the required permissions to access the Admin Console. This area is restricted to Platform Administrators and School Administrators.</p>

          <div style={{ marginTop: 20 }}>
            <button onClick={handleLogout} className="primary-button">
              <LogOut style={{ width: 16, height: 16 }} />
              <span style={{ marginLeft: 8 }}>Sign Out & Return</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
