import { useState } from 'react';

const BanUser = ({ userId }) => {
    const [banDuration, setBanDuration] = useState(7); // กำหนดค่าเริ่มต้นเป็น 7 วัน

    const banUser = async (userId, banDuration) => {
        try {
            const banEndDate = new Date(Date.now() + banDuration * 24 * 60 * 60 * 1000);
            const response = await axios.post('/api/banUser', {
                userId: userId,
                isBanned: true,
                banEnd: banEndDate,
            });
            if (response.status === 200) {
                alert('ผู้ใช้ถูกแบนเรียบร้อยแล้ว');
            } else {
                alert('เกิดข้อผิดพลาดในการแบนผู้ใช้');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            alert('ไม่สามารถแบนผู้ใช้ได้');
        }
    };

    return (
        <div>
            <label htmlFor="banDuration" className="block text-sm font-medium text-gray-700">
                ระยะเวลาการแบน (วัน)
            </label>
            <select
                id="banDuration"
                value={banDuration}
                onChange={(e) => setBanDuration(Number(e.target.value))}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
                <option value={1}>1 วัน</option>
                <option value={7}>7 วัน</option>
                <option value={30}>30 วัน</option>
                <option value={90}>90 วัน</option>
            </select>
            
            <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm mt-4"
                onClick={() => banUser(userId, banDuration)}
            >
                แบนผู้ใช้
            </button>
        </div>
    );
};


export default BanUser
