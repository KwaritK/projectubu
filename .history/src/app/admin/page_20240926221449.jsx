
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await getSession();
      if (!session || session.user.role !== 'admin') {
        router.push('/login'); // Redirect ถ้าผู้ใช้ไม่ใช่ admin
      } else {
        setIsAdmin(true);
      }
    };

    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };

    checkAdmin();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, router]);

  if (loading) return <div>Loading...</div>;

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
