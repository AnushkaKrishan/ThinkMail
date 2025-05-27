import { useState } from "react";
import styles from "./Login.module.css";
import login_hero from "../public/login_hero.jpg";

function navigate(url) {
  window.location.href = url;
}

async function auth() {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
  });
  const data = await response.json();
  console.log(data);
  navigate(data.URL);
}

function LogIn() {
  return (
    <section className={styles.container}>
      <div className={styles.companyName}>THINKMAIL</div>
      <img className={styles.img} src={login_hero} />
      <div className={styles.box}>
        <div className={styles.signupBox}>
          <h1>Log In</h1>
          <p> A cleaner inbox, daily. </p>
          <button
            className={styles.signIn}
            onClick={() => {
              auth();
            }}
          >
            <p className={styles.existing}>
              Log In with <span>Google</span>
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}

export default LogIn;
