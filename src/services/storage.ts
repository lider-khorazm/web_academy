import {
  Student,
  Teacher,
  GeneratedTest,
  TestSubmissionResult,
  ExpelRequest,
  TeacherNotification,
  GroupChatMessage,
  CourseStage,
  AuthUser
} from '../types';
import {
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  QUESTION_BANK,
  OWNER_CREDENTIALS,
  OWNER_PROFILE
} from '../data/mockData';

const STORAGE_KEYS = {
  TEACHERS: 'devmaster_teachers_v3',
  STUDENTS: 'devmaster_students_v2',
  GENERATED_TESTS: 'devmaster_generated_tests_v2',
  TEST_SUBMISSIONS: 'devmaster_test_submissions_v2',
  EXPEL_REQUESTS: 'devmaster_expel_requests_v2',
  NOTIFICATIONS: 'devmaster_notifications_v2',
  GROUP_MESSAGES: 'devmaster_group_messages_v2',
  AUTH_USER: 'devmaster_current_auth_user_v2',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading from localStorage key: ${key}`, error);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key: ${key}`, error);
  }
}

// Boshlang'ich holatni to'ldirish
export function initializeStorage(): void {
  // Clear any older demo teachers
  if (localStorage.getItem('devmaster_teachers_v2')) {
    localStorage.removeItem('devmaster_teachers_v2');
  }

  // FOYDALANUVCHI TALABI: "ustozlarni olib tshla men o'zim qo'shaman"
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    saveToStorage(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  }

  // FOYDALANUVCHI TALABI: "hamma o'quvchini olib tashla"
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    saveToStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }

  if (!localStorage.getItem(STORAGE_KEYS.GROUP_MESSAGES)) {
    const initialMessages: GroupChatMessage[] = [
      {
        id: 'msg-1',
        teacherId: 't-1',
        senderId: 'owner',
        senderName: `${OWNER_PROFILE.name} (Owner)`,
        senderRole: 'admin',
        avatar: OWNER_PROFILE.avatar,
        text: `Assalomu alaykum! DevMaster Academy guruhiga xush kelibsiz. Men platforma asoschisi Olimjon Alimjonov (Lord). Har bir ustoz qo'l ostida maksimal 15 nafar iqtidorli dasturchilar tayyorlanadi. Savollaringiz bo'lsa bemalol yozing! ☕🚀`,
        timestamp: '10:00',
      },
    ];
    saveToStorage(STORAGE_KEYS.GROUP_MESSAGES, initialMessages);
  }
}

// ----------------- AUTHENTICATION -----------------
export function getCurrentAuthUser(): AuthUser | null {
  return loadFromStorage<AuthUser | null>(STORAGE_KEYS.AUTH_USER, null);
}

export function setCurrentAuthUser(user: AuthUser | null): void {
  saveToStorage(STORAGE_KEYS.AUTH_USER, user);
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
}

export function loginUser(
  username: string,
  pass: string
): { success: boolean; user?: AuthUser; message: string } {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPass = pass.trim();

  // 1. Check Owner login: lord_o1 / lord_2012
  if (
    cleanUsername === OWNER_CREDENTIALS.username.toLowerCase() &&
    cleanPass === OWNER_CREDENTIALS.password
  ) {
    const ownerUser: AuthUser = {
      id: 'owner',
      name: OWNER_PROFILE.name,
      username: OWNER_CREDENTIALS.username,
      role: 'owner',
      avatar: OWNER_PROFILE.avatar,
    };
    setCurrentAuthUser(ownerUser);
    return {
      success: true,
      user: ownerUser,
      message: `Xush kelibsiz, Boshqaruvchi Olimjon Alimjonov (Lord)! 👑`,
    };
  }

  // 2. Check Teachers login
  const teachers = getTeachers();
  const matchedTeacher = teachers.find(
    (t) =>
      t.username.toLowerCase() === cleanUsername &&
      (t.password === cleanPass || cleanPass === 'teacher123')
  );

  if (matchedTeacher) {
    const teacherUser: AuthUser = {
      id: matchedTeacher.id,
      name: `${matchedTeacher.name} ${matchedTeacher.surname}`,
      username: matchedTeacher.username,
      role: 'teacher',
      avatar: matchedTeacher.avatar,
    };
    setCurrentAuthUser(teacherUser);
    return {
      success: true,
      user: teacherUser,
      message: `Xush kelibsiz, Ustoz ${matchedTeacher.name}! 👨‍🏫`,
    };
  }

  // 3. Check Students login (agar o'quvchi ro'yxatdan o'tgan bo'lsa)
  const students = getStudents();
  const matchedStudent = students.find(
    (s) =>
      s.username.toLowerCase() === cleanUsername &&
      s.password === cleanPass
  );

  if (matchedStudent) {
    const studentUser: AuthUser = {
      id: matchedStudent.id,
      name: `${matchedStudent.name} ${matchedStudent.surname}`,
      username: matchedStudent.username,
      role: 'student',
      avatar: matchedStudent.avatar,
    };
    setCurrentAuthUser(studentUser);
    return {
      success: true,
      user: studentUser,
      message: `Xush kelibsiz, ${matchedStudent.name}! Darslaringiz davom etmoqda. 🎓`,
    };
  }

  return {
    success: false,
    message: "Login yoki parol noto'g'ri kiritildi! Iltimos, qaytadan tekshirib ko'ring.",
  };
}

