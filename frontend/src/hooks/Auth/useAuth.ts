'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const cookies = document.cookie.split('; ');
      const usernameCookie = cookies.find((row) => row.startsWith('username='));

      if (usernameCookie) {
        const name = decodeURIComponent(usernameCookie.split('=')[1]);
        setUsername(name);
        setIsLoggedIn(true);
      } else {
        setUsername(null);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return { isLoggedIn, username };
}
