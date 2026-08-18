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

    const confirmMsg = `Are you sure you want to update the school assignment for ${user.name}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      const targetSchool = selectedSchoolId === '' ? null : selectedSchoolId;
      await setSchoolAdminAssignment(user.id, targetSchool, isSchoolAdmin);

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
      <div className="center" style={{ minHeight: 220 }}>
        <div className="loading-spinner" aria-hidden />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="card" style={{ background: '#fff1f2', borderColor: '#fecaca', color: '#991b1b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle />
          <p style={{ margin: 0 }}>{error || 'User not found'}</p>
          <button onClick={() => navigate('/users')} className="btn btn-link" style={{ marginLeft: 'auto' }}>
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const isTargetPlatformAdmin = user.is_admin || user.role === 'admin';
  const isTargetTeacher = user.role === 'teacher';

  const canMutate = isAdmin && isTargetTeacher && !isTargetPlatformAdmin;

  const currentSchoolName = schools.find(s => s.id === user.school_id)?.name || user.school || 'Unassigned';

  return (
    <div className="page container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/users')}
            className="btn btn-secondary"
            aria-label="Back to users"
          >
            <ArrowLeft />
          </button>
          <h2 className="page-title">User Details</h2>
        </div>
      </div>

      <div className="grid-3-md">
        {/* Profile Card */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 96, height: 96, borderRadius: 96, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff' }}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="avatar" style={{ width: 96, height: 96 }} />
                ) : (
                  <UserCircle style={{ width: 64, height: 64, color: '#6366f1' }} />
                )}
              </div>

              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, textAlign: 'center' }}>{user.name || 'Unnamed User'}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13 }}>{user.email}</p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {isTargetPlatformAdmin ? (
                  <span className="badge badge--purple"><Shield /> Platform Admin</span>
                ) : isTargetTeacher ? (
                  <span className="badge badge--blue"><Presentation /> Teacher</span>
                ) : (
                  <span className="badge badge--slate"><GraduationCap /> Student</span>
                )}

                {user.is_school_admin && (
                  <span className="badge badge--indigo"><Building /> School Admin</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 8 }}>
                <p className="form-label" style={{ marginBottom: 6 }}>Joined</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar />
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {user.grade_level && (
                <div>
                  <p className="form-label" style={{ marginBottom: 6 }}>Grade Level</p>
                  <p style={{ margin: 0 }}>{user.grade_level}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details & Actions */}
        <div>
          <div className="card">
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>School Assignment</h3>
            </div>

            <div>
              {!canMutate ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid rgba(15,23,42,0.03)' }}>
                    <p className="form-label" style={{ marginBottom: 6 }}>Current School</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{currentSchoolName}</p>
                  </div>

                  {!isAdmin && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#ebf8ff', padding: 12, borderRadius: 8 }}>
                      <AlertCircle />
                      <p style={{ margin: 0 }}>As a School Admin, you have read-only access to this user's affiliation.</p>
                    </div>
                  )}

                  {isAdmin && isTargetPlatformAdmin && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#faf5ff', padding: 12, borderRadius: 8 }}>
                      <Shield />
                      <p style={{ margin: 0 }}>Platform Admins cannot be managed through the school assignment workflow.</p>
                    </div>
                  )}

                  {isAdmin && !isTargetPlatformAdmin && !isTargetTeacher && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#fff7ed', padding: 12, borderRadius: 8 }}>
                      <AlertCircle />
                      <p style={{ margin: 0 }}>Only Teacher accounts can be managed through the assignment workflow.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {saveSuccess && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#ecfdf5', padding: 12, borderRadius: 8, border: '1px solid #bbf7d0' }}>
                      <CheckCircle />
                      <span>Assignment updated successfully.</span>
                    </div>
                  )}

                  {saveError && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fff1f2', padding: 12, borderRadius: 8, border: '1px solid #fecaca' }}>
                      <AlertCircle />
                      <span>{saveError}</span>
                    </div>
                  )}

                  <div>
                    <label className="form-label">Assign to School</label>
                    <select
                      value={selectedSchoolId}
                      onChange={(e) => {
                        setSelectedSchoolId(e.target.value);
                        if (e.target.value === '') setIsSchoolAdmin(false);
                      }}
                      className="select-input"
                    >
                      <option value="">-- No School Assigned --</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      Assigning a school will automatically lock the user's school affiliation.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div>
                      <input
                        id="is_school_admin"
                        type="checkbox"
                        checked={isSchoolAdmin}
                        onChange={(e) => setIsSchoolAdmin(e.target.checked)}
                        disabled={selectedSchoolId === ''}
                        style={{ width: 16, height: 16 }}
                      />
                    </div>
                    <div>
                      <label htmlFor="is_school_admin" className="form-label">School Administrator Access</label>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        Grant this teacher administrative access to manage their assigned school. They must have a school selected.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <button
                      onClick={handleSaveAssignment}
                      disabled={saving || (selectedSchoolId === user.school_id && isSchoolAdmin === user.is_school_admin)}
                      className="btn btn-primary"
                    >
                      {saving && <Loader2 className="nav-icon" />}
                      <span style={{ marginLeft: saving ? 8 : 0 }}>Save Assignment</span>
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
