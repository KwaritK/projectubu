// src/app/admin/users/page.jsx
import { useEffect, useState } from 'react';
// src/middleware.js
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });
  if (!token || token.role !== 'admin') {
    return new Response("Unauthorized", { status: 401 });
  }
}


const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/admin/user/${id}`, { method: 'DELETE' });
    setUsers(users.filter(user => user._id !== id));
  };

  return (
    <div>
      <h1>User Management</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} ({user.email}) 
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsersPage;
