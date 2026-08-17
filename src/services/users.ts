import { supabase } from '@/lib/supabase';
import { UserProfile, School } from '@/types/database';

export interface UsersResponse {
  users: UserProfile[];
  count: number;
}

export async function fetchUsers(
  isPlatformAdmin: boolean,
  schoolId?: string | null,
  page: number = 1,
  pageSize: number = 20,
  searchTerm: string = '',
  roleFilter: string = '',
  schoolFilter: string = ''
): Promise<UsersResponse> {
  let query = supabase
    .from('users')
    .select('id, name, email, role, is_admin, school_id, is_school_admin, created_at', { count: 'exact' });

  // Apply scopes
  if (!isPlatformAdmin && schoolId) {
    query = query.eq('school_id', schoolId);
  }

  // Apply filters
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
  }

  if (roleFilter) {
    if (roleFilter === 'admin') {
      query = query.eq('is_admin', true);
    } else {
      query = query.eq('role', roleFilter);
    }
  }

  if (schoolFilter && isPlatformAdmin) {
    query = query.eq('school_id', schoolFilter);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return {
    users: data as UserProfile[],
    count: count || 0,
  };
}

export async function fetchUserById(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }

  return data as UserProfile;
}

export async function fetchSchools(): Promise<School[]> {
  const { data, error } = await supabase
    .from('schools')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }

  return data as School[];
}

export async function setSchoolAdminAssignment(
  targetUserId: string,
  targetSchoolId: string | null,
  isSchoolAdmin: boolean
): Promise<void> {
  const { error } = await supabase.rpc('set_school_admin_assignment', {
    target_user_id: targetUserId,
    target_school_id: targetSchoolId,
    new_is_school_admin: isSchoolAdmin
  });

  if (error) {
    console.error('Error assigning school admin:', error);
    throw error;
  }
}
