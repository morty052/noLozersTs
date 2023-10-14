import { useState } from "react";
import { Button } from "@/components";
import { useUserContext } from "@/contexts/userContext";
import { SignIn } from "@clerk/clerk-react";

function LoginBackup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { signin } = useUserContext();

  async function handleLogin(e) {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `{"email":"${email}","password":"${password}", "username":"${username}"}`,
    };

    try {
      if (!email || !password) {
        throw "Please enter email and password";
      }

      await signin(email, password).then(() => window.location.assign(`/menu`));
    } catch (error) {
      console.log(error);
    }

    // try {

    //       fetch('http://localhost:3000/login', options)
    //         .then(response => response.json())
    //         .then(response => {
    //         console.log(response)
    //         localStorage.setItem("username", username)
    //         window.location.assign(`/menu`)
    //         })

    // } catch (error) {
    //     console.log(error)
    // }
  }

  return (
    <main className="min-h-screen max-w-7xl bg-gray-200 p-4">
      <section className="mx-auto">
        <form className="flex flex-col gap-y-6" action="">
          {/* EMAIL */}
          <div className="flex flex-col">
            <label htmlFor="email">Enter your email</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border-b p-2"
              placeholder="email"
              type="text"
            />
          </div>

          {/* USERNAME */}
          {/* <div className="flex flex-col">
            <label htmlFor="username">Choose your username</label>
            <input
            id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="rounded-lg border-b p-2"
              placeholder="username"
              type="text"
            />
          </div> */}

          {/* PASSWORD */}
          <div className="flex flex-col">
            <label htmlFor="password">Enter your password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border-b p-2"
              placeholder="password"
              type="text"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <Button type="submit" onClick={(e) => handleLogin(e)} className="">
            Log in
          </Button>
        </form>
      </section>
    </main>
  );
}

function Login() {
  return <SignIn redirectUrl={"/menu"} />;
}

export default Login;
