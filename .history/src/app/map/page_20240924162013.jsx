"use client";

import React from 'react'
import Image from 'next/image'
import map from '/public/asset/MAP.png';

function page() {
    
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image
        alt="Mountains"
       
        src={map}
        sizes="100vw"
        // Make the image display full width
        style={{
          width: 'auto',
          height: 'auto',
        }}
      />
    </div>
  )
}

export default page
