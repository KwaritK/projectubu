
"use"
import React, { useEffect, useState } from 'react';

function AdminReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/api/report/all')
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) => console.error('Error fetching reports:', error));
  }, []);

  return (
    <div>
      <h2>รายงานผู้ใช้</h2>
      <table>
        <thead>
          <tr>
            <th>ชื่อผู้ใช้</th>
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
