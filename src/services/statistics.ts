import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/database';

export async function fetchDashboardStats(isPlatformAdmin: boolean, schoolId?: string | null): Promise<DashboardStats> {
  const stats: DashboardStats = {
    totalUsers: 0,
    students: 0,
    teachers: 0,
    schools: 0,
    papers: 0,
    quizzes: 0,
    pendingPayments: 0,
    revenue: 0,
  };

  try {
    if (isPlatformAdmin) {
      // Platform Admin: Query all data
      const [usersRes, papersRes, quizzesRes, schoolsRes, paymentsRes] = await Promise.all([
        supabase.from('users').select('role, is_admin'),
        supabase.from('papers').select('id', { count: 'exact' }),
        supabase.from('quizzes').select('id', { count: 'exact' }),
        supabase.from('schools').select('id', { count: 'exact' }),
        supabase.from('payments').select('amount, status'),
      ]);

      if (usersRes.data) {
        stats.totalUsers = usersRes.data.length;
        stats.students = usersRes.data.filter(u => u.role === 'student' || (!u.role && !u.is_admin)).length;
        stats.teachers = usersRes.data.filter(u => u.role === 'teacher').length;
      }
      
      stats.papers = papersRes.count || 0;
      stats.quizzes = quizzesRes.count || 0;
      stats.schools = schoolsRes.count || 0;

      if (paymentsRes.data) {
        stats.pendingPayments = paymentsRes.data.filter(p => p.status === 'pending').length;
        stats.revenue = paymentsRes.data
          .filter(p => p.status === 'approved')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
      }
    } else if (schoolId) {
      // School Admin: Only fetch school-scoped metrics
      // Papers, Quizzes, Payments are national only. 
      // Only students/teachers in their school are relevant.
      const usersRes = await supabase.from('users').select('role, is_admin').eq('school_id', schoolId);
      
      if (usersRes.data) {
        stats.totalUsers = usersRes.data.length;
        stats.students = usersRes.data.filter(u => u.role === 'student' || (!u.role && !u.is_admin)).length;
        stats.teachers = usersRes.data.filter(u => u.role === 'teacher').length;
      }
      stats.schools = 1; // Own school
    }
    
    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
