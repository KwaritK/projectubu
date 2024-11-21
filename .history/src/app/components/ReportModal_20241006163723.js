

import React, { useState } from 'react';
import UserList from './UserList';
import ReportModal from './ReportModal';

const ParentComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [reportingUser, setReportingUser] = useState(null);

  const handleReportUser = (user) => {
    setReportingUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setReportingUser(null);
  };

  return (
    <div>
      <UserList users={['User1', 'User2', 'User3']} onReportUser={handleReportUser} />
      {isModalOpen && (
        <ReportModal user={reportingUser} onClose={closeModal} />
      )}
    </div>
  );
};

export default ParentComponent;
