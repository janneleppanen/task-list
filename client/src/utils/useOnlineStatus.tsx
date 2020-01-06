import { useEffect, useState } from "react";

export default function useOnlineStatus() {
  const [isOnline, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  });

  const updateOnlineStatus = () => {
    setOnline(navigator.onLine);
  };

  return isOnline;
}
