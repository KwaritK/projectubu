"use client"

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

const AdminUsersPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const session = await getSession();
      if (!session || session.user.role !== 'admin') {
        window.location.href = '/login'; // redirect if not admin
      } else {
        setIsAdmin(true);
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Management</h1>
      {/* render list of users */}
    </div>
  );
};

export default AdminUsersPage;
