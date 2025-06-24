import React, { useContext, useState } from "react";
import logo from "../../public/assets/logo.png?url";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { SiImessage } from "react-icons/si";
import {
    RiArrowDownSFill,
    RiNotificationLine,
    RiShutDownLine,
} from "react-icons/ri";
import { CountContext } from "./contextData";

const Navlinks = () => {
    const [isChatlist, setisChatlist] = useContext(CountContext)
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    };

    const navItems = [
        { icon: <SiImessage />, label: "Chats" },
        { icon: <RiNotificationLine />, label: "Notifications" },
    ];

    return (
        <section className="sticky top-0 lg:static flex items-center lg:items-start lg:justify-start h-[7vh] lg:h-screen w-full lg:w-[160px] bg-sky-300 shadow-md z-50">
            <main className="flex lg:flex-col items-center justify-between lg:justify-start w-full h-full py-4 lg:py-8 px-4 lg:px-0 gap-4">
                {/* Logo */}
                <div className="flex items-center justify-center lg:mb-6 ">
                    <img
                        src={logo}
                        alt="Chatfrik Logo"
                        className="w-[70px] h-[40px] object-cover bg-white rounded-lg p-2 shadow-md border-1 border-black"
                    />
                </div>

                {/* Navigation Icons */}
                <ul className="flex lg:flex-col flex-row items-center gap-6 lg:gap-8">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <button
                                className="text-black text-[22px] lg:text-[26px] hover:text-[#D9F2ED] transition-all duration-200"
                                title={item.label}
                            >
                                {item.icon}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="text-black text-[22px] lg:text-[26px] hover:text-red-300 transition-all duration-200 cursor-pointer"
                            title="Logout"
                        >
                            <RiShutDownLine />
                        </button>
                    </li>
                </ul>

                {/* Mobile Dropdown Icon */}
                <button onClick={()=>setisChatlist(!isChatlist)} className="block lg:hidden text-black text-[22px] cursor-pointer">
                    <RiArrowDownSFill />
                </button>
            </main>
        </section>
    );
};

export default Navlinks;
