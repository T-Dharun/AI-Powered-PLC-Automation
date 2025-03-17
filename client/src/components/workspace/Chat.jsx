import { useState } from "react";
import "./workspace.css";
import { generateCode } from "./generate";
import chatbot from "../../assets/chatbot.svg";;
import user from "../../assets/user.svg";;


const chatresponse = [
    "Got it! Here is your solution: 🚀",
    "Understood! Here's what you need. ✨",
    "No worries! Here’s your solution. 🔥",
    "Done! Check this out. ✅",
    "Sure thing! Here’s your fix. 🚀"
]
const Chat = ({ stCode, setStCode }) => {   
    const [history, setHistory] = useState([]);
    const [prompt, setPrompt] = useState('');
    
    const handleStCodeChange = async () => {
        setHistory([...history, { user: prompt, response: true }]);
        const res= await generateCode(prompt);
        //const res={message:true};
        if (res.message) {
            //const response ={text:"VAR\n    TemperatureSensor AT %IW0 : INT;\n    Light AT %QX0.2 : BOOL;\nEND_VAR\n\nIF TemperatureSensor > 100 THEN\n    Light := TRUE;\nELSE\n    Light := FALSE;\nEND_IF;\n"};
            const response=res.response;
            console.log(response);
            setStCode(response.text||"");
            setHistory(prevHistory => {
                const updatedHistory = [...prevHistory];
                updatedHistory[updatedHistory.length - 1].response = chatresponse[Math.floor(Math.random() * 5)];
                return updatedHistory;
            });
        } else {
            console.log("Error in generating code");
            setHistory(prevHistory => {
                const updatedHistory = [...prevHistory];
                updatedHistory[updatedHistory.length - 1].response = "Server is Busy !!!";
                return updatedHistory;
            });
        }
        setPrompt('');
    };

    return (
        <>
            <main className="chat-main h-full flex flex-col justify-between" id="chat">
                <h1 className="text-lg px-3 py-1">AI Assistant</h1>
                <section className="chat-section-box h-full p-3 overflow-auto">
                    {
                        history.length !== 0 && history.map((item, index) => {
                            return (
                                <div key={index} className="text-start flex flex-col gap-2">
                                    <div className="h-full flex items-center px-3 py-2  rounded-lg user-space">
                                        <div className="p-2">
                                            <img src={user} width={30} alt="User" />
                                        </div>
                                        <div className="user-prompt p-2  rounded-lg">
                                            {item.user}
                                        </div>
                                    </div>
                                    <div className="h-full flex items-center gap-3 px-3 py-1">
                                        <div className="p-2">
                                            {
                                                item.response === true ? <section className="p-1">
                                                    <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                                                </section> : <img src={chatbot} width={30} alt="Chatbot" />
                                            }
                                        </div>
                                        {
                                            item.response === true ? <i>Your request is being processed</i> : 
                                            <div className="user-prompt rounded-md">
                                                {item.response}
                                            </div>
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </section>
                <section className="w-full flex gap-2 pt-3 p-1 px-3">
                    <input className="chat-input w-full p-3 border border-gray-300 rounded-md focus:outline-none " placeholder="Describe Your Automation System !!!"
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                    ></input>
                    <button className="px-5 bg-gray-700 text-white rounded-md hover:bg-gray-800" onClick={() => handleStCodeChange()}>{'>'}</button>
                </section>
            </main>
        </>
    );
};
export default Chat;