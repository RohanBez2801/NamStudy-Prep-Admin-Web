import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchDashboardStats } from '@/services/statistics';
import { DashboardStats } from '@/types/database';
import StatCard from '@/components/StatCard';
import { 
  Users, GraduationCap, Presentation, School, 
  FileText, HelpCircle, Clock, DollarSign,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { profile, isAdmin, isSchoolAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats(isAdmin, profile?.school_id);
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAdmin, profile?.school_id]);

  if (loading) {
    return (
      <div className="flex" style={{ minHeight: 220, alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" style={{ width: 48, height: 48, borderRadius: 24, borderTop: '4px solid var(--primary)', borderRight: '4px solid transparent', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-error"><AlertCircle style={{ verticalAlign: 'middle', marginRight: 8 }} />{error}</div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <h2>{isAdmin ? 'Platform Overview' : 'School Overview'}</h2>
      </div>

      {isAdmin && stats && (
        <div className="stat-grid">
          <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} colorClass="stat-color-slate" />
          <StatCard title="Students" value={stats.students.toLocaleString()} icon={GraduationCap} colorClass="stat-color-purple" />
          <StatCard title="Teachers" value={stats.teachers.toLocaleString()} icon={Presentation} colorClass="stat-color-blue" />
          <StatCard title="Registered Schools" value={stats.schools.toLocaleString()} icon={School} colorClass="stat-color-indigo" />
          <StatCard title="Papers" value={stats.papers.toLocaleString()} icon={FileText} colorClass="stat-color-green" />
          <StatCard title="Quiz Questions" value={stats.quizzes.toLocaleString()} icon={HelpCircle} colorClass="stat-color-yellow" />
          <StatCard title="Pending Payments" value={stats.pendingPayments.toLocaleString()} icon={Clock} colorClass="stat-color-orange" />
          <StatCard title="Approved Revenue" value={`N$ ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} colorClass="stat-color-green" />
        </div>
      )}

      {isSchoolAdmin && !isAdmin && stats && (
        <div className="stat-grid">
          <StatCard title="Total Users (School)" value={stats.totalUsers.toLocaleString()} icon={Users} colorClass="stat-color-slate" />
          <StatCard title="Students (School)" value={stats.students.toLocaleString()} icon={GraduationCap} colorClass="stat-color-purple" />
          <StatCard title="Teachers (School)" value={stats.teachers.toLocaleString()} icon={Presentation} colorClass="stat-color-blue" />
        </div>
      )}
    </div>
  );
}

/* local spin keyframes */
