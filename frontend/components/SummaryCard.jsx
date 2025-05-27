import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./SummaryCard.module.css";

const SummaryCard = ({ title, preview, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}
      onClick={toggleExpand}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {isExpanded ? (
          <ChevronUp className={styles.icon} size={20} />
        ) : (
          <ChevronDown className={styles.icon} size={20} />
        )}
      </div>

      <p className={styles.preview}>{isExpanded ? content : preview}</p>

      <div className={styles.expandIndicator}>
        <span>{isExpanded ? "Show less" : "Read more"}</span>
      </div>
    </div>
  );
};

export default SummaryCard;
