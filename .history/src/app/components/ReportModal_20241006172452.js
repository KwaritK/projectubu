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
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">รีพอร์ตผู้ใช้</h2>
        <p className="mb-4">คุณต้องการรีพอร์ต {user} ใช่หรือไม่?</p>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleReport}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            รีพอร์ต
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;