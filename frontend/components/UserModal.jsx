import React from "react";
import { LogOut, X } from "lucide-react";
import styles from "./UserModal.module.css";

const UserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;
  console.log("user is", user);
  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.userInfo}>
          <img className={styles.avatar} src={user?.picture} />

          <h2 className={styles.userName}>{user?.name || "Usger Name"}</h2>
          <p className={styles.userEmail}>
            {user?.email || "user@example.com"}
          </p>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserModal;
