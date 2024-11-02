// src/app/api/admin/users/route.js
import { getSession } from 'next-auth/react';
import User from '../../../models/user';

export async function GET(req) {
  const session = await getSession({ req });
  
  // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
  if (!session || session.user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const users = await User.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response('Error fetching users', { status: 500 });
  }
}
// src/app/api/admin/users/route.js
import { getSession } from 'next-auth/react';
import User from '../../../models/user';

export async function GET(req) {
  const session = await getSession({ req });
  
  // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
  if (!session || session.user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const users = await User.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response('Error fetching users', { status: 500 });
  }
}
