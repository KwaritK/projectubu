import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkBanStatus = async () => {
      if (session?.user?.id) {
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
            router.push(`/login?error=${encodeURIComponent('บัญชีของคุณถูกระงับการใช้งาน')}`);
          }
        } catch (error) {
          console.error('Error checking ban status:', error);
        }
      }
    };

    const intervalId = setInterval(checkBanStatus, 60000); // ตรวจสอบทุก 1 นาที

    return () => clearInterval(intervalId);
  }, [session, router]);

  return <Component {...pageProps} />;
}

export default MyApp;