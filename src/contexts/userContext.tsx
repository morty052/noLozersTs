import supabase from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type User = {
  // Define the type for the user object
  // Modify this type according to your actual user object structure
  user: User;
  session: Session;
};

type ContextValue = {
  user: User | null;
  username: string;
  signin: (
    email: string,
    password: string
  ) => Promise<{ user: User; session: Session } | undefined>;
};

const UserContext = createContext<ContextValue>({
  user: null,
  HandleSignin: async () => undefined,
});

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [username, setusername] = useState<string>("");

  // async function setUser(user: User | null) {
  //   const
  //   if (!user) {

  //   }
  // }

  async function HandleSignin(email: string, password: string) {
    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const { user: User } = user;
      const { role, email } = User;
      console.log(role);
      setusername(email as string);

      return user;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  useEffect(() => {
    if (username) {
      return;
    }
    async function fetchUser() {
      // const user = supabase.auth.onAuthStateChange((event, session) => {
      //   if (event === "SIGNED_IN") {
      //     setusername(session?.user?.email as string);
      //   }
      // });

      const { data } = await supabase.auth.getUser();
      const { user: userdata } = data;
      const email = userdata?.email;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "insomnia/8.0.0",
        },
        body: `{"email":"${email}"}`,
      };

      await fetch("http://localhost:3000/getuser", options)
        .then((response) => response.json())
        .then((response) => setusername(response.username))
        .catch((err) => console.error(err));
    }
    fetchUser();

    return () => {
      ("");
    };
  }, [username]);

  return (
    <UserContext.Provider
      value={{ user: null, signin: HandleSignin, username: username }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