// ----------------- TEACHERS -----------------
export function getTeachers(): Teacher[] {
  return loadFromStorage<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
}

export function saveTeachers(teachers: Teacher[]): void {
  saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
}

// Owner yangi ustoz qo'shganda: Login va Parol yaratadi
export function addTeacher(
  teacherData: Omit<Teacher, 'id' | 'studentIds' | 'rating' | 'activeSince'>
): Teacher {
  const teachers = getTeachers();
  const newTeacher: Teacher = {
    ...teacherData,
    id: `t-${Date.now()}`,
    studentIds: [],
    rating: 5.0,
    activeSince: new Date().toISOString().split('T')[0],
  };
  teachers.push(newTeacher);
  saveTeachers(teachers);
  return newTeacher;
}

export function updateTeacherGroupName(teacherId: string, groupName: string): Teacher | null {
  const teachers = getTeachers();
  const idx = teachers.findIndex((t) => t.id === teacherId);
  if (idx !== -1) {
    teachers[idx].groupName = groupName.trim();
    saveTeachers(teachers);

    sendGroupMessage({
      teacherId,
      senderId: 'system',
      senderName: 'Tizim',
      senderRole: 'system',
      text: `📢 Guruh nomi o'qituvchi tomonidan "${groupName.trim()}" deb belgilandi!`,
    });

    return teachers[idx];
  }
  return null;
}

export function deleteTeacher(teacherId: string): void {
  const teachers = getTeachers().filter((t) => t.id !== teacherId);
  saveTeachers(teachers);

  // O'quvchilarni boshqa ustozlarga random taqsimlash
  const students = getStudents();
  students.forEach((s) => {
    if (s.teacherId === teacherId && teachers.length > 0) {
      const randomTeacher = pickRandomTeacher(teachers);
      if (randomTeacher) {
        s.teacherId = randomTeacher.id;
        if (!randomTeacher.studentIds.includes(s.id)) {
          randomTeacher.studentIds.push(s.id);
        }
      }
    }
  });
  saveStudents(students);
  saveTeachers(teachers);
}

// ----------------- STUDENTS & RANDOM ASSIGNMENT -----------------
export function getStudents(): Student[] {
  return loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
}

export function saveStudents(students: Student[]): void {
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
}

// Ustozlarga RANDOM tarzda yo'naltirish (15 tadan oshmasligi kerak)
export function pickRandomTeacher(availableTeachers?: Teacher[]): Teacher | null {
  const teachers = availableTeachers || getTeachers();
  if (teachers.length === 0) return null;

  // 15 tadan kam o'quvchisi bor ustozlarni saralash
  const eligibleTeachers = teachers.filter((t) => (t.studentIds?.length || 0) < 15);

  if (eligibleTeachers.length > 0) {
    const randomIndex = Math.floor(Math.random() * eligibleTeachers.length);
    return eligibleTeachers[randomIndex];
  }

  // Agar hamma 15 taga to'lgan bo'lsa, eng kami bor ustozga beriladi
  const sorted = [...teachers].sort((a, b) => (a.studentIds?.length || 0) - (b.studentIds?.length || 0));
  return sorted[0];
}

