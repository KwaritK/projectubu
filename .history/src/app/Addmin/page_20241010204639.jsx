
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
    
    <div>
      <Navbar session={session} />
      <h2>รายงานผู้ใช้</h2>
      <table>
        <thead>
          <tr>
            <th>ชื่อผู้ใช้</th>
            <th>Email</th>
            <th>เหตุผล</th>
            <th>ข้อมูลเพิ่มเติม</th>
            <th>วันที่</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.user}</td>
              <td>{report.email}</td>
              <td>{report.reason}</td>
              <td>{report.additionalInfo || 'N/A'}</td>
              <td>{new Date(report.timestamp).toLocaleString()}</td>
              <td>
                <button>แบนผู้ใช้</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );

  <div className="bg-gray-100 min-h-screen">
  <Navbar session={session} />
  <div className="container mx-auto py-5 px-4">
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-4xl mx-auto">
    <Link href="/map">
    <h1 className="text-4xl text-center font-bold mb-6">รายงานผู้ใช้</h1>
    </Link> 
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-2/3 px-3 mb-6">
        <h2 className="text-2xl font-semibold mb-2">
            Welcome: {session?.user?.email}
          </h2>

          <div className="w-full sm:w-1/1 px-2 mb-4">
          <CreateRoomButton />
        </div>
        



          <form onSubmit={handleJoinRoom} className="mb-4">
            <input
              type="text"
              placeholder="กรอกรหัสห้อง 5 ตัว"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
              maxLength={5}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              เข้าร่วมห้อง
            </button>
          </form>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>
       
      </div>
    </div>
    </div>
  
);
};

}

export default AdminReportsPage;
