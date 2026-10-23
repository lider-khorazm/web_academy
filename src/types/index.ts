export type CourseStage = 'html' | 'css' | 'javascript' | 'graduated';

export interface Student {
  id: string;
  name: string;
  surname: string;
  username: string; // Login
  password?: string; // Parol
  avatar: string;
  phone: string;
  email: string;
  stage: CourseStage;
  xp: number;
  rank: number;
  coins: number;
  teacherId: string; // Biriktirilgan ustoz ID si
  completedLessons: string[];
  stageCompletedPendingTest?: CourseStage; // Ustoz test berishi kerak bo'lgan bosqich
  lastActive: string;
  joinedDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  surname: string;
  groupName?: string; // O'qituvchi o'z guruhiga qo'ygan maxsus nom (masalan: "Web Ninjas", "FrontEnd Yulduzlari")
  username: string; // Login (Owner yaratadi)
  password?: string; // Parol (Owner yaratadi)
  avatar: string;
  specialty: string;
  experienceYears: number;
  phone: string;
  email: string;
  bio: string;
  studentIds: string[]; // Maksimal 15 ta o'quvchi
  rating: number;
  activeSince: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: 'owner' | 'teacher' | 'student';
  username: string;
  avatar?: string;
}

export interface OwnerProfile {
  name: string;
  username: string;
  roleTitle: string;
  avatar: string;
  bio: string;
  interests: string[];
  quote: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  points: number;
}

export interface GeneratedTest {
  id: string; // Masalan: TEST-HTML-9821
  studentId: string;
  studentName: string;
  stage: CourseStage;
  teacherId: string;
  questionCount: number;
  questions: TestQuestion[];
  createdAt: string;
  expiresInMinutes: number;
  status: 'active' | 'completed' | 'expired';
}

export interface TestSubmissionResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  stage: CourseStage;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  answers: {
    questionId: string;
    questionText: string;
    userAnswerIndex: number;
    correctAnswerIndex: number;
    isCorrect: boolean;
  }[];
  adminApprovedStageUpgrade: boolean; // Admin tasdiqlashi
}

export interface ExpelRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface TeacherNotification {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  stage: CourseStage;
  type: 'needs_test' | 'student_message' | 'test_submitted';
  message: string;
  createdAt: string;
  read: boolean;
}

export interface GroupChatMessage {
  id: string;
  teacherId: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student' | 'admin' | 'system';
  avatar?: string;
  text: string;
  timestamp: string;
  isTestAlert?: boolean;
  testId?: string;
}

export interface Lesson {
  id: string;
  stage: CourseStage;
  title: string;
  duration: string;
  xpReward: number;
  summary: string;
  codeExample: string;
  practiceTask: string;
  starterCode: string;
  solutionKeyword: string;
}
