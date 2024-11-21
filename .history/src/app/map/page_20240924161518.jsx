"use client";

import React from 'react'
import Image from 'next/image'
import map from '/public/asset/MAP.png';

function page() {
    const
  return (
    <div>
      <Image src={map} width={100} height={100}></Image>
      style={{
      backgroundImage: `url(${bg.src})`,
      width: '100%',
      height: '100%',
    }}
    </div>
  )
}

export default page
