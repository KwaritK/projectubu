import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket;

function MyApp({ Component, pageProps }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      if (!socket) {
        socket = io();
      }

      socket.on('connect', () => {
        socket.emit('joinUserRoom', session.user.id);
      });

      socket.on('userBanned', ({ reason, banEndDate }) => {
        router.push(`/banned?reason=${encodeURIComponent(reason)}&endDate=${encodeURIComponent(banEndDate)}`);
      });

      const checkBanStatus = async () => {
        try {
          const res = await fetch('/api/checkBanStatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.user.id }),
          });
          const data = await res.json();
          if (data.isBanned) {
            router.push(`/banned?reason=${encodeURIComponent(data.reason)}&endDate=${encodeURIComponent(data.banEnd)}`);
          }
        } catch (error) {
          console.error('Error checking ban status:', error);
        }
      };
    
      const intervalId = setInterval(checkBanStatus, 60000); // ตรวจสอบทุก 1 นาที
    
      return () => clearInterval(intervalId);
    } [session, router]);

  return <Component {...pageProps} />;
}

export default MyApp;