import React, { useState, useRef, useEffect } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import {
  AtSign,
  Paperclip,
  Clock,
  X,
  Send,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image,
  Link,
  MoreHorizontal,
  ChevronDown,
  Trash2,
  Save,
  MinusCircle,
} from "lucide-react";
import styles from "./Compose.module.css";

const Compose = () => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isCcVisible, setIsCcVisible] = useState(false);
  const [isBccVisible, setIsBccVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isDraftSaved, setIsDraftSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState("");

  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    if (to || cc || bcc || subject || body || attachments.length > 0) {
      setIsDraftSaved(false);
      const timer = setTimeout(() => {
        saveDraft();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [to, cc, bcc, subject, body, attachments]);

  useEffect(() => {
    const dropArea = dropAreaRef.current;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (dropArea) dropArea.classList.add(styles.dragover);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (dropArea) dropArea.classList.remove(styles.dragover);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (dropArea) dropArea.classList.remove(styles.dragover);

      if (e.dataTransfer?.files) {
        const newFiles = Array.from(e.dataTransfer.files);
        setAttachments((prev) => [...prev, ...newFiles]);
      }
    };

    if (dropArea) {
      dropArea.addEventListener("dragover", handleDragOver);
      dropArea.addEventListener("dragleave", handleDragLeave);
      dropArea.addEventListener("drop", handleDrop);

      return () => {
        dropArea.removeEventListener("dragover", handleDragOver);
        dropArea.removeEventListener("dragleave", handleDragLeave);
        dropArea.removeEventListener("drop", handleDrop);
      };
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const saveDraft = () => {
    console.log("Saving draft...", { to, cc, bcc, subject, body, attachments });
    setIsDraftSaved(true);
    const now = new Date();
    setLastSaved(`Last saved at ${now.toLocaleTimeString()}`);
  };

  const handleSend = () => {
    if (!to) {
      alert("Please specify at least one recipient");
      return;
    }

    console.log("Sending email...", {
      to,
      cc,
      bcc,
      subject,
      body,
      attachments,
    });
    alert("Email sent successfully!");

    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setBody("");
    setAttachments([]);
    setIsCcVisible(false);
    setIsBccVisible(false);
  };

  const toggleCc = () => setIsCcVisible(!isCcVisible);
  const toggleBcc = () => setIsBccVisible(!isBccVisible);

  const formatText = (command) => {
    document.execCommand(command, false);
  };

  return (
    <div className={styles.outerBox}>
      <NavBar />
      <SideBar />
      <div className={styles.container} ref={dropAreaRef}>
        <div className={styles.header}>
          <h1>New Message</h1>
          <div className={styles.headerActions}></div>
        </div>

        <div className={styles.composeForm}>
          <div className={styles.recipientRow}>
            <label>To:</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipients"
              />
              <div className={styles.recipientActions}>
                {!isCcVisible && (
                  <button
                    className={styles.ccButton}
                    onClick={toggleCc}
                    title="Add Cc"
                  >
                    Cc
                  </button>
                )}
                {!isBccVisible && (
                  <button
                    className={styles.ccButton}
                    onClick={toggleBcc}
                    title="Add Bcc"
                  >
                    Bcc
                  </button>
                )}
              </div>
            </div>
          </div>

          {isCcVisible && (
            <div className={styles.recipientRow}>
              <label>Cc:</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Cc recipients"
                />
                <button
                  className={styles.iconButton}
                  onClick={toggleCc}
                  title="Remove Cc"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {isBccVisible && (
            <div className={styles.recipientRow}>
              <label>Bcc:</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="Bcc recipients"
                />
                <button
                  className={styles.iconButton}
                  onClick={toggleBcc}
                  title="Remove Bcc"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className={styles.subjectRow}>
            <label>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className={styles.subjectInput}
            />
          </div>

          <div className={styles.toolbar}>
            <button onClick={() => formatText("bold")} title="Bold">
              <Bold size={18} />
            </button>
            <button onClick={() => formatText("italic")} title="Italic">
              <Italic size={18} />
            </button>
            <button onClick={() => formatText("underline")} title="Underline">
              <Underline size={18} />
            </button>
            <div className={styles.divider}></div>
            <button
              onClick={() => formatText("insertUnorderedList")}
              title="Bulleted List"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => formatText("insertOrderedList")}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </button>
            <div className={styles.divider}></div>
            <button title="Insert Image">
              <Image size={18} />
            </button>
            <button title="Insert Link">
              <Link size={18} />
            </button>
            <button title="More Formatting Options">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div
            className={styles.editor}
            contentEditable
            onInput={(e) => setBody(e.currentTarget.innerHTML)}
            placeholder="Write your message here..."
          ></div>

          {attachments.length > 0 && (
            <div className={styles.attachments}>
              <h3>Attachments ({attachments.length})</h3>
              <div className={styles.attachmentList}>
                {attachments.map((file, index) => (
                  <div key={index} className={styles.attachmentItem}>
                    <Paperclip size={14} />
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className={styles.removeAttachment}
                      title="Remove attachment"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.leftActions}>
            <button className={styles.sendButton} onClick={handleSend}>
              <Send size={16} />
              <span>Send</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              style={{ display: "none" }}
              multiple
            />

            <button
              className={styles.actionButton}
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Paperclip size={16} />
            </button>

            <button className={styles.actionButton} title="Schedule send">
              <Clock size={16} />
            </button>
          </div>

          <div className={styles.rightActions}>
            {isDraftSaved ? (
              <span className={styles.savedIndicator}>{lastSaved}</span>
            ) : (
              <span className={styles.savingIndicator}>Saving...</span>
            )}

            <button
              className={styles.iconTextButton}
              onClick={saveDraft}
              title="Save draft"
            >
              <Save size={16} />
              <span>Save</span>
            </button>

            <button className={styles.iconTextButton} title="Discard draft">
              <Trash2 size={16} />
              <span>Discard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compose;
