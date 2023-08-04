import React, { useEffect, useState } from "react";
import "./App.css";
import { ForkForm } from "./ForkForm.js";

const CLIENT_ID = "<your github oauth app client id>";

function App() {
  const [rerender, setRerender] = useState(false);

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        CLIENT_ID +
        "&scope=user,repo"
    );
  }

  function removeUsername() {
    async function logoutApp(username) {
      await fetch("http://localhost:5000/logout?username=" + username, {
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
        });
    }
    logoutApp(localStorage.getItem("username"));
    localStorage.removeItem("username");
    setRerender(!rerender);
  }

  useEffect(() => {
    // get github code from current url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    if (codeParam && localStorage.getItem("username") === null) {
      async function storeTokenGetUsername() {
        await fetch("http://localhost:5000/getUsername?code=" + codeParam, {
          method: "GET",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            console.log(data);
            if (data.username) {
              localStorage.setItem("username", data.username);
              setRerender(!rerender);
            }
          });
      }
      storeTokenGetUsername();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("username") ? (
          <>
            <h1>Welcome {localStorage.getItem("username")}</h1>
            <button onClick={removeUsername}>Logout</button>
          </>
        ) : (
          <>
            <h1>Not Logged In</h1>
            <button onClick={loginWithGithub}>Github Login</button>
          </>
        )}
        <ForkForm />
      </header>
    </div>
  );
}

export default App;
