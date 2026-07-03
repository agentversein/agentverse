"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);

  check();
  window.addEventListener("resize", check);

  return () => window.removeEventListener("resize", check);
}, []);
  // 🔹 Load Agents
  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // 🔹 Load Chats
  useEffect(() => {
    async function loadChats() {
      try {
        const res = await fetch("/api/chats");
        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          setChatList([]);
          return;
        }

        const chats = Array.isArray(data) ? data : [];

        const sortedChats = chats.sort((a, b) => {
  const aNum = parseInt(a.title.replace("Chat ", "")) || 0;
  const bNum = parseInt(b.title.replace("Chat ", "")) || 0;
  return aNum - bNum;
});

setChatList(sortedChats);

        if (chats.length > 0) {
          setCurrentChatId(chats[0]._id);
          setMessages(chats[0].messages || []);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadChats();
  }, []);

  // 🔹 Create New Chat
  const createNewChat = async () => {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Chat ${chatList.length + 1}`,
        }),
      });

      const newChat = await res.json();

      setChatList((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat._id);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Select Chat (FIXED)
  
 const selectChat = (chatId) => {
  const chat = chatList.find((c) => c._id === chatId);

  if (!chat) return;

  setCurrentChatId(chatId);
  setMessages(chat.messages || []);
};
    
  // 🔹 Rename Chat (FIXED)
  const renameChat = (chatId, newTitle) => {
    setChatList((prev) =>
      prev.map((chat) =>
        chat._id === chatId
          ? { ...chat, title: newTitle }
          : chat
      )
    );
  };

  // 🔹 Delete Chat (FIXED)
  const deleteChat = (chatId) => {
    const updated = chatList.filter((c) => c._id !== chatId);

    setChatList(updated);

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  return (
  <>
    <Header />

   <div className="flex flex-col md:flex-row w-full h-[calc(100vh-72px)] mt-[72px]">

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: isMobile ? "fixed" : "relative",
          left: isMobile && !sidebarOpen ? "-320px" : "0",
          top: 0,
          width: 300,
          height: "100vh",
          zIndex: 100,
          transition: "left .3s ease",
          background: "#fff",
          boxShadow: "0 0 40px rgba(0,0,0,.25)",
        }}
      >
        <Sidebar
          agents={agents}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          chatList={chatList}
          currentChatId={currentChatId}
          selectChat={selectChat}
          deleteChat={deleteChat}
          createNewChat={createNewChat}
          renameChat={renameChat}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Chat */}
      <div style={{ flex: 1 }}>
        <ChatWindow
          selectedAgent={selectedAgent}
          chatList={chatList}
          setChatList={setChatList}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          messages={messages}
          setMessages={setMessages}
          createNewChat={createNewChat}
        />
      </div>

    </div>
  </>
);
}