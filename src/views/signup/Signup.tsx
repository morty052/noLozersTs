import { useState } from "react";
import { Button } from "@/components";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "insomnia/8.0.0",
      },
      body: `{"email":"${email}","password":"${password}", "username":"${username}"}`,
    };

    if (!email || !password) {
      return;
    }

    try {
      fetch("http://localhost:3000/signup", options)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          localStorage.setItem("username", username);
          window.location.assign(`/menu`);
        });
    } catch (error) {
      console.log(error);
    }
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
          <div className="flex flex-col">
            <label htmlFor="username">Choose your username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border-b p-2"
              placeholder="username"
              type="text"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <label htmlFor="password">create your password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border-b p-2"
              placeholder="password"
              type="password"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <Button type="submit" onClick={(e) => handleSignUp(e)} className="">
            Sign Up
          </Button>
        </form>
      </section>
    </main>
  );
}

export default SignUp;
