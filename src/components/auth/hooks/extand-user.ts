// hooks/useCurrentUser.ts
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User } from "@prisma/client";

export const ExtendUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") {
      setUser(undefined); // Indicates that the session is loading
    } else if (session?.user?.id) {
      // Fetch full user data from API
      fetch(`/api/users/${session.user.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          setUser(null);
        });
    } else {
      setUser(null); // User is not authenticated
    }
  }, [session, status]);

  return user;
};
