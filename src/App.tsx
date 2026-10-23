import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { OwnerBioBanner } from './components/OwnerBioBanner';
import { StudentView } from './components/StudentView';
import { TeacherView } from './components/TeacherView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { RegistrationModal } from './components/RegistrationModal';
import { CreateTestModal } from './components/CreateTestModal';
import { TestTakingModal } from './components/TestTakingModal';
import { FinalExamModal } from './components/FinalExamModal';
import { GroupChatModal } from './components/GroupChatModal';
import { MessageModal } from './components/MessageModal';
import { ExpelModal } from './components/ExpelModal';
import {
  Student,
  Teacher,
  TeacherNotification,
  TestSubmissionResult,
  ExpelRequest,
  CourseStage,
  GeneratedTest,
  AuthUser
} from './types';
import {
  initializeStorage,
  getTeachers,
  getStudents,
  getTeacherNotifications,
  getTestSubmissions,
  getExpelRequests,
  getCurrentAuthUser,
  setCurrentAuthUser,
  logoutUser,
  addTeacher,
  deleteTeacher,
  adminApproveStageUpgrade,
  resolveExpelRequest,
  markNotificationAsRead,
  completeStudentLesson
} from './services/storage';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme, isTransitioning } = useTheme();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [notifications, setNotifications] = useState<TeacherNotification[]>([]);
  const [testSubmissions, setTestSubmissions] = useState<TestSubmissionResult[]>([]);
  const [expelRequests, setExpelRequests] = useState<ExpelRequest[]>([]);

  // Auth & General Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showDirectRegisterModal, setShowDirectRegisterModal] = useState(false);
  const [showTestIdModal, setShowTestIdModal] = useState(false);
  const [initialTestIdForModal, setInitialTestIdForModal] = useState('');
  const [showFinalExamModal, setShowFinalExamModal] = useState(false);
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);
  const [activeGroupChatTeacherId, setActiveGroupChatTeacherId] = useState<string>('t-1');

  // Teacher action modals
  const [testCreationTarget, setTestCreationTarget] = useState<{
    student: Student;
    stage: CourseStage;
  } | null>(null);

  const [messageTargetStudent, setMessageTargetStudent] = useState<Student | null>(null);
  const [expelTargetStudent, setExpelTargetStudent] = useState<Student | null>(null);

  // Initialize and load all data
  const refreshAllData = () => {
    initializeStorage();
    const loadedTeachers = getTeachers();
    const loadedStudents = getStudents();
    const loadedSubmissions = getTestSubmissions();
    const loadedExpels = getExpelRequests();
    const auth = getCurrentAuthUser();

    setTeachers(loadedTeachers);
    setStudents(loadedStudents);
    setTestSubmissions(loadedSubmissions);
    setExpelRequests(loadedExpels);
    setCurrentUser(auth);

    if (auth) {
      setShowLandingPage(false);
      if (auth.role === 'owner') {
        setCurrentRole('admin');
      } else if (auth.role === 'teacher') {
        setCurrentRole('teacher');
        setSelectedTeacherId(auth.id);
      } else if (auth.role === 'student') {
        setCurrentRole('student');
        setSelectedStudentId(auth.id);
      }
    } else {
      setShowLandingPage(true);
    }

    if (loadedTeachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(loadedTeachers[0].id);
    }
    if (loadedStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(loadedStudents[0].id);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Update notifications when teacher changes
  useEffect(() => {
    if (selectedTeacherId) {
      const notifs = getTeacherNotifications(selectedTeacherId);
      setNotifications(notifs);
    }
  }, [selectedTeacherId, teachers, students]);

  const selectedStudent =
    students.find((s) => s.id === (currentUser?.role === 'student' ? currentUser.id : selectedStudentId)) ||
    (students.length > 0 ? students[0] : null);

  const selectedTeacher =
    teachers.find((t) => t.id === (currentUser?.role === 'teacher' ? currentUser.id : selectedTeacherId)) ||
    (teachers.length > 0 ? teachers[0] : null);

  const studentTeacher = selectedStudent
    ? teachers.find((t) => t.id === selectedStudent.teacherId) || null
    : null;

  // Handlers
  const handleOpenLogin = () => {
    setAuthModalTab('login');
    setShowAuthModal(true);
  };

  const handleOpenRegister = () => {
    setShowDirectRegisterModal(true);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentRole('student');
    setShowLandingPage(true);
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setShowLandingPage(false);

    if (user.role === 'owner') {
      setCurrentRole('admin');
    } else if (user.role === 'teacher') {
      setCurrentRole('teacher');
      setSelectedTeacherId(user.id);
    } else if (user.role === 'student') {
      setCurrentRole('student');
      setSelectedStudentId(user.id);
    }
    refreshAllData();
  };

  const handleOpenTestIdModal = (initialId?: string) => {
    setInitialTestIdForModal(initialId || '');
    setShowTestIdModal(true);
  };

  const handleOpenGroupChat = (teacherId: string) => {
    setActiveGroupChatTeacherId(teacherId);
    setShowGroupChatModal(true);
  };

  const handleOpenCreateTestModal = (student: Student, stage: CourseStage) => {
    setTestCreationTarget({ student, stage });
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (selectedStudent) {
      completeStudentLesson(selectedStudent.id, lessonId);
      refreshAllData();
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    markNotificationAsRead(id);
    if (selectedTeacher) {
      setNotifications(getTeacherNotifications(selectedTeacher.id));
    }
  };

  const handleAddTeacher = (teacherData: Omit<Teacher, 'id' | 'studentIds' | 'rating' | 'activeSince'>) => {
    addTeacher(teacherData);
    refreshAllData();
  };

  const handleDeleteTeacher = (teacherId: string) => {
    deleteTeacher(teacherId);
    refreshAllData();
  };

  const handleApproveUpgrade = (submissionId: string) => {
    const res = adminApproveStageUpgrade(submissionId);
    if (res.success) {
      refreshAllData();
    }
  };

  const handleResolveExpel = (requestId: string, approve: boolean) => {
    resolveExpelRequest(requestId, approve);
    refreshAllData();
  };

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-colors duration-200 relative ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Theme fade transition overlay (smooth subtle transition effect) */}
      {isTransitioning && (
        <div className="fixed inset-0 pointer-events-none z-[9999] theme-fade-overlay bg-indigo-500/10 backdrop-blur-[0.5px]" />
      )}

      {/* Global Header (Without the 3 role switcher buttons) */}
      <Header
        currentUser={currentUser}
        selectedStudent={selectedStudent}
        selectedTeacher={selectedTeacher}
        teachers={teachers}
        students={students}
        onOpenLoginModal={handleOpenLogin}
        onOpenRegisterModal={handleOpenRegister}
        onOpenTestIdModal={() => handleOpenTestIdModal()}
        onOpenGroupChatModal={() => handleOpenGroupChat(selectedTeacher?.id || 't-1')}
        onOpenFinalExamModal={() => setShowFinalExamModal(true)}
        onLogout={handleLogout}
        unreadNotesCount={notifications.filter((n) => !n.read).length}
        showLandingPage={showLandingPage}
        onToggleLandingPage={setShowLandingPage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* CASE 1: Visitor is NOT logged in OR clicked Bosh Sahifa */}
        {(!currentUser || showLandingPage) ? (
          <LandingPage
            onOpenLogin={handleOpenLogin}
            onOpenRegister={handleOpenRegister}
            onOpenTestIdModal={() => handleOpenTestIdModal()}
            students={students}
            teachers={teachers}
          />
        ) : (
          /* CASE 2: User IS logged in -> Show ONLY their authorized dashboard! */
          <div className="space-y-6">
            
            {/* STUDENT ROLE VIEW */}
            {currentUser.role === 'student' && (
              <StudentView
                student={selectedStudent}
                teacher={studentTeacher}
                testSubmissions={testSubmissions}
                onOpenTestIdModal={handleOpenTestIdModal}
                onOpenFinalExamModal={() => setShowFinalExamModal(true)}
                onOpenGroupChat={handleOpenGroupChat}
                onCompleteLesson={handleCompleteLesson}
                onOpenRegisterModal={handleOpenRegister}
              />
            )}

            {/* TEACHER ROLE VIEW */}
            {currentUser.role === 'teacher' && selectedTeacher && (
              <TeacherView
                teacher={selectedTeacher}
                students={students}
                notifications={notifications}
                testSubmissions={testSubmissions}
                onOpenCreateTestModal={handleOpenCreateTestModal}
                onOpenMessageModal={(student) => setMessageTargetStudent(student)}
                onOpenExpelModal={(student) => setExpelTargetStudent(student)}
                onOpenGroupChat={handleOpenGroupChat}
                onMarkNotificationRead={handleMarkNotificationRead}
                onUpdateGroupName={() => refreshAllData()}
              />
            )}

            {/* ADMIN (OWNER) ROLE VIEW */}
            {currentUser.role === 'owner' && (
              <AdminView
                teachers={teachers}
                students={students}
                testSubmissions={testSubmissions}
                expelRequests={expelRequests}
                onAddTeacher={handleAddTeacher}
                onDeleteTeacher={handleDeleteTeacher}
                onApproveUpgrade={handleApproveUpgrade}
                onResolveExpel={handleResolveExpel}
                onOpenGroupChat={handleOpenGroupChat}
              />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} DevMaster Academy — Asoschi: Olimjon Alimjonov (Lord)</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>HTML • CSS • JavaScript</span>
            <span>15 Talabali Guruhlar</span>
            <span>Xavfsiz Tizim & Test ID</span>
          </div>
        </div>
      </footer>

      {/* ===================== MODALS ===================== */}

      {/* 1. Direct Registration Modal with masked password & random assignment */}
      {showDirectRegisterModal && (
        <RegistrationModal
          onClose={() => setShowDirectRegisterModal(false)}
          onRegistered={(newStudent, assignedTeacher) => {
            refreshAllData();
            if (newStudent) {
              setSelectedStudentId(newStudent.id);
            }
            if (assignedTeacher) {
              setSelectedTeacherId(assignedTeacher.id);
            }
          }}
        />
      )}

      {/* 2. Auth Modal (Login / Register) */}
      {showAuthModal && (
        <AuthModal
          initialTab={authModalTab}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onStudentRegistered={(newStudent, assignedTeacher) => {
            refreshAllData();
            setSelectedStudentId(newStudent.id);
            if (assignedTeacher) {
              setSelectedTeacherId(assignedTeacher.id);
            }
          }}
        />
      )}

      {/* 3. Ustoz test berishi (Test ID generator) */}
      {testCreationTarget && selectedTeacher && (
        <CreateTestModal
          teacher={selectedTeacher}
          student={testCreationTarget.student}
          initialStage={testCreationTarget.stage}
          studentsList={students.filter((s) => s.teacherId === selectedTeacher.id)}
          onClose={() => setTestCreationTarget(null)}
          onTestCreated={(newTest: GeneratedTest) => {
            refreshAllData();
          }}
        />
      )}

      {/* 4. Talaba Test ID bilan kirib test yechishi (bir martalik, o'chadi) */}
      {showTestIdModal && (
        <TestTakingModal
          initialTestId={initialTestIdForModal}
          onClose={() => {
            setShowTestIdModal(false);
            setInitialTestIdForModal('');
          }}
          onTestSubmittedSuccess={() => {
            refreshAllData();
          }}
        />
      )}

      {/* 5. Final Katta Qiyin Imtihon */}
      {showFinalExamModal && (
        <FinalExamModal
          student={
            selectedStudent || {
              id: 'guest',
              name: 'Mehmon',
              surname: 'Talaba',
              username: 'guest',
              avatar: '',
              phone: '',
              email: '',
              stage: 'javascript',
              xp: 1000,
              rank: 1,
              coins: 100,
              teacherId: 't-1',
              completedLessons: [],
              lastActive: 'Hozir',
              joinedDate: '',
            }
          }
          onClose={() => setShowFinalExamModal(false)}
          onPassed100Percent={() => {
            refreshAllData();
          }}
        />
      )}

      {/* 6. 15 kishilik Maxsus Guruh Chati (Ustoz + 15 talaba + Admin) */}
      {showGroupChatModal && (
        <GroupChatModal
          teacher={
            teachers.find((t) => t.id === activeGroupChatTeacherId) ||
            selectedTeacher ||
            teachers[0]
          }
          allTeachers={teachers}
          students={students}
          currentRole={currentRole}
          currentStudent={selectedStudent}
          onClose={() => setShowGroupChatModal(false)}
          onStartTestWithId={(testId) => {
            setShowGroupChatModal(false);
            handleOpenTestIdModal(testId);
          }}
          onUpdateGroupName={() => refreshAllData()}
        />
      )}

      {/* 7. Ustoz o'quvchiga shaxsiy xabar yuborishi */}
      {messageTargetStudent && selectedTeacher && (
        <MessageModal
          teacher={selectedTeacher}
          student={messageTargetStudent}
          onClose={() => setMessageTargetStudent(null)}
          onSent={() => {
            refreshAllData();
          }}
        />
      )}

      {/* 8. Ustoz o'quvchini chetlatishni adminga aytishi */}
      {expelTargetStudent && selectedTeacher && (
        <ExpelModal
          teacher={selectedTeacher}
          student={expelTargetStudent}
          onClose={() => setExpelTargetStudent(null)}
          onSubmitted={() => {
            refreshAllData();
          }}
        />
      )}

    </div>
  );
}
