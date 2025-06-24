import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navlinks from "./components/Navlinks";
import Chatbox from "./components/ChatBox";
import Chatlist from "./components/Chatlist";
import { auth } from "./Firebase/Firebase";
import { CountContext } from "./components/contextData";

const App = () => {
    const [user, setUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    
    useEffect(() => {
        const curr=auth.currentUser
        
        if (curr){
            setUser(curr)
        }
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    
   
    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/app" /> : <Navigate to="/login" />} />
                {console.log(user)}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/App"
                    element={
                        user ? (
                            
                            <div className="flex flex-col lg:flex-row items-start w-[100%]">
                                <Navlinks />
                                
                                <Chatlist setSelectedUser={setSelectedUser} />
                                <Chatbox selectedUser={selectedUser} />
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
