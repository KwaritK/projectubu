
"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Navbar from '../../../public/asset/Navbar';
import ban

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
        
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-center w-1/5">ชื่อผู้ใช้</th>
                  <th className="py-2 px-4 border-b text-center w-1/5">Email</th>
                  <th className="py-2 px-4 border-b text-center w-1/5">เหตุผล</th>
                  <th className="py-2 px-4 border-b text-center w-1/5">ข้อมูลเพิ่มเติม</th>
                  <th className="py-2 px-4 border-b text-center w-1/5"></th>
                  
                  
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-center">{report.user}</td>
                    <td className="py-3 px-4 border-b text-center">{report.email}</td>
                    <td className="py-3 px-4 border-b text-center">{report.reason}</td>
                    <td className="py-3 px-4 border-b text-center">{report.additionalInfo || 'N/A'}</td>
                    
                    <td className="py-3 px-4 border-b text-center">
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm">
                        แบนผู้ใช้
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  </div>

  );
}

export default AdminReportsPage;
