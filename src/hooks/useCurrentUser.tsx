import { useUser } from "@clerk/clerk-react";

function useCurrentUser(): { username: string | null | undefined } {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return {
    username: user?.username,
  };
}

export default useCurrentUser;
