import React, { useState, useCallback } from 'react';

const ReportModal = ({ isOpen, closeModal, user, userEmail }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reasons = [
    'ใช้ถ้อยคำไม่เหมาะสม',
  ,
    'การคุกคาม',
    'สแปม',
  ];

  const handleReport = useCallback(async () => {
    if (!selectedReason) {
      setError('กรุณาเลือกเหตุผลในการรีพอร์ต');
      return;
    }

    setIsLoading(true);
    setError('');

    const reportData = {
      reportedUserEmail: userEmail,
      reason: selectedReason,
      additionalInfo,
    };

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      const data = await response.json();
      console.log(data.message);
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      setError('คุณไม่สามารถรีพอร์ตตัวเองได้');
    } finally {
      setIsLoading(false);
    }
  }, [selectedReason, additionalInfo, userEmail, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">รีพอร์ตผู้ใช้</h2>
        <p className="mb-4">คุณต้องการรีพอร์ต {user} ใช่หรือไม่?</p>
        
        <label className="block mb-2 text-sm font-medium">
          เลือกเหตุผล:
        </label>
        <select
          value={selectedReason}
          onChange={(e) => {
            setSelectedReason(e.target.value);
            setError('');
          }}
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
        >
          <option value="">-- กรุณาเลือกเหตุผล --</option>
          {reasons.map((reason, index) => (
            <option key={index} value={reason}>{reason}</option>
          ))}
        </select>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="block mb-2 text-sm font-medium">
          ข้อมูลเพิ่มเติม (ถ้ามี):
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="อธิบายเพิ่มเติม..."
          rows="3"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleReport}
            className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'กำลังส่งรีพอร์ต...' : 'รีพอร์ต'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;