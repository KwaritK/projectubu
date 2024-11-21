import React, { useState, useCallback } from 'react';

function BanUser({ userId, onBanSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [banDuration, setBanDuration] = useState({ days: 0, hours: 0, minutes: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = useCallback(() => setIsOpen(true), []);
  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setBanDuration({ days: 0, hours: 0, minutes: 0 });
    setError('');
  }, []);

  const handleInputChange = useCallback((unit, value) => {
    setBanDuration(prev => ({ ...prev, [unit]: Math.max(0, parseInt(value) || 0) }));
  }, []);

  const handleBanUser = useCallback(async () => {
    const { days, hours, minutes } = banDuration;
    if (days === 0 && hours === 0 && minutes === 0) {
      setError('กรุณาระบุระยะเวลาแบนอย่างน้อย 1 นาที');
      return;
    }

    setIsLoading(true);
    setError('');

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
     
    } finally {
      setIsLoading(false);
    }
  }, [userId, banDuration, onBanSuccess, handleCloseModal]);

  return (
    <>
      <button onClick={handleOpenModal} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
        แบนผู้ใช้
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">กำหนดระยะเวลาแบน</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {['days', 'hours', 'minutes'].map((unit) => (
              <div key={unit} className="mb-4">
                <label className="block mb-2">จำนวน{unit === 'days' ? 'วัน' : unit === 'hours' ? 'ชั่วโมง' : 'นาที'}:</label>
                <input
                  type="number"
                  min="0"
                  value={banDuration[unit]}
                  onChange={(e) => handleInputChange(unit, e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleCloseModal} 
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                disabled={isLoading}
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleBanUser} 
                className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยันการแบน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BanUser;