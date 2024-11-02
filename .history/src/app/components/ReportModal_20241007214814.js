"use client";

import React, { useState } from 'react';

const ReportModal = ({ isOpen, closeModal, user, onSubmitReport }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  if (!isOpen) return null;

  const reasons = [
    'เนื้อหาไม่เหมาะสม',
    'การละเมิดลิขสิทธิ์',
    'การคุกคาม',
    'สแปม',
  ];

  const handleReport = () => {
    const reportData = {
      user,
      reason: selectedReason,
      additionalInfo,
    };
    console.log('Report submitted:', reportData);
    onSubmitReport(reportData);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">รีพอร์ตผู้ใช้</h2>
        <p className="mb-4">คุณต้องการรีพอร์ต {user} ใช่หรือไม่?</p>
        
        <label className="block mb-2 text-sm font-medium">
          เลือกเหตุผล:
        </label>
        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">-- กรุณาเลือกเหตุผล --</option>
          {reasons.map((reason, index) => (
            <option key={index} value={reason}>{reason}</option>
          ))}
        </select>

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
