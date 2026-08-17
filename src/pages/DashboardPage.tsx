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
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700">
        <AlertCircle className="h-5 w-5 mr-3" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          {isAdmin ? 'Platform Overview' : 'School Overview'}
        </h2>
      </div>

      {isAdmin && stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers.toLocaleString()} 
            icon={Users} 
            colorClass="bg-slate-100 text-slate-600" 
          />
          <StatCard 
            title="Students" 
            value={stats.students.toLocaleString()} 
            icon={GraduationCap} 
            colorClass="bg-purple-100 text-purple-600" 
          />
          <StatCard 
            title="Teachers" 
            value={stats.teachers.toLocaleString()} 
            icon={Presentation} 
            colorClass="bg-blue-100 text-blue-600" 
          />
          <StatCard 
            title="Registered Schools" 
            value={stats.schools.toLocaleString()} 
            icon={School} 
            colorClass="bg-indigo-100 text-indigo-600" 
          />
          <StatCard 
            title="Papers" 
            value={stats.papers.toLocaleString()} 
            icon={FileText} 
            colorClass="bg-green-100 text-green-600" 
          />
          <StatCard 
            title="Quiz Questions" 
            value={stats.quizzes.toLocaleString()} 
            icon={HelpCircle} 
            colorClass="bg-yellow-100 text-yellow-600" 
          />
          <StatCard 
            title="Pending Payments" 
            value={stats.pendingPayments.toLocaleString()} 
            icon={Clock} 
            colorClass="bg-orange-100 text-orange-600" 
          />
          <StatCard 
            title="Approved Revenue" 
            value={`N$ ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            icon={DollarSign} 
            colorClass="bg-emerald-100 text-emerald-600" 
          />
        </div>
      )}

      {isSchoolAdmin && !isAdmin && stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total Users (School)" 
            value={stats.totalUsers.toLocaleString()} 
            icon={Users} 
            colorClass="bg-slate-100 text-slate-600" 
          />
          <StatCard 
            title="Students (School)" 
            value={stats.students.toLocaleString()} 
            icon={GraduationCap} 
            colorClass="bg-purple-100 text-purple-600" 
          />
          <StatCard 
            title="Teachers (School)" 
            value={stats.teachers.toLocaleString()} 
            icon={Presentation} 
            colorClass="bg-blue-100 text-blue-600" 
          />
        </div>
      )}
    </div>
  );
}