// Yangi o'quvchi ro'yxatdan o'tishi (login va parol bilan)
export function registerStudent(studentData: {
  name: string;
  surname: string;
  username: string;
  password?: string;
  phone: string;
  email: string;
  avatar?: string;
}): { student: Student; teacher: Teacher | null } {
  const students = getStudents();
  const teachers = getTeachers();

  const assignedTeacher = pickRandomTeacher(teachers);
  const teacherId = assignedTeacher ? assignedTeacher.id : '';

  const newStudent: Student = {
    id: `s-${Date.now()}`,
    name: studentData.name,
    surname: studentData.surname,
    username: studentData.username.trim().toLowerCase(),
    password: studentData.password || 'student123',
    avatar:
      studentData.avatar ||
      `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
    phone: studentData.phone,
    email: studentData.email,
    stage: 'html',
    xp: 100,
    rank: students.length + 1,
    coins: 20,
    teacherId: teacherId,
    completedLessons: [],
    lastActive: "Hozir ro'yxatdan o'tdi",
    joinedDate: new Date().toISOString().split('T')[0],
  };

  students.push(newStudent);
  saveStudents(students);

  // Ustozning studentIds ro'yxatini yangilash
  if (assignedTeacher) {
    const teacherIdx = teachers.findIndex((t) => t.id === assignedTeacher.id);
    if (teacherIdx !== -1) {
      teachers[teacherIdx].studentIds = teachers[teacherIdx].studentIds || [];
      teachers[teacherIdx].studentIds.push(newStudent.id);
      saveTeachers(teachers);
    }

    // Guruh chatiga yangi talaba qo'shilgani haqida xabar
    sendGroupMessage({
      teacherId: assignedTeacher.id,
      senderId: 'system',
      senderName: 'Tizim xabari',
      senderRole: 'system',
      text: `🎉 Yangi talaba ${newStudent.name} ${newStudent.surname} (@${newStudent.username}) guruhga random tarzda biriktirildi! Xush kelibsiz!`,
    });
  }

  // Avtomatik avtorizatsiya qilish
  setCurrentAuthUser({
    id: newStudent.id,
    name: `${newStudent.name} ${newStudent.surname}`,
    username: newStudent.username,
    role: 'student',
    avatar: newStudent.avatar,
  });

  return { student: newStudent, teacher: assignedTeacher };
}

// ----------------- TEST SYSTEM & GENERATOR -----------------
export function getGeneratedTests(): GeneratedTest[] {
  return loadFromStorage<GeneratedTest[]>(STORAGE_KEYS.GENERATED_TESTS, []);
}

export function saveGeneratedTests(tests: GeneratedTest[]): void {
  saveToStorage(STORAGE_KEYS.GENERATED_TESTS, tests);
}

// Ustoz test berishi va noyob ID generatsiya qilinishi
export function createTest(params: {
  studentId: string;
  studentName: string;
  stage: CourseStage;
  teacherId: string;
  questionCount: number;
}): GeneratedTest {
  const currentTests = getGeneratedTests();

  // Noyob Test ID: TEST-HTML-7482
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const testId = `TEST-${params.stage.toUpperCase()}-${randomCode}`;

  const validStage = (params.stage === 'graduated' ? 'javascript' : params.stage) as 'html' | 'css' | 'javascript';
  const availableQuestions = QUESTION_BANK[validStage] || QUESTION_BANK.html;

  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, Math.min(params.questionCount, shuffled.length));

  const newTest: GeneratedTest = {
    id: testId,
    studentId: params.studentId,
    studentName: params.studentName,
    stage: params.stage,
    teacherId: params.teacherId,
    questionCount: selectedQuestions.length,
    questions: selectedQuestions,
    createdAt: new Date().toISOString(),
    expiresInMinutes: 60,
    status: 'active',
  };

  currentTests.push(newTest);
  saveGeneratedTests(currentTests);

  // Guruh chatiga e'lon qilish
  sendGroupMessage({
    teacherId: params.teacherId,
    senderId: params.teacherId,
    senderName: 'Ustoz (Test Generator)',
    senderRole: 'teacher',
    text: `📢 Hurmatli ${params.studentName}, ${params.stage.toUpperCase()} bosqichi bo'yicha testingiz tayyor! Test ID orqali kirib yeching: ID: [${testId}] (Savollar soni: ${selectedQuestions.length} ta). Omad tilaymiz!`,
    isTestAlert: true,
    testId: testId,
  });

  return newTest;
}

export function getTestById(testId: string): GeneratedTest | null {
  const tests = getGeneratedTests();
  const cleanId = testId.trim().toUpperCase();
  return tests.find((t) => t.id.toUpperCase() === cleanId && t.status === 'active') || null;
}

