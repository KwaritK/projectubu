// src/app/api/admin/user/[id]/route.js
import User from '../../../models/user';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response("Error updating user", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await User.findByIdAndDelete(id);
    return new Response("User deleted", { status: 200 });
  } catch (error) {
    return new Response("Error deleting user", { status: 500 });
  }
}
