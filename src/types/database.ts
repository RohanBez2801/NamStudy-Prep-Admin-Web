export interface UserProfile {
  id: string;
  name: string;
  email: string;
  grade_level: string;
  subscription_status: string;
  expiry_date: string | null;
  is_admin: boolean;
  role?: string;
  avatar_url?: string | null;
  school?: string | null;
  school_id?: string | null;
  school_logo_url?: string | null;
  school_locked?: boolean;
  is_school_admin?: boolean;
  subjects?: string[];
  created_at: string;
}

export interface Paper {
  id: string;
  title: string;
  year: number;
  paper_number: number;
  grade_level: string;
  subject: string;
  paper_pdf_url: string;
  solution_pdf_url: string | null;
  description: string;
}

export interface Quiz {
  id: string;
  subject?: string | null;
  topic_name?: string | null;
  question?: string | null;
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  correct_answer?: string | null;
  explanation_text?: string | null;
  grade_level?: string | null;
  difficulty?: string | null;
}

export interface School {
  id: string;
  name: string;
  code?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  accent_color?: string | null;
  created_at?: string;
}

export interface Notice {
  id: string;
  school_id?: string | null;
  title: string;
  content: string;
  author_id?: string | null;
  is_urgent?: boolean;
  created_at: string;
  schools?: { name: string } | null;
}

export interface Timetable {
  id: string;
  school_id?: string | null;
  curriculum?: string | null;
  subject_name?: string | null;
  paper_code?: string | null;
  exam_date?: string | null;
  start_time?: string | null;
  duration?: string | null;
  venue?: string | null;
  created_at: string;
  schools?: { name: string } | null;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  reference_number: string;
  amount: number;
  currency: string;
  status: string;
  bank_name: string;
  plan_type?: string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  users?: { name: string; email: string; grade_level: string };
}

export interface DashboardStats {
  totalUsers: number;
  students: number;
  teachers: number;
  schools: number;
  papers: number;
  quizzes: number;
  pendingPayments: number;
  revenue: number;
}
