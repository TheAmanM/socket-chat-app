import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io(import.meta.env.VITE_DB_URL, {
  withCredentials: true,
});

type Message = {
  sender: string;
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [user] = useState<string>(() => {
    const saved = localStorage.getItem("user");
    if (saved) return saved;
    const name = prompt("Enter your name") || "User";
    localStorage.setItem("user", name);
    return name;
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(import.meta.env.VITE_DB_URL);
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const message = { sender: user, content: input };
    setMessages((prev) => [...prev, message]);
    socket.emit("message", message);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Chat App</div>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === user ? "own" : "other"}`}
          >
            <div className="sender">{msg.sender}</div>
            <div className="content">{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
