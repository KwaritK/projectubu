"use client";

import React from 'react'
import Image from 'next/image'
import map from '/public/asset/MAP.png';

function page() {
  return (
    <div>
      <Image src={map}></Image>
    </div>
  )
}

export default page
