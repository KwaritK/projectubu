
"use client"

import React, { useEffect, useState } from 'react';

function AdminReportsPage() {
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
        setReports(data);
      } catch (err) {
        setError(err.message);
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
              <td>{report.reason}</td>
              <td>{report.additionalInfo}</td>
              <td>{new Date(report.date).toLocaleString()}</td>
              <td>
                <button>แบนผู้ใช้</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReportsPage;