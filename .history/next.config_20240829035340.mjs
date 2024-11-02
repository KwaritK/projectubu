/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|mp3|ogg)$/i,
        type: 'asset/resource'
      })
      return config
    },
    // เพิ่ม configuration สำหรับ assetPrefix ถ้าจำเป็น
    // assetPrefix: process.env.NODE_ENV === 'production' ? '/your-prefix' : '',
  }
  
  export default nextConfig