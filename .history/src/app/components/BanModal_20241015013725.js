import React, { useState } from 'react';

function BanUser({ reportId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [banDuration, setBanDuration] = useState(0); // ค่าเริ่มต้นของระยะเวลาแบน

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setBanDuration(0);
  };

  const handleBanUser = async () => {
    const currentDate = new Date();
    const banEndDate = new Date(currentDate.setDate(currentDate.getDate() + banDuration));

    try {
      const response = await fetch(`/api/banUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, banEnd: banEndDate }),
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
            <input
              type="number"
              value={banDuration}
              onChange={(e) => setBanDuration(e.target.value)}
              placeholder="จำนวนวัน"
              className="border p-2 mb-4 w-full"
            />
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
