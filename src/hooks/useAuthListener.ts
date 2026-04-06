import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "api/firebase";
import { useAuthStore, useDBStore } from "db";
import { getUser } from "api/user";
import { useNavigate } from "react-router-dom";
import logger from "utils/logger";

export default function useAuthListener() {
  const navigate = useNavigate();

  const { setUser, clear } = useAuthStore();
  const { setUser: resetUser } = useDBStore();

  useEffect(() => {
    const authUser = async (uid: string) => {
      try {
        const user = await getUser(uid);

        if (user) {
          resetUser(user);
        }
      } catch (error) {
        logger.error("Failed to reset user:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });

        await authUser(firebaseUser.uid);
      } else {
        clear();
        navigate("/login", { replace: true });
      }
    });

    return unsubscribe;
  }, [setUser, clear, navigate, resetUser]);
}
