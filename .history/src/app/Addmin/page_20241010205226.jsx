
"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Navbar from '../../../public/asset/Navbar';

function AdminReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/report');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setReports(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
  <Navbar session={session} />
  <div className="container mx-auto py-8 px-4">
    <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ข้อมูลรายงานผู้ใช้</h1>
       

       
    </div>
  </div>
  </div>
    
   
  );

}

export default AdminReportsPage;
