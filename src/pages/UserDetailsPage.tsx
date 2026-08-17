import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserById, fetchSchools, setSchoolAdminAssignment } from '@/services/users';
import { UserProfile, School } from '@/types/database';
import { 
  ArrowLeft, UserCircle, Shield, GraduationCap, 
  Presentation, AlertCircle, Building, Calendar,
  CheckCircle, Loader2
} from 'lucide-react';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mutation states
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [isSchoolAdmin, setIsSchoolAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [userData, schoolsData] = await Promise.all([
          fetchUserById(id),
          isAdmin ? fetchSchools() : Promise.resolve([])
        ]);
        setUser(userData);
        setSchools(schoolsData);
        setSelectedSchoolId(userData.school_id || '');
        setIsSchoolAdmin(userData.is_school_admin || false);
      } catch (err) {
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isAdmin]);

  const handleSaveAssignment = async () => {
    if (!user) return;
    
    // Confirm dialog
    const confirmMsg = `Are you sure you want to update the school assignment for ${user.name}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      const targetSchool = selectedSchoolId === '' ? null : selectedSchoolId;
      await setSchoolAdminAssignment(user.id, targetSchool, isSchoolAdmin);
      
      // Update local state to reflect changes
      setUser({
        ...user,
        school_id: targetSchool,
        is_school_admin: isSchoolAdmin,
        school_locked: targetSchool ? true : false
      });
      setSaveSuccess(true);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update user assignment.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700">
        <AlertCircle className="h-5 w-5 mr-3" />
        <p>{error || 'User not found'}</p>
        <button onClick={() => navigate('/users')} className="ml-auto underline text-sm">
          Back to Users
        </button>
      </div>
    );
  }

  const isTargetPlatformAdmin = user.is_admin || user.role === 'admin';
  const isTargetTeacher = user.role === 'teacher';
  
  // Can mutate if: I am platform admin, and target is a teacher (not platform admin)
  const canMutate = isAdmin && isTargetTeacher && !isTargetPlatformAdmin;

  const currentSchoolName = schools.find(s => s.id === user.school_id)?.name || user.school || 'Unassigned';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/users')}
          className="p-2 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition-colors text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">User Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 flex flex-col items-center border-b border-slate-100">
              <div className="h-24 w-24 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <UserCircle className="h-16 w-16" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center">{user.name || 'Unnamed User'}</h3>
              <p className="text-slate-500 text-sm text-center mb-4">{user.email}</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {isTargetPlatformAdmin ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Shield className="w-3 h-3 mr-1" /> Platform Admin
                  </span>
                ) : isTargetTeacher ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Presentation className="w-3 h-3 mr-1" /> Teacher
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    <GraduationCap className="w-3 h-3 mr-1" /> Student
                  </span>
                )}
                
                {user.is_school_admin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <Building className="w-3 h-3 mr-1" /> School Admin
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Joined</p>
                <div className="flex items-center text-sm text-slate-900">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
              {user.grade_level && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Grade Level</p>
                  <p className="text-sm text-slate-900">{user.grade_level}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-medium text-slate-900">School Assignment</h3>
            </div>
            
            <div className="p-6">
              {!canMutate ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Current School</p>
                    <p className="font-medium text-slate-900">{currentSchoolName}</p>
                  </div>
                  
                  {!isAdmin && (
                    <div className="flex items-start p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>As a School Admin, you have read-only access to this user's affiliation.</p>
                    </div>
                  )}
                  {isAdmin && isTargetPlatformAdmin && (
                    <div className="flex items-start p-3 bg-purple-50 text-purple-800 rounded-md text-sm">
                      <Shield className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>Platform Admins cannot be managed through the school assignment workflow.</p>
                    </div>
                  )}
                  {isAdmin && !isTargetPlatformAdmin && !isTargetTeacher && (
                    <div className="flex items-start p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>Only Teacher accounts can be managed through the assignment workflow.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {saveSuccess && (
                    <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      Assignment updated successfully.
                    </div>
                  )}
                  
                  {saveError && (
                    <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      {saveError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Assign to School
                    </label>
                    <select
                      value={selectedSchoolId}
                      onChange={(e) => {
                        setSelectedSchoolId(e.target.value);
                        if (e.target.value === '') setIsSchoolAdmin(false); // cannot be admin if no school
                      }}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                    >
                      <option value="">-- No School Assigned --</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-slate-500">
                      Assigning a school will automatically lock the user's school affiliation.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="is_school_admin"
                        type="checkbox"
                        checked={isSchoolAdmin}
                        onChange={(e) => setIsSchoolAdmin(e.target.checked)}
                        disabled={selectedSchoolId === ''}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300 rounded disabled:opacity-50"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_school_admin" className="font-medium text-slate-700">
                        School Administrator Access
                      </label>
                      <p className="text-slate-500">
                        Grant this teacher administrative access to manage their assigned school. They must have a school selected.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSaveAssignment}
                      disabled={saving || (selectedSchoolId === user.school_id && isSchoolAdmin === user.is_school_admin)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Assignment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
