import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { tokenize, parseTokens } from "../../utils/stParser";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "./workspace.css";
import { useTheme } from "../theme/ThemeContext";

const Editor = ({ stCode, setStCode }) => {
    const [ast, setAst] = useState(null);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState(true);
    const [show, setShow] = useState(false);
    const { theme, toggleTheme } = useTheme();
    console.log(stCode);
    const handleDownload = (name, file, format) => {
        const text = file;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCompile = () => {
        try {
            setError(null);
            const tokens = tokenize(stCode);
            if (!tokens.length) throw new Error("No valid tokens found!");
            const parsedAst = parseTokens(tokens);
            setAst(parsedAst);
        } catch (err) {
            setError(`${err.message}`);
        }
        setShow(true)
    };

    return (
        <div className="flex flex-col gap-5 ">
            <div className="editor-language p-2 flex justify-between">
                <section className="flex space-x-2 p-1">
                    <div className={`multi-code ${language && "bg-blue-500 text-white"} cursor-pointer p-2`} onClick={() => setLanguage(true)}>ST Code</div>
                    <div className={`multi-code ${!language && "bg-blue-500 text-white"} cursor-pointer p-2`} onClick={() => setLanguage(false)}>Ladder Diagram</div>
                </section>
                <section className="flex items-center">
                    <div className="bg-blue-500 text-white px-4 py-2 cursor-pointer" onClick={handleCompile}>Execute</div>
                    <div className="relative">
                        <button className="dropdown-toggle py-2 px-4 text-white" data-bs-toggle="dropdown" aria-expanded="false">
                        </button>
                        <ul className="dropdown-menu absolute mt-3 bg-white text-black shadow-lg rounded-md">
                            <li><a className="dropdown-item text-blue-500 cursor-pointer" onClick={() => handleDownload("stcode", stCode, "st")}>ST Code</a></li>
                            <li><a className="dropdown-item text-blue-500 cursor-pointer" onClick={() => handleDownload("astcode", JSON.stringify(ast), "json")}>AST Format</a></li>
                        </ul>
                    </div>
                </section>
            </div>
            {
                language ?
                    <div className="editor-container p-2">
                        <MonacoEditor
                            language="plaintext"
                            theme={theme === "light" ? "vs-light" : "vs-dark"}
                            height="min(65vh, 35em)"
                            value={stCode||""}
                            onChange={setStCode}
                            options={{ fontSize: 14 }}
                        />
                    </div> : 
                    <div className="editor-container p-4 text-center text-gray-500">Stay Tuned !! Coming Soon ...</div>
            }
            {show && (
                <div className="modal show d-block fixed inset-0 bg-gray-800 bg-opacity-50">
                    <div className="modal-dialog modal-dialog-centered max-w-md mx-auto">
                        <div className="modal-content bg-white rounded-lg shadow-lg">
                            <div className="modal-header flex justify-between items-center p-4 border-b">
                                <h5 className="modal-title text-xl font-bold">Compilation Result</h5>
                                <button
                                    type="button"
                                    className="btn-close text-black"
                                    onClick={() => setShow(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body p-5 text-center">
                                {
                                    !error ?
                                    <DotLottieReact
                                        src="https://lottie.host/68b6c80d-7059-4de5-b393-0d5aea783a1f/LSSCD6OBU2.lottie"
                                        autoplay
                                    /> :
                                    <DotLottieReact
                                        src="https://lottie.host/1bb6f51f-f5d7-47d6-a967-9c5823e7be84/i44ScOK9D3.lottie"
                                        loop
                                        autoplay
                                    />
                                }
                                <p className="message-description mt-4">
                                    {
                                        error ? <div className="text-red-500 font-bold">{error}</div> : <div className="text-green-500 font-bold">Compilation Successful</div>
                                    }
                                </p>
                            </div>

                            <div className="modal-footer p-4 border-t">
                                <button
                                    type="button"
                                    className="btn btn-danger py-2 px-4 text-white bg-red-500 hover:bg-red-700 rounded"
                                    onClick={() => setShow(false)}
                                >
                                    Close
                                </button>
                                {!error && <button type="button" className="btn btn-success py-2 px-4 text-white bg-green-500 hover:bg-green-700 rounded" onClick={() => setShow(false)}>
                                    Deploy
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;
