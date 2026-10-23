import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

// 1. Users table (Students, Staff & Admin)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('student'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Staff members table (Admin adds staff with generated credentials)
export const staffMembers = pgTable('staff_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  login: text('login').notNull().unique(),
  password: text('password').notNull(),
  assignedBy: text('assigned_by').default('legend_o1'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Staff & Admin private chat messages
export const staffMessages = pgTable('staff_messages', {
  id: serial('id').primaryKey(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull(), // 'admin' | 'staff'
  senderLogin: text('sender_login').notNull(),
  text: text('text').notNull(),
  isUrgent: text('is_urgent').default('false'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. One-time 3D Gift claims (Only 1 time per student: hamma o'quvchiga 1 marta beriladi)
export const claimedGifts = pgTable('claimed_gifts', {
  id: serial('id').primaryKey(),
  studentName: text('student_name').notNull(),
  studentEmail: text('student_email').notNull().unique(), // unique constraint guarantees 1 per student
  giftCode: text('gift_code').notNull(),
  giftTitle: text('gift_title').notNull(),
  claimedAt: timestamp('claimed_at').defaultNow(),
});

// 5. Student Projects repository
export const studentProjects = pgTable('student_projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  studentName: text('student_name').notNull(),
  studentEmail: text('student_email').notNull(),
  studentCity: text('student_city'),
  category: text('category').notNull(),
  description: text('description'),
  htmlCode: text('html_code').notNull(),
  status: text('status').default('pending'),
  likes: integer('likes').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
