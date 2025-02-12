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
        // const res=await generateCode(prompt);
        if (true || res.message) {
            const response = "VAR\n    TemperatureSensor AT %IW0 : INT;\n    Light AT %QX0.2 : BOOL;\nEND_VAR\n\nIF TemperatureSensor > 100 THEN\n    Light := TRUE;\nELSE\n    Light := FALSE;\nEND_IF;\n"
            //const response=res.response;
            setStCode(response.text || response || "");
            setHistory(prevHistory => {
                const updatedHistory = [...prevHistory];
                updatedHistory[updatedHistory.length - 1].response = chatresponse[Math.floor(Math.random() * 5)];
                return updatedHistory;
            });

        }
        else {
            console.log("Error in generating code");
            setHistory(prevHistory => {
                const updatedHistory = [...prevHistory];
                updatedHistory[updatedHistory.length - 1].response = "Server is Busy !!!";
                return updatedHistory;
            });
        }
        setPrompt('');
    }

    return (
        <>
            <main className="h-100 d-flex flex-column justify-content-between" id="chat">
                <h5 className="p-2 pb-4 text-secondary chat-head">AI Assistant</h5>
                <section className="chat-section-box h-100 p-3">
                    {
                        history.length != 0 && history.map((item, index) => {
                            return (
                                <div key={index} className="text-start  d-flex flex-column gap-2 ">
                                    <div className="h-100 d-flex chat-user-message px-3 py-2">
                                        <div className="p-2">
                                            <img src={user} width={"30px"} />
                                        </div>
                                        <div className="user-prompt p-2">
                                            {item.user}
                                        </div>
                                    </div>
                                    <div className="h-100 d-flex align-items-center gap-3 px-3 py-1">
                                        <div className="p-2">
                                            {
                                                item.response === true ? <section className="p-1">
                                                    <div className="spinner-grow text-primary spinner-grow-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                              </div> 
                                                </section>: <img src={chatbot} width={"30px"} />
                                            }
                                        </div>
                                        {
                                            item.response === true ? <i>Your request is being processed </i> : <div className="user-prompt">
                                                {item.response}
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </section>
                <section className="w-100 d-flex gap-2 pt-3 p-1">
                    <input className="w-100 px-3 py-2 chat-input" placeholder="Describe Your Automation System !!!"
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                    ></input>
                    <button className="px-4 btn btn-secondary" onClick={() => handleStCodeChange()}>{'>'}</button>
                </section>
            </main>
        </>
    )
}
export default Chat;