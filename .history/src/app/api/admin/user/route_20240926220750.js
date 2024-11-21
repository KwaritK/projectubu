// src/app/api/admin/users/route.js
import User from '../../../models/user';

export async function GET(req) {
  try {
    const users = await User.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response("Error fetching users", { status: 500 });
  }
}
