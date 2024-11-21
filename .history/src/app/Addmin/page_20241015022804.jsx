import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from '../../../public/asset/Navbar';
import BanUser from '../components/BanModal';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      return <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>;
    }

    return <WrappedComponent {...props} />;
  };
};

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/report');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedReports = reports
    .filter(report => 
      report.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">
      <p className="text-red-500 text-xl">Error: {error}</p>
    </div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ข้อมูลรายงานผู้ใช้</h1>
          
          <div className="mb-4 flex justify-between items-center">
            <Input
              type="text"
              placeholder="ค้นหารายงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="เรียงตาม" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">วันที่</SelectItem>
                <SelectItem value="user">ชื่อผู้ใช้</SelectItem>
                <SelectItem value="reason">เหตุผล</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">ชื่อผู้ใช้</TableHead>
                  <TableHead className="w-1/6">Email</TableHead>
                  <TableHead className="w-1/6">เหตุผล</TableHead>
                  <TableHead className="w-1/6">ข้อมูลเพิ่มเติม</TableHead>
                  <TableHead className="w-1/6">สถานะ</TableHead>
                  <TableHead className="w-1/6">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedReports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.user}</TableCell>
                    <TableCell>{report.email}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{report.additionalInfo || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                        report.status === 'reviewed' ? 'bg-blue-200 text-blue-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {report.status || 'pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <BanUser reportId={report._id} onBanSuccess={fetchReports} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminReportsPage);