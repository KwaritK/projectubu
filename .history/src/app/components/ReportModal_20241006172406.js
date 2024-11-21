"use client";

import React from 'react';

const ReportModal = ({ isOpen, closeModal, user, onSubmitReport }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const reasons = [
    'เนื้อหาไม่เหมาะสม',
    'การละเมิดลิขสิทธิ์',
    'การคุกคาม',
    'สแปม',
    'อื่นๆ'
  ];
  const handleSubmit = () => {
    const reportData = {
      reportedUser: user,
      reason: selectedReason === 'อื่นๆ' ? customReason : selectedReason,
      timestamp: new Date().toISOString()
    };
    onSubmitReport(reportData);
    closeModal();
  };

 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">รายงานผู้ใช้: {user}</h2>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">เลือกสาเหตุ:</label>
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`mr-2 mb-2 px-3 py-1 rounded ${
                selectedReason === reason ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
        
        {selectedReason === 'อื่นๆ' && (
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="กรุณาระบุสาเหตุ"
            className="w-full p-2 border rounded mb-4"
            rows={3}
          />
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            disabled={!selectedReason || (selectedReason === 'อื่นๆ' && !customReason)}
          >
            ยืนยันการรายงาน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;