"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from '../../../public/asset/Navbar';
import BanUser from '../components/BanModal';

// Higher Order Component for admin authentication
const withAdminAuth = (WrappedComponent) => {
  return function WithAdminAuth(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      if (status === 'loading') return;
      if (!session || session.user.role !== 'admin') {
        router.push('/map');
      } else {
        setIsAdmin(true);
      }
    }, [session, status, router]);

    if (status === 'loading' || !isAdmin) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch('/api/report');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleBanSuccess = useCallback(() => {
    fetchReports();
  }, [fetchReports]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-500';
      case 'resolved': return 'text-green-500';
      case 'dismissed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return <p>Loading reports...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ข้อมูลรายงานผู้ใช้</h1>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-center">ผู้ถูกรายงาน</th>
                  <th className="py-2 px-4 border-b text-center">ผู้รายงาน</th>
                  <th className="py-2 px-4 border-b text-center">เหตุผล</th>
                  <th className="py-2 px-4 border-b text-center">ข้อมูลเพิ่มเติม</th>
                  <th className="py-2 px-4 border-b text-center">สถานะ</th>
                  <th className="py-2 px-4 border-b text-center">วันที่รายงาน</th>
                  <th className="py-2 px-4 border-b text-center">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-center">{report.reportedUser.email}</td>
                    <td className="py-3 px-4 border-b text-center">{report.reportedBy.email}</td>
                    <td className="py-3 px-4 border-b text-center">{report.reason}</td>
                    <td className="py-3 px-4 border-b text-center">{report.additionalInfo || 'N/A'}</td>
                    <td className={`py-3 px-4 border-b text-center ${getStatusColor(report.status)}`}>
                      {report.status}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {new Date(report.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <BanUser userId={report.reportedUser._id} onBanSuccess={handleBanSuccess} />
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

// Wrap the AdminReportsPage with the admin authentication HOC
export default withAdminAuth(AdminReportsPage);