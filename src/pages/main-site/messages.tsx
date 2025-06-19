import React, { useState, useEffect } from "react";
import Layout from "./layout";
import { FaUser, FaPaperPlane } from "react-icons/fa";

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  gap: "20px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  padding: "20px",
  display: "flex",
  fontFamily: "'Inter', sans-serif",
  flexDirection: "column",
  height: "600px",
  maxWidth: "400px",
  flex: 1,
};

const userListStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  padding: "20px",
  fontFamily: "'Inter', sans-serif",
  height: "600px",
  width: "200px",
  overflowY: "auto",
};

const headerStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  fontFamily: "'Inter', sans-serif",
  color: "#4c4c4c",
  marginBottom: "10px",
};

const chatBodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  marginBottom: "15px",
};

const msgRowStyle = (isUser: boolean): React.CSSProperties => ({
  display: "flex",
  justifyContent: isUser ? "flex-end" : "flex-start",
  alignItems: "flex-end",
  marginBottom: "10px",
});

const bubbleStyle = (isUser: boolean): React.CSSProperties => ({
  maxWidth: "70%",
  backgroundColor: isUser ? "#6b5b95" : "#f1f0f0",
  color: isUser ? "white" : "#333",
  padding: "10px 15px",
  borderRadius: "18px",
  borderTopLeftRadius: isUser ? "18px" : "0px",
  borderTopRightRadius: isUser ? "0px" : "18px",
});

const iconStyle: React.CSSProperties = {
  marginRight: "8px",
  fontSize: "18px",
  color: "#6b5b95",
};

const chatFormStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid #eee",
  paddingTop: "10px",
};

const chatInputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  borderRadius: "20px",
  border: "1px solid #ccc",
  outline: "none",
};

const sendButtonStyle: React.CSSProperties = {
  marginLeft: "10px",
  padding: "10px 12px",
  borderRadius: "50%",
  backgroundColor: "#6b5b95",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const addUserBoxStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  backgroundColor: "#f9f9f9",
};

const inputStyle: React.CSSProperties = {
  width: "95%",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const addButtonStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "8px 12px",
  backgroundColor: "#6b5b95",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

interface User {
  email: string;
  name: string;
  phone: string;
  role: "Student" | "Nurse";
  specialty: string;
  status: "Active" | "Inactive";
  last_active_date: string;
}

const Messages: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved ? (JSON.parse(saved) as User[]) : [];
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(
    () => {
      const saved = localStorage.getItem("chatMessages");
      return saved ? (JSON.parse(saved) as Record<string, ChatMessage[]>) : {};
    }
  );

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<
    Omit<User, "specialty" | "status" | "last_active_date">
  >({
    email: "",
    name: "",
    phone: "",
    role: "Student",
  });

  const handleAddUser = () => {
    if (!newUser.email || !newUser.name || !newUser.phone) return;
    const specialties = [
      "Emergency Room",
      "Home Health",
      "Telehealth",
      "Parent-Child",
      "Psychiatric",
      "Rehabilitation",
      "Critical Care",
      "Public Health",
    ];
    const fullUser: User = {
      ...newUser,
      specialty: specialties[Math.floor(Math.random() * specialties.length)],
      status: Math.random() > 0.5 ? "Active" : "Inactive",
      last_active_date: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, fullUser]);
    setNewUser({ email: "", name: "", phone: "", role: "Student" });
    setShowAddUser(false);
    setSelectedUser(users.length); // select the newly added user
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser === null || !messageInput.trim()) return;
    const userEmail = users[selectedUser].email;
    const newMsg: ChatMessage = { sender: "user", text: messageInput.trim() };
    setMessages((prev) => ({
      ...prev,
      [userEmail]: [...(prev[userEmail] || []), newMsg],
    }));
    setMessageInput("");
  };

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  return (
    <Layout>
      <div style={headerStyle}>Messages</div>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={chatBodyStyle}>
            {selectedUser === null ? (
              <p style={{ color: "#888", textAlign: "center" }}>
                No users selected.
              </p>
            ) : (
              (messages[users[selectedUser].email] || []).map((msg, i) => (
                <div key={i} style={msgRowStyle(msg.sender === "user")}>
                  <div style={bubbleStyle(msg.sender === "user")}>
                    {msg.text}
                  </div>
                  <FaUser
                    style={{ ...iconStyle, marginRight: 0, marginLeft: 8 }}
                  />
                </div>
              ))
            )}
          </div>

          <form style={chatFormStyle} onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              style={chatInputStyle}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button type="submit" style={sendButtonStyle}>
              <FaPaperPlane />
            </button>
          </form>

          <button
            onClick={() => setShowAddUser((prev) => !prev)}
            style={{ ...addButtonStyle, marginTop: "15px" }}
          >
            ➕ Add User
          </button>

          {showAddUser && (
            <div style={addUserBoxStyle}>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <select
                value={newUser.role}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    role: e.target.value as "Student" | "Nurse",
                  }))
                }
              >
                <option value="Student">Student</option>
                <option value="Nurse">Nurse</option>
              </select>
              <button onClick={handleAddUser} style={addButtonStyle}>
                Add
              </button>
            </div>
          )}
        </div>

        <div style={userListStyle}>
          <h4 style={{ marginBottom: "10px" }}>Users</h4>
          {users.length === 0 ? (
            <p style={{ color: "#999" }}>No users available</p>
          ) : (
            users.map((user, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedUser(idx)}
                style={{
                  padding: "8px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  backgroundColor: idx === selectedUser ? "#e0e0f0" : "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                {user.name} ({user.role})
                <br />
                <span style={{ fontSize: "12px", color: "#777" }}>
                  {user.email}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
