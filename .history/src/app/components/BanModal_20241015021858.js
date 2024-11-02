import React, { useState } from 'react';

function BanUser({ userId, onBanSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [banDuration, setBanDuration] = useState({ days: 0, hours: 0, minutes: 0 });
  const [error, setError] = useState('');

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    setIsOpen(false);
    setBanDuration({ days: 0, hours: 0, minutes: 0 });
    setError('');
  };

  const handleBanUser = async () => {
    const { days, hours, minutes } = banDuration;
    if (days === 0 && hours === 0 && minutes === 0) {
      setError('กรุณาระบุระยะเวลาแบนอย่างน้อย 1 นาที');
      return;
    }

    try {
      const response = await fetch('/api/banUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...banDuration }),
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      const data = await response.json();
      onBanSuccess(data.banEnd);
      handleCloseModal();
    } catch (err) {
      console.error("Error banning user:", err);
      setError("เกิดข้อผิดพลาดในการแบนผู้ใช้ โปรดลองอีกครั้ง");
    }
  };

  return (
    <>
      <button onClick={handleOpenModal} className="bg-red-500 text-white px-3 py-1 rounded">
        แบนผู้ใช้
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">กำหนดระยะเวลาแบน</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {['days', 'hours', 'minutes'].map((unit) => (
              <div key={unit} className="mb-4">
                <label className="block mb-2">จำนวน{unit === 'days' ? 'วัน' : unit === 'hours' ? 'ชั่วโมง' : 'นาที'}:</label>
                <input
                  type="number"
                  min="0"
                  value={banDuration[unit]}
                  onChange={(e) => setBanDuration({ ...banDuration, [unit]: parseInt(e.target.value) || 0 })}
                  className="border p-2 w-full"
                />
              </div>
            ))}
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
    </>
  );
}

export default BanUser;