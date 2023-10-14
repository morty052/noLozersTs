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
  signup: (
    email: string,
    password: string
  ) => Promise<{ user: User; session: Session } | undefined>;
};

const UserContext = createContext<ContextValue>({
  user: null,

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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

      // const { user: User } = user;
      // const { role, email } = User;
      // console.log(role);
      setusername(email as string);

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async function HandleSignup(email: string, password: string) {
    try {
      const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // const { user: User } = user;
      // const { role, email: UserEmail } = User;
      console.log(user);
      // setusername(UserEmail as string);

      return user;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  return (
    <UserContext.Provider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value={{
        user: null,
        signin: HandleSignin,
        signup: HandleSignup,
        username: username,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
