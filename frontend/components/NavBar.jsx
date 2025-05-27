import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import UserModal from "./UserModal";
import { useState, useEffect } from "react";

async function getUserInfo() {
  console.log("in getuserinfo");
  const res = await fetch("http://localhost:3000/private/api/user-data", {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  console.log(res);
  console.log(data);
  return data;
}

function NavBar() {
  const navigate = useNavigate();
  const goDash = () => {
    navigate("/");
  };
  const [open, setOpen] = useState(false);
  function handleClick() {
    setOpen((open) => !open);
  }

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const data = await getUserInfo();
      setUserInfo(data);
      console.log("user info is", userInfo); // or setState(userInfo)
    }

    fetchData();
  }, []);

  return (
    <div className={styles.navbar}>
      <button onClick={goDash}>
        <p className={styles.companyName}>THINKMAIL</p>
      </button>
      <div className={styles.searchBar}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
        </svg>

        <input type="text" placeholder="Search Here" />
      </div>

      <div className={styles.profile} onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
        </svg>
        <UserModal isOpen={open} user={userInfo} />
      </div>
    </div>
  );
}

export default NavBar;
