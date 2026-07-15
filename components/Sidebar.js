"use client";

import { useEffect, useState } from "react";

export default function Sidebar({
  agents = [],
  selectedAgent,
  setSelectedAgent,
  chatList = [],
  currentChatId,
  selectChat,
  deleteChat,
  createNewChat,
  renameChat,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
}) {
  
  

 

  return (
    <>
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

      <div
        style={{
          width: 280,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          padding: 16,
          overflowY: "auto",

         position: isMobile ? "fixed" : "relative",

top: 64,

left: 0,

height: "calc(100vh - 64px)",

transform:
  isMobile && !sidebarOpen
    ? "translateX(-100%)"
    : "translateX(0)",

transition: "transform .3s ease",

          boxShadow: isMobile
  ? "0 0 25px rgba(0,0,0,.25)"
  : "none",

          zIndex: 999,
        }}
      >
        <h3 style={{ marginBottom: 12 }}>
          🤖 AI Agents
        </h3>

        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => {
  setSelectedAgent(agent);

  if (isMobile) {
    setSidebarOpen(false);
  }

            }}
            style={{
              padding: 10,
              marginBottom: 8,
              borderRadius: 8,
              cursor: "pointer",
              background:
                selectedAgent?.id === agent.id
                  ? "#2563eb"
                  : "#f3f4f6",
              color:
                selectedAgent?.id === agent.id
                  ? "#fff"
                  : "#000",
            }}
          >
            {agent.icon} {agent.name}
          </div>
        ))}

        <hr style={{ margin: "18px 0" }} />

        <button
         onClick={() => {
  createNewChat();

  if (isMobile) {
    setSidebarOpen(false);
  }
}}
          style={{
            padding: 10,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          ➕ New Chat
        </button>
        <button
  onClick={async () => {
    await fetch("/api/chats", {
      method: "PATCH",
    });

    window.location.reload();
  }}
  className="w-full bg-green-600 text-white py-2 rounded-lg mt-2"
>
  Fix Chat Numbers
</button>
<hr style={{ margin: "18px 0" }} />



<hr style={{ margin: "18px 0" }} />
        <h3 style={{ marginBottom: 10 }}>
          💬 Chats
        </h3>

        {chatList.length === 0 ? (
          <p style={{ color: "#888" }}>
            No chats yet
          </p>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat._id}
             onClick={() => {
  selectChat(chat._id);

  if (isMobile) {
    setSidebarOpen(false);
  }
}}
              
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                marginBottom: 8,
                borderRadius: 8,
                background:
                  currentChatId === chat._id
                    ? "#dbeafe"
                    : "#f9fafb",
                border:
                  currentChatId === chat._id
                    ? "1px solid #2563eb"
                    : "1px solid #e5e7eb",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chat.chatNumber
  ? `Chat ${chat.chatNumber}`
  : chat.title}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  const title = prompt(
                    "Rename Chat",
                    chat.title
                  );

                  if (title) {
                    renameChat(chat._id, title);
                  }
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  marginRight: 5,
                }}
              >
                ✏️
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}