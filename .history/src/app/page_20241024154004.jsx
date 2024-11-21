"use client";

import Image from 'next/image';
import Navbar from "../../public/asset/Navbar";
import t from '/public/asset/title.png';
import bb from '/public/asset/2.png';
import button from '/public/asset/logbut.png'; 
import button2 from '/public/asset/regisbut.png'; 
import Link from 'next/link';
import './styles.css';

const HomePage = () => {
  return (
    <main className="page-container">
      <Navbar />
      <div className="content-container">
        <Image src={t} alt="title" className='title-image' width={600} height={300} />
        <div className="text-container">
          <h1>สวัสดีครับบ เรียนเชิญทุกท่านเข้าสู่งานวัดในรูปแบบใหม่</h1>
          <h3>เพื่อพบปะพูดคุยกับผู้คนแปลกหน้าที่ไม่รู้จัก</h3>
        </div>
        <Image src={bb} alt="back" width={600} height={300} />
      </div>
      <h2>เพื่อพบปะพูดคุยกับผู้คนแปลกหน้าที่ไม่รู้จัก</h2>
      <div className="button-container">
        <div className="button-group">
          <Link href="/login">
            <button className="custom-button">
              <Image src={button} alt="logButton" width={300} height={100} />
            </button>
          </Link>
          <Link href="/register">
            <button className="custom-button">
              <Image src={button2} alt="regisButton" width={300} height={100} />
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
};

export default HomePage;
