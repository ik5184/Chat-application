import React, { useState, useEffect, useMemo, useContext } from "react";
import defaultAvatar from "../../public/assets/default.jpg?url";
import { RiMore2Fill } from "react-icons/ri";
import SearchModal from "./SearchModal";
import { formatTimestamp } from "../utils/formatTimestamp";
import { auth, db, listenForChats } from "../Firebase/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { CountContext } from "./contextData";

const Chatlist = ({ setSelectedUser }) => {
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isChatlist, setisChatlist,ischeck, setischeck] = useContext(CountContext)
    
    useEffect(() => {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            setUser(doc.data());
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = listenForChats(setChats);
        return () => unsubscribe();
    }, []);

    const sortedChats = useMemo(() => {
        return [...chats].sort((a, b) => {
            const aTime = a?.lastMessageTimestamp?.seconds + a?.lastMessageTimestamp?.nanoseconds / 1e9;
            const bTime = b?.lastMessageTimestamp?.seconds + b?.lastMessageTimestamp?.nanoseconds / 1e9;
            return bTime - aTime;
        });
    }, [chats]);

    const startChat = (user, chatId) => {
        setSelectedUser(user);
        setActiveChatId(chatId);
    };

    return (
        <section className={`${!isChatlist?"relative hidden":"flex"} lg:flex flex-col bg-white h-screen w-full md:w-full lg:w-[70%] overflow-y-auto custom-scrollbar`}>
          
            <header className="flex items-center justify-between w-full border-b p-4 sticky top-0 z-50 bg-white shadow-sm ">
                <div className="flex items-center gap-3">
                    <img
                        src={user?.image || defaultAvatar}
                        className="w-[44px] h-[44px] object-cover rounded-full shadow-md"
                        alt="User Avatar"
                    />
                    <div>
                        <h3 className="font-semibold text-[#2A3D39] text-[17px]">{user?.fullName || "Iklash Chat"}</h3>
                        <p className="font-light text-[#2A3D39] text-[15px]">@{user?.username || "iklash"}</p>
                    </div>
                </div>
                <button
                    className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg hover:bg-[#c0eae2] transition-all"
                    aria-label="More options"
                >
                    <RiMore2Fill color="#01AA85" className="w-[28px] h-[28px]" />
                </button>
            </header>

           
            <div className="w-full mt-2 px-5 ">
                <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-medium text-[#2A3D39]">Messages ({chats?.length || 0})</h3>
                    <SearchModal startChat={(user) => startChat(user, null)} />
                </div>
            </div>

            
            <main className="flex-col   mt-6 pb-3 w-full h-full border-0.5 border-amber-200">
                
                {sortedChats?.map((chat) => (
                    <button onClick={()=>setisChatlist(!isChatlist)}
                        key={chat?.id}
                        className={`chat-item flex items-start justify-between w-full px-5 py-3 border-b border-[#9090902c] transition-all duration-200 hover:bg-[#f0fdfa]  ${
                            activeChatId === chat?.id ? "bg-[#e0f7f4]" : ""
                        }`}
                    >
                        {chat?.users
                            ?.filter((u) => u?.email !== auth?.currentUser?.email)
                            ?.map((u) => (
                                <div
                                    key={u?.email}
                                    className="flex items-start gap-3 w-full"
                                    onClick={() => startChat(u, chat?.id)}
                                >
                                    <img
                                        src={u?.image || defaultAvatar}
                                        className="h-[40px] w-[40px] rounded-full object-cover shadow-sm"
                                        alt="Chat User"
                                    />
                                    <div className="flex flex-col w-full">
                                        <h2 className="font-semibold text-[#2A3d39] text-[17px]">{u?.fullName || "ChatFrik User"}</h2>
                                        <p className="font-light text-[#2A3d39] text-[14px] truncate">{chat?.lastMessage}</p>
                                    </div>
                                    <p className="text-gray-400 text-[11px] whitespace-nowrap ml-auto">
                                        {formatTimestamp(chat?.lastMessageTimestamp)}
                                    </p>
                                </div>
                            ))}
                    </button>
                ))}
            </main>
        </section>
    );
};

export default Chatlist;
