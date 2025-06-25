import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { tokenize, parseTokens } from "../../utils/stParser";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "./workspace.css";
import { useTheme } from "../theme/ThemeContext";
import { uploadCode } from "./generate";

const Editor = ({ stCode, setStCode }) => {
    const [ast, setAst] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
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
            try{
              let value=uploadCode(ast);
              console.log(value);
            }
            catch(err){
              console.log('Error in uploading code:',err);
            }
        } catch (err) {
            setError(`${err.message}`);
        }
        setShow(true)
    };

    return (
        <div className="flex flex-col gap-5 ">
            <div className="editor-language p-2 flex justify-between">
                <section className="flex p-1 multi-code-container">
                    <div className={`multi-code ${language && "code-active"} cursor-pointer p-2`} onClick={() => setLanguage(true)}>ST Code</div>
                    <div className={`multi-code ${!language && "code-active"} cursor-pointer p-2`} onClick={() => setLanguage(false)}>Ladder Diagram</div>
                </section>
                <section className="flex items-center">
                    <div className="editor-execution text-white px-4 py-2 cursor-pointer" onClick={handleCompile}>Execute</div>
                    <div className="relative">
            <button
                className="py-2 px-4 text-white  editor-execution"
                onClick={() => setOpen(!open)}
            >
                ▼
            </button>

            {open && (
                <ul className="absolute mt-2 w-40 shadow-lg rounded-md z-100 cursor-pointer dropdown-download">
                    <li>
                        <a
                            className="block px-4 py-2  cursor-pointer "
                            onClick={() => handleDownload("stcode", stCode, "st")}
                        >
                            ST Code
                        </a>
                    </li>
                    <li>
                        <a
                            className="block px-4 py-2  cursor-pointer "
                            onClick={() => handleDownload("astcode", JSON.stringify(ast), "json")}
                        >
                            AST Format
                        </a>
                    </li>
                </ul>
            )}
        </div>
                </section>
            </div>
            {
                language ?
                    <div className="editor-container p-2">
                        <MonacoEditor
                            language="plaintext"
                            theme={theme === "light" ? "vs-light" : "vs-dark"}
                            height="min(65vh, 34em)"
                            value={stCode||""}
                            onChange={setStCode}
                            options={{ fontSize: 13 }}
                        />
                    </div> : 
                    <div className="editor-container p-4 text-center text-gray-500">Stay Tuned !! Coming Soon ...</div>
            }
             {show && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md  flex justify-center items-center z-50">
          <div className="rounded-lg shadow-lg max-w-lg w-full overflow-hidden compilation-modal">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h5 className="text-2xl font-semibold text-gray-800">Compilation Result</h5>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 text-3xl"
                onClick={() => setShow(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-center">
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
              <p className="mt-5 text-xl">
                {
                  error ? <span className="text-red-500 font-bold">{error}</span> : <span className="text-green-500 font-bold">Compilation Successful</span>
                }
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-5 border-t">
              <button
                type="button"
                className="py-2 px-6 text-white bg-red-500 hover:bg-red-700 rounded-lg transition"
                onClick={() => setShow(false)}
              >
                Close
              </button>
              {!error && 
                <button
                  type="button"
                  className="py-2 px-6 text-white bg-green-500 hover:bg-green-700 rounded-lg transition"
                  onClick={() => setShow(false)}
                >
                  Deploy
                </button>
              }
            </div>
          </div>
        </div>
      )}
        </div>
    );
};

export default Editor;
