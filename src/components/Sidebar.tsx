import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, Users, School, FileText, 
  HelpCircle, Megaphone, Calendar, CreditCard, 
  BarChart3, UserCircle 
} from 'lucide-react';

export default function Sidebar() {
  const { profile, isAdmin, isSchoolAdmin } = useAuth();

  const superAdminTabs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Schools', path: '/schools', icon: School },
    { name: 'Papers', path: '/papers', icon: FileText },
    { name: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Statistics', path: '/statistics', icon: BarChart3 },
  ];

  const schoolAdminTabs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Notices', path: '/notices', icon: Megaphone },
    { name: 'Timetables', path: '/timetables', icon: Calendar },
  ];

  const commonTabs = [
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  let navigation: { name: string; path: string; icon: React.ElementType }[] = [];
  if (isAdmin) {
    navigation = [
      ...superAdminTabs,
      { name: 'Notices', path: '/notices', icon: Megaphone },
      { name: 'Timetables', path: '/timetables', icon: Calendar },
      ...commonTabs
    ];
  } else if (isSchoolAdmin) {
    navigation = [...schoolAdminTabs, ...commonTabs];
  }

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-slate-300 min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="flex items-center h-16 px-4 bg-slate-950 text-white shrink-0">
        <div className="w-8 h-8 mr-3 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-sm">N</div>
        <span className="font-bold text-lg truncate">Admin Console</span>
      </div>
      
      <div className="p-4 shrink-0">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Access Level
        </div>
        {isAdmin ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            PLATFORM ADMIN
          </span>
        ) : isSchoolAdmin ? (
          <div className="flex flex-col">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
              SCHOOL ADMIN
            </span>
            <span className="text-xs text-slate-400 mt-1 truncate" title={profile?.school || ''}>
              {profile?.school || 'Unknown School'}
            </span>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="mr-3 shrink-0 h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

