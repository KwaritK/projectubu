import React, { useState } from 'react';

function BanUser({ reportId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [banDuration, setBanDuration] = useState({ days: 0, hours: 0, minutes: 0 });

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setBanDuration({ days: 0, hours: 0, minutes: 0 });
  };

  const handleBanUser = async () => {
    const currentDate = new Date();

    // คำนวณวันที่แบนสิ้นสุด
    currentDate.setDate(currentDate.getDate() + parseInt(banDuration.days, 10));
    currentDate.setHours(currentDate.getHours() + parseInt(banDuration.hours, 10));
    currentDate.setMinutes(currentDate.getMinutes() + parseInt(banDuration.minutes, 10));

    try {
      const response = await fetch(`/api/banUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, banEnd: currentDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      alert("User has been banned successfully.");
      handleCloseModal();
    } catch (err) {
      console.error("Error banning user:", err);
      alert("Error banning user.");
    }
  };

  return (
    <div>
      <button onClick={handleOpenModal} className="bg-red-500 text-white px-3 py-1 rounded">
        แบนผู้ใช้
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">กำหนดระยะเวลาแบน</h2>
            <div className="mb-4">
              <label className="block mb-2">จำนวนวัน:</label>
              <input
                type="number"
                value={banDuration.days}
                onChange={(e) => setBanDuration({ ...banDuration, days: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">จำนวนชั่วโมง:</label>
              <input
                type="number"
                value={banDuration.hours}
                onChange={(e) => setBanDuration({ ...banDuration, hours: e.target.value })}
                className="border p-2 mb-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">จำนวนนาที:</label>
              <input
                type="number"
                value={banDuration.minutes}
                onChange={(e) => setBanDuration({ ...banDuration, minutes: e.target.value })}
                className="border p-2 mb-4 w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={handleCloseModal} className="bg-gray-300 px-4 py-2 rounded">
                ยกเลิก
              </button>
              <button onClick={handleBanUser} className="bg-red-500 text-white px-4 py-2 rounded">
                ยืนยันการแบน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BanUser;
