import React, { useState } from "react";
import SummaryCard from "../components/SummaryCard";
import styles from "./Summary.module.css";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const Summary = () => {
  const summaries = [
    {
      id: 1,
      title: "Q1 2025 Performance Review",
      preview:
        "Overall growth exceeded expectations with a 25% increase in revenue",
      content:
        "In Q1 2025, we witnessed exceptional performance across all key metrics. Revenue grew by 25% year-over-year, driven by strong product adoption in emerging markets. Customer satisfaction scores improved by 15 points, reaching an all-time high of 92%. The launch of our new mobile platform contributed significantly to user engagement, with daily active users increasing by 40%.",
    },
    {
      id: 2,
      title: "Product Launch Analysis",
      preview: "New feature adoption rate reached 78% within first month",
      content:
        "The latest product launch has been our most successful to date. Within the first month, we achieved a 78% feature adoption rate, significantly higher than our target of 50%. User feedback has been overwhelmingly positive, with particular praise for the intuitive interface and improved performance. Support tickets related to the new features were 60% lower than previous launches.",
    },
    {
      id: 3,
      title: "Customer Feedback Overview",
      preview: "Net Promoter Score increased to 75, marking a new record",
      content:
        "Customer satisfaction metrics show remarkable improvement across all segments. Our Net Promoter Score reached 75, representing a 20-point increase from the previous quarter. Key factors contributing to this success include the enhanced customer support system, faster response times, and proactive issue resolution. Customer retention rate improved to 95%, while the average customer lifetime value increased by 30%.",
    },
    {
      id: 3,
      title: "Customer Feedback Overview",
      preview: "Net Promoter Score increased to 75, marking a new record",
      content:
        "Customer satisfaction metrics show remarkable improvement across all segments. Our Net Promoter Score reached 75, representing a 20-point increase from the previous quarter. Key factors contributing to this success include the enhanced customer support system, faster response times, and proactive issue resolution. Customer retention rate improved to 95%, while the average customer lifetime value increased by 30%.",
    },
    {
      id: 3,
      title: "Customer Feedback Overview",
      preview: "Net Promoter Score increased to 75, marking a new record",
      content:
        "Customer satisfaction metrics show remarkable improvement across all segments. Our Net Promoter Score reached 75, representing a 20-point increase from the previous quarter. Key factors contributing to this success include the enhanced customer support system, faster response times, and proactive issue resolution. Customer retention rate improved to 95%, while the average customer lifetime value increased by 30%.",
    },
    {
      id: 3,
      title: "Customer Feedback Overview",
      preview: "Net Promoter Score increased to 75, marking a new record",
      content:
        "Customer satisfaction metrics show remarkable improvement across all segments. Our Net Promoter Score reached 75, representing a 20-point increase from the previous quarter. Key factors contributing to this success include the enhanced customer support system, faster response times, and proactive issue resolution. Customer retention rate improved to 95%, while the average customer lifetime value increased by 30%.",
    },
    {
      id: 3,
      title: "Customer Feedback Overview",
      preview: "Net Promoter Score increased to 75, marking a new record",
      content:
        "Customer satisfaction metrics show remarkable improvement across all segments. Our Net Promoter Score reached 75, representing a 20-point increase from the previous quarter. Key factors contributing to this success include the enhanced customer support system, faster response times, and proactive issue resolution. Customer retention rate improved to 95%, while the average customer lifetime value increased by 30%.",
    },
  ];

  return (
    <div className={styles.outerBox}>
      <NavBar />
      <SideBar />
      <div className={styles.container}>
        <div className={styles.grid}>
          {summaries.map((summary) => (
            <SummaryCard
              key={summary.id}
              title={summary.title}
              preview={summary.preview}
              content={summary.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
