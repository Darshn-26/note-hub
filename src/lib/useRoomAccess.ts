// useRoomAccess.ts
import { useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export function useRoomAccess(roomId: string) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user || !roomId) return;

    const checkAccess = async () => {
      const userEmail = user.emailAddresses[0].toString();
      const roomRef = doc(db, "users", userEmail, "rooms", roomId);
      
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        router.push("/");
      }
    };

    // Check access immediately and set up an interval to keep checking
    checkAccess();
    const intervalId = setInterval(checkAccess, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [user, roomId, router]);
}