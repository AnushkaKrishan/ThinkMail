import { useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import styles from "./Dashboard.module.css";
import EmailCard from "../components/EmailCard";

function Dashboard() {
  const arrEmailList = [
    {
      id: 0,
      senderEmail: "alice@example.com",
      senderName: "Alice Johnson",
      sentAt: "2025-05-16T09:15:00Z",
      messageSnippet: "Hi, just following up on our meeting...",
      isStarred: true,
    },
    {
      id: 1,
      senderEmail: "bbab@example.com",
      senderName: "ndbnbd Johnson",
      sentAt: "2025-05-16T09:15:00Z",
      messageSnippet: "Hi, nsbdnsbdn following up on our meeting...",
      isStarred: true,
    },
    {
      id: 2,
      senderEmail: "bob.smith@example.com",
      senderName: "Bob Smith",
      sentAt: "2025-05-15T18:45:00Z",
      messageSnippet: "Please find the attached report...",
      isStarred: false,
    },
    {
      id: 3,
      senderEmail: "carla.m@example.com",
      senderName: "Carla Mendes",
      sentAt: "2025-05-14T12:30:00Z",
      messageSnippet: "It was great seeing you yesterday!",
      isStarred: true,
    },
    {
      id: 4,
      senderEmail: "daniel.k@example.com",
      senderName: "Daniel Kim",
      sentAt: "2025-05-13T07:50:00Z",
      messageSnippet: "Don't forget about the team sync...",
      isStarred: false,
    },
    {
      id: 5,
      senderEmail: "eva.w@example.com",
      senderName: "Eva Williams",
      sentAt: "2025-05-12T21:10:00Z",
      messageSnippet: "Here's the invoice you requested...",
      isStarred: true,
    },
  ];

  return (
    <div className={styles.container}>
      <SideBar />
      <NavBar />
      <div className={styles.body}>
        {arrEmailList.map((obj) => {
          return (
            <EmailCard
              senderEmail={obj.senderEmail}
              senderName={obj.senderName}
              sentAt={obj.sentAt}
              messageSnippet={obj.messageSnippet}
              isStarred={obj.isStarred}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
