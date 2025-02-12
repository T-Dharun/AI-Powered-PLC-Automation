import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { tokenize, parseTokens } from "../../utils/stParser";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import "./workspace.css";

const Editor = ({ stCode, setStCode }) => {
    const [ast, setAst] = useState(null);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState(true);
    const [show, setShow] = useState(false);
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="editor-language p-2 d-flex justify-content-between">
                <section className="d-flex multi-code-container p-1">
                    <div className={`multi-code ${language && "code-active"}`} onClick={() => setLanguage(true)}>ST Code</div>
                    <div className={`multi-code ${!language && "code-active"}`} onClick={() => setLanguage(false)}>Ladder Diagram</div>
                </section>
                <section className="d-flex align-items-center editor-execution">
                    <div className="execute-st p-2 px-3" onClick={handleCompile}>Execute</div>
                    <div className="btn-group">
                        <div className=" dropdown-toggle download-toggle py-2 px-3" data-bs-toggle="dropdown" aria-expanded="false">
                        </div>
                        <ul className="dropdown-menu my-3">
                            <li><a className="dropdown-item dr-item-color" onClick={() => handleDownload("stcode", stCode, "st")}>ST Code</a></li>
                            <li><a className="dropdown-item dr-item-color" onClick={() => handleDownload("astcode", JSON.stringify(ast), "json")}>AST Format</a></li>
                        </ul>
                    </div>

                </section>
            </div>
            {
                language ?
                    <div className="editor-container pt-2 h-100">
                        <MonacoEditor
                            language="plaintext"
                            theme="vs-light"
                            height="600px"
                            value={stCode}
                            onChange={setStCode}
                            options={{ fontSize: 14 }}
                        />
                    </div> : <div className="editor-container ll-container">Stay Tuned !! Coming Soon ...</div>
            }
            {/* <button onClick={handleCompile} style={{ padding: "10px", cursor: "pointer", background: "lightgrey", color: "black", border: "none" }}>
                Convert to AST
            </button> */}
            {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
            {/* {ast && (
                <div>

                    <h3>Abstract Syntax Tree (AST)</h3>
                    <pre style={{ background: "#fff", padding: "10px", color: "black" }}>
                        {JSON.stringify(ast, null, 4)}
                    </pre>
                </div>
            )} */}
            {show && (
                <div className="modal show d-block compilation-display" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Compilation Result</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShow(false)}
                                    aria-label="Close"
                                ></button>
                            </div>


                            <div className="modal-body compilation-body px-5">
                                {
                                    !error?
                                    <DotLottieReact
                                    src="https://lottie.host/68b6c80d-7059-4de5-b393-0d5aea783a1f/LSSCD6OBU2.lottie"
                                    autoplay
                                />:
                                <DotLottieReact
                                    src="https://lottie.host/1bb6f51f-f5d7-47d6-a967-9c5823e7be84/i44ScOK9D3.lottie"
                                    loop
                                    autoplay
                                />
                                }
                                <p className="message-description">
                                    {
                                        error ? <div className="result-danger">{error}</div> : <div className="result-success">Compilation Successfull</div>
                                    }
                                </p>
                            </div>


                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => setShow(false)}
                                >
                                    Close
                                </button>
                                <button type="button" className="btn btn-dark" onClick={() => setShow(false)}>
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;
