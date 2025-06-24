import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import defaultAvatar from "../../public/assets/default.jpg?url";
import { formatTimestamp } from "../utils/formatTimestamp";
import { RiSendPlaneFill } from "react-icons/ri";
import { auth, listenForMessages, sendMessage } from "../Firebase/Firebase";
import logo from "../../public/assets/logo.png?url";
import { CountContext } from "./contextData";

const Chatbox = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, sendMessageText] = useState("");
    const scrollRef = useRef(null);
    const [isChatlist, setisChatlist] = useContext(CountContext)

    const chatId =
        auth?.currentUser?.uid < selectedUser?.uid
            ? `${auth?.currentUser?.uid}-${selectedUser?.uid}`
            : `${selectedUser?.uid}-${auth?.currentUser?.uid}`;
    const user1 = auth?.currentUser;
    const user2 = selectedUser;
    const senderEmail = auth?.currentUser?.email;

    useEffect(() => {
        listenForMessages(chatId, setMessages);
    }, [chatId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => {
            const aTime = a?.timestamp?.seconds + a?.timestamp?.nanoseconds / 1e9;
            const bTime = b?.timestamp?.seconds + b?.timestamp?.nanoseconds / 1e9;
            return aTime - bTime;
        });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const newMessage = {
            sender: senderEmail,
            text: messageText,
            timestamp: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: 0,
            },
        };

        sendMessage(messageText, chatId, user1?.uid, user2?.uid);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        sendMessageText("");
    };

    return (
        <>
            {selectedUser ? (
                <section className="lg:flex flex-col h-screen w-full ">
                 
                    <header className="flex items-center gap-4 p-4 bg-white shadow-sm border-b">
                        <img
                            src={selectedUser?.image || defaultAvatar}
                            className="w-12 h-12 rounded-full object-cover shadow"
                            alt="User Avatar"
                        />
                        <div>
                            <h3 className="font-semibold text-[#2A3D39] text-lg">{selectedUser?.fullName || "Chatfrik User"}</h3>
                            <p className="text-sm text-gray-500">@{selectedUser?.username || "chatfrik"}</p>
                        </div>
                    </header>

                 
                    <main className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar" ref={scrollRef}>
                        {sortedMessages.map((msg, index) => (
                            <div key={index} className={` flex mb-4 ${msg?.sender === senderEmail ? "justify-end" : "justify-start"}`}>
                                {msg?.sender !== senderEmail && (
                                    <img
                                        src={selectedUser?.image || defaultAvatar}
                                        className="w-10 h-10 rounded-full object-cover mr-2"
                                        alt="Sender Avatar"
                                    />
                                )}
                                <div className={`bg-white max-w-[70%] p-3 rounded-lg shadow-md ${msg?.sender === senderEmail ? "bg-[#D9F2ED]" : "bg-white"}`}>
                                    <p className="text-[#2A3D39] text-sm">{msg.text}</p>
                                    <p className="text-[11px] text-gray-400 text-right mt-1">{formatTimestamp(msg?.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </main>
                    <footer className="p-4 bg-white border-t shadow-md absolute w-full  lg:sticky bottom-0 ">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3 ">
                            <input
                                value={messageText}
                                onChange={(e) => sendMessageText(e.target.value)}
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 rounded-full border border-green-800 focus:outline-none focus:ring-2 focus:ring-[#01AA85] text-sm"
                            />
                            <button
                                type="submit"
                                className="p-2 rounded-full bg-[#D9F2ED] hover:bg-[#c8eae3] transition-all"
                                aria-label="Send message"
                            >
                                <RiSendPlaneFill color="#01AA85" size={20} />
                            </button>
                        </form>
                    </footer>
                </section>
            ) : (
                <section className={`${isChatlist?"hidden":"flex"} h-screen w-full bg-[#e5f6f3] flex flex-col items-center justify-center text-center px-4`}>
                    <img src={logo} alt="Chatfrik Logo" width={100} className="mb-6" />
                    <h1 className="text-3xl font-bold text-teal-700 mb-2">Welcome to Iklash Chat</h1>
                    <p className="text-gray-500 max-w-md">
                        Connect and chat with friends easily, securely, fast and free. Select a user from the list to start chatting.
                    </p>
                </section>
            )}
        </>
    );
};

export default Chatbox;