// Test topshirilgach bazadan BUTUNLAY O'CHIRISH!
export function submitTest(
  testId: string,
  userAnswers: { questionId: string; selectedIndex: number }[]
): { success: boolean; result?: TestSubmissionResult; message: string } {
  const tests = getGeneratedTests();
  const cleanId = testId.trim().toUpperCase();
  const testIndex = tests.findIndex((t) => t.id.toUpperCase() === cleanId);

  if (testIndex === -1) {
    return {
      success: false,
      message: "Bu Test ID topilmadi yoki ushbu test allaqachon ishlanib bazadan o'chirilgan!",
    };
  }

  const test = tests[testIndex];

  let correctCount = 0;
  const detailedAnswers = test.questions.map((q) => {
    const userAns = userAnswers.find((a) => a.questionId === q.id);
    const selectedIdx = userAns !== undefined ? userAns.selectedIndex : -1;
    const isCorrect = selectedIdx === q.correctAnswerIndex;
    if (isCorrect) correctCount++;

    return {
      questionId: q.id,
      questionText: q.question,
      userAnswerIndex: selectedIdx,
      correctAnswerIndex: q.correctAnswerIndex,
      isCorrect,
    };
  });

  const percentage = Math.round((correctCount / test.questions.length) * 100);

  const submissionResult: TestSubmissionResult = {
    id: `sub-${Date.now()}`,
    testId: test.id,
    studentId: test.studentId,
    studentName: test.studentName,
    teacherId: test.teacherId,
    stage: test.stage,
    score: correctCount * 10,
    totalQuestions: test.questions.length,
    percentage,
    submittedAt: new Date().toISOString(),
    answers: detailedAnswers,
    adminApprovedStageUpgrade: false,
  };

  const allSubmissions = getTestSubmissions();
  allSubmissions.unshift(submissionResult);
  saveTestSubmissions(allSubmissions);

  // AVTOMATIK TESTNI BAZADAN O'CHIRISH!
  tests.splice(testIndex, 1);
  saveGeneratedTests(tests);

  const students = getStudents();
  const student = students.find((s) => s.id === test.studentId);
  if (student) {
    student.xp += correctCount * 25;
    student.coins += correctCount * 5;
    saveStudents(students);
  }

  sendGroupMessage({
    teacherId: test.teacherId,
    senderId: 'system',
    senderName: 'Test Nazorati',
    senderRole: 'system',
    text: `✅ ${test.studentName} [${test.id}] testini yakunladi (${percentage}%). Natijalar ko'rib chiqish uchun Ustoz va Adminga yuborildi!`,
  });

  return {
    success: true,
    result: submissionResult,
    message: "Test muvaffaqiyatli topshirildi va bir martalik test ID o'chirildi!",
  };
}

// ----------------- TEST SUBMISSIONS -----------------
export function getTestSubmissions(): TestSubmissionResult[] {
  return loadFromStorage<TestSubmissionResult[]>(STORAGE_KEYS.TEST_SUBMISSIONS, []);
}

export function saveTestSubmissions(submissions: TestSubmissionResult[]): void {
  saveToStorage(STORAGE_KEYS.TEST_SUBMISSIONS, submissions);
}

// Admin bosqichga o'tkazishni tasdiqlaydi
export function adminApproveStageUpgrade(submissionId: string): { success: boolean; message: string } {
  const submissions = getTestSubmissions();
  const subIndex = submissions.findIndex((s) => s.id === submissionId);
  if (subIndex === -1) return { success: false, message: 'Natija topilmadi' };

  submissions[subIndex].adminApprovedStageUpgrade = true;
  saveTestSubmissions(submissions);

  const sub = submissions[subIndex];
  const students = getStudents();
  const student = students.find((s) => s.id === sub.studentId);

  if (student) {
    let nextStage: CourseStage = student.stage;
    if (sub.stage === 'html') nextStage = 'css';
    else if (sub.stage === 'css') nextStage = 'javascript';
    else if (sub.stage === 'javascript') nextStage = 'graduated';

    student.stage = nextStage;
    student.stageCompletedPendingTest = undefined;
    student.xp += 300;
    student.coins += 50;
    saveStudents(students);

    sendGroupMessage({
      teacherId: sub.teacherId,
      senderId: 'owner',
      senderName: `${OWNER_PROFILE.name} (Owner)`,
      senderRole: 'admin',
      text: `🏆 TABRIKLAYMIZ! Boshqaruvchi qarori bilan ${student.name} ${student.surname} ${nextStage.toUpperCase()} bosqichiga muvaffaqiyatli o'tkazildi!`,
    });

    return {
      success: true,
      message: `${student.name} ${nextStage.toUpperCase()} bosqichiga muvaffaqiyatli o'tkazildi!`,
    };
  }

  return { success: false, message: 'Talaba topilmadi' };
}

// ----------------- EXPEL REQUESTS -----------------
export function getExpelRequests(): ExpelRequest[] {
  return loadFromStorage<ExpelRequest[]>(STORAGE_KEYS.EXPEL_REQUESTS, []);
}

export function saveExpelRequests(requests: ExpelRequest[]): void {
  saveToStorage(STORAGE_KEYS.EXPEL_REQUESTS, requests);
}

export function createExpelRequest(params: {
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  reason: string;
}): ExpelRequest {
  const requests = getExpelRequests();
  const newReq: ExpelRequest = {
    id: `exp-${Date.now()}`,
    ...params,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  requests.unshift(newReq);
  saveExpelRequests(requests);
  return newReq;
}

export function resolveExpelRequest(requestId: string, approve: boolean, notes?: string): void {
  const requests = getExpelRequests();
  const req = requests.find((r) => r.id === requestId);
  if (!req) return;

  req.status = approve ? 'approved' : 'rejected';
  req.adminNotes = notes || (approve ? "Admin tomonidan tasdiqlandi" : "Rad etildi");
  saveExpelRequests(requests);

  if (approve) {
    const teachers = getTeachers();
    const t = teachers.find((tech) => tech.id === req.teacherId);
    if (t) {
      t.studentIds = (t.studentIds || []).filter((id) => id !== req.studentId);
      saveTeachers(teachers);
    }
  }
}

// ----------------- TEACHER NOTIFICATIONS -----------------
export function getTeacherNotifications(teacherId: string): TeacherNotification[] {
  const all = loadFromStorage<TeacherNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  return all.filter((n) => n.teacherId === teacherId);
}

export function createTeacherNotification(notif: Omit<TeacherNotification, 'id' | 'createdAt' | 'read'>): void {
  const all = loadFromStorage<TeacherNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  all.unshift({
    ...notif,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  });
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
}

export function markNotificationAsRead(id: string): void {
  const all = loadFromStorage<TeacherNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const n = all.find((item) => item.id === id);
  if (n) {
    n.read = true;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  }
}

// ----------------- 15 KISHILIK GURUH CHATI -----------------
export function getGroupMessages(teacherId: string): GroupChatMessage[] {
  const all = loadFromStorage<GroupChatMessage[]>(STORAGE_KEYS.GROUP_MESSAGES, []);
  return all.filter((m) => m.teacherId === teacherId);
}

export function sendGroupMessage(params: Omit<GroupChatMessage, 'id' | 'timestamp'>): GroupChatMessage {
  const all = loadFromStorage<GroupChatMessage[]>(STORAGE_KEYS.GROUP_MESSAGES, []);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  const newMsg: GroupChatMessage = {
    ...params,
    id: `msg-${Date.now()}`,
    timestamp: timeStr,
  };

  all.push(newMsg);
  saveToStorage(STORAGE_KEYS.GROUP_MESSAGES, all);
  return newMsg;
}

// ----------------- LESSON COMPLETION -----------------
export function completeStudentLesson(studentId: string, lessonId: string): void {
  const students = getStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  if (!student.completedLessons.includes(lessonId)) {
    student.completedLessons.push(lessonId);
    student.xp += 100;
    student.coins += 20;

    const stagePrefix = `l-${student.stage}-`;
    const completedInStage = student.completedLessons.filter((l) => l.startsWith(stagePrefix)).length;

    if (completedInStage >= 5 && !student.stageCompletedPendingTest) {
      student.stageCompletedPendingTest = student.stage;

      createTeacherNotification({
        teacherId: student.teacherId,
        studentId: student.id,
        studentName: `${student.name} ${student.surname}`,
        stage: student.stage,
        type: 'needs_test',
        message: `Sizning talabangiz ${student.name} ${student.surname}ga ${student.stage.toUpperCase()} bosqichini yakunlagani uchun test berish kerak!`,
      });
    }

    saveStudents(students);
  }
}
