import UserList from './UserList';  // ให้แน่ใจว่าคุณ import component นี้ถูกต้อง

// ... โค้ดอื่นๆ ยังคงเหมือนเดิม ...

return (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column" }}>
    <div className="flex-1 p-4 flex flex-col">
      {/* ... ส่วนแสดงข้อความยังคงเหมือนเดิม ... */}

      <div className="flex flex-row">
        <form onSubmit={sendMessage} className="flex-grow mr-4">
          {/* ... ส่วน input และปุ่มส่งข้อความยังคงเหมือนเดิม ... */}
        </form>

        <UserList users={users} />
      </div>

      <div>
        <Link href="/welcome">
          <button className="mt-4 bg-gray-300 p-2 rounded">กลับ</button>
        </Link>
      </div>
    </div>
  </div>
);