import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket; // Define socket globally to prevent multiple connections

function MyApp({ Component, pageProps }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      // Only initialize socket if not already initialized
      if (!socket) {
        socket = io(); // If the server is hosted elsewhere, you can pass the URL like io('http://localhost:3000')
      }

      // Join user's personal room
      socket.on('connect', () => {
        socket.emit('joinUserRoom', session.user.id);
      });

      // Handle banned user notification from server
      socket.on('userBanned', ({ reason, banEndDate }) => {
        router.push(`/banned?reason=${encodeURIComponent(reason)}&endDate=${encodeURIComponent(banEndDate)});
      });

      // Check user's ban status at intervals
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
            router.push(`/banned?reason=${encodeURIComponent(data.reason)}&endDate=${encodeURIComponent(data.banEnd)});
          }
        } catch (error) {
          console.error('Error checking ban status:', error);
        }
      };

      // Set an interval to check the ban status every minute
      const intervalId = setInterval(checkBanStatus, 60000); // 60 seconds

      // Cleanup function: clear interval and disconnect socket
      return () => {
        clearInterval(intervalId);
        if (socket) {
          socket.disconnect();
          socket = null; // Reset socket to avoid multiple connections
        }
      };
    }
  }, [session, router]);

  return <Component {...pageProps} />;
}

export default MyApp;