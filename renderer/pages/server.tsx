import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from './navbar';
import SettingsModal from './settings-modal';
import { ServerSettings } from '../components/ServerSettings';

import stripAnsi from 'strip-ansi';

const os = require('os');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require("child_process");
const kill = require('tree-kill');


const homeDirectory = os.homedir();
const alpacaPath = path.join(homeDirectory, 'alpaca.cpp');
const windows = os.platform == "win32";

let shell: any;


function Server() {

  // chat history state
  const [chatHistory, setChatHistory] = React.useState([
    {
      message: "Welcome to Alpaca! Start the server by clicking the button above and start chatting! 🦙",
      isUser: false
    },
  ]);

  const [serverReady, setServerReady] = React.useState<boolean>(false);
  const [isStarting, setIsStarting] = React.useState<boolean>(false);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);

  const [simpleOut, setSimpleOut] = React.useState<string>("");
  const [simpleErr, setSimpleErr] = React.useState<string>("");

  const inputRef = React.useRef<HTMLInputElement>(null);
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  const textToRef = (): string => {
    const input = inputRef.current.value
    inputRef.current.value = ""
    return input
  }

  const canWrite = (): boolean => {
    return serverReady && !isGenerating
  }

  const generateArgs = (settingsFile: ServerSettings): string => {
    const threads = settingsFile.llamaSettings.t;
    const tokens = settingsFile.llamaSettings.numOfTokens;
    const repetitionPenalty = settingsFile.llamaSettings.repetitionPenalty;
    const isReverse = settingsFile.llamaSettings.isReverse;
    const reverseMessage = settingsFile.llamaSettings.reverseMessage;
    const temp = settingsFile.llamaSettings.temp;
    const topP = settingsFile.llamaSettings.topP;
    const topK = settingsFile.llamaSettings.topK;
    const repeatLastN = settingsFile.llamaSettings.repeatLastN;

    /**
     * run chat.exe / main.exe -h to get the full list of arguments
     */
    let args = `-i -t ${threads} -n ${tokens} --repeat_penalty ${repetitionPenalty}${isReverse ? " --reverse" + reverseMessage : ""} --temp ${temp} --top_p ${topP} --top_k ${topK} --repeat_last_n ${repeatLastN}`

    return args;
  }

  const startSpawn = () => {
    setIsStarting(true);
    setSimpleErr("");
    // todo we only want to spawn the shell once
    try {
      shell = windows ? spawn('cmd') : spawn('sh');
      shell.stdin.setEncoding('utf-8');
      shell.stdout.setEncoding('utf-8');
    } catch (error) {
      console.error(error);
      setIsStarting(false);
      return;
    }


    shell.stdout.on('data', function (data) {
      //console.log(data.toString());
      // if the output is "> " then we are ready to send a message
      if (data.toString().endsWith("> ")) {
        console.log("server ready")
        setIsStarting(false);
        setServerReady(true);
      }
    });

    // Check if shell is defined before writing to stdin
    if (shell) {
      const settingsFilePath = path.join(os.homedir(), ".vicunia-settings.json");
      if (fs.existsSync(settingsFilePath)) {
        console.log("settings file exists")
      } else {
        console.log("settings file does not exist, writing default settings")
        const defaultSettings = {
            folderPath: alpacaPath,
            llamaSettings: {
              t: 4,
              numOfTokens: 128,
              repetitionPenalty: 1.3,
              isReverse: false,
              reverseMessage: "",
              temp: 0.1,
              topP: 0.9,
              topK: 40,
              repeatLastN: 64,
            }
          }
        fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings));
      }

      const settingsFile = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
      const args = generateArgs(settingsFile);
      const folderPath = settingsFile.folderPath;

      
      shell.stdin.write(windows ? `chcp 65001\n` : ``);
      shell.stdin.write(`cd ${folderPath}\n`);


      let executable = "chat"

      // if the folder has a llama.cpp or alpaca.cpp binary
      if (fs.existsSync(path.join(folderPath.toString(), "chat.exe")) || fs.existsSync(path.join(folderPath.toString(), "chat"))) {
        console.log("chat binary exists")
        executable = "chat"
      } else if (fs.existsSync(path.join(folderPath.toString(), "main.exe")) || fs.existsSync(path.join(folderPath.toString(), "main"))) {
        console.log("main binary exists")
        executable = "main"
      } else {
        console.error("compiled binaries do not exist in the selected folder, please compile them first")
        setIsStarting(false);
        setSimpleErr("compiled binaries do not exist in the selected folder, please compile them first")
        return;
      }


      console.log("starting server with args: " + args)
      shell.stdin.write(windows ? `${executable}.exe ${args}\n` : `./${executable} ${args}\n`);
    }
  }

  const handleSend = () => {
    setIsGenerating(true);
    const inputFieldText: string = textToRef();
    // append user prompt to chat history
    const newChatUser = {
      message: inputFieldText,
      isUser: true
    }
    const newChatHistoryUser = [...chatHistory, newChatUser];
    setChatHistory(newChatHistoryUser);

    const messageToSend = inputFieldText + "\n";

    let accumulatedData = "";

    if (shell && shell.stdin.writable) {
      shell.stdin.write(messageToSend.toString(), (error) => {
        if (error) {
          console.error(error);
        }
      });
      shell.stdout.on('data', function (data) {
        console.log(data.toString());
        setIsStreaming(true);
        accumulatedData += stripAnsi(data.toString());
        // strip non-ascii characters
        // TODO: cross-platform unicode support
        //accumulatedData.replace(/[^\x20-\x7E]/g, '')
        setSimpleOut(accumulatedData);
        if (accumulatedData.endsWith("> ")) {
          console.log("END OF PROMPT REACHED")
          setIsStreaming(false);
          setIsGenerating(false);
          // remove the "> " from the end of the string
          accumulatedData = accumulatedData.slice(0, -2);

          // append the AI message to the chat history
          const newChatHistoryAI = [...chatHistory, newChatUser, {
            message: accumulatedData,
            isUser: false
          }];
          setChatHistory(newChatHistoryAI);

          accumulatedData = "";
          setSimpleOut("");
        }
      });
    } else {
      console.error("Unable to write to shell stdin.");
    }
  };

  const killProcess = () => {
    setSimpleErr("");
    if (shell) {
      kill(shell.pid, 'SIGTERM', function (err) {
        if (err) {
          console.error("tree-kill error: ", err);
        }
      });
      setIsGenerating(false);
      setIsStreaming(false);
      setServerReady(false);
    } else {
      console.error("Unable to kill shell.");
    }
  }


  React.useEffect(() => {
    chatBottomRef.current.scrollIntoView();
  });

  return (
    <React.Fragment>
      <Head>
        <title>Chat - Vicunia</title>
      </Head>
      <div className="h-screen flex flex-col flex-grow w-full bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <Navbar />

        <SettingsModal />

        <div aria-label='chat-options-bar' className="bg-neutral p-4 flex flex-row justify-between items-center h-16 w-full">
          <div className='flex flex-row gap-2 items-center overflow-x-auto sm:overflow-x-hidden w-full'>
            <button className={isStarting ? "rounded btn btn-primary loading" : "rounded btn btn-primary"} onClick={startSpawn} disabled={serverReady} >start server</button>
            <button onClick={killProcess} className='rounded btn btn-primary'>Stop</button>

            <div className={serverReady ? "badge badge-success gap-2 h-full align-middle" : "badge badge-warning gap-2 h-full align-middle"}>
              {serverReady ? "Alpaca Ready" : "Not started"}
            </div>

            {simpleErr !== "" && <div className="badge badge-warning gap-2 h-full align-middle">{simpleErr}</div>}

            <button className='ml-auto'>
              <label htmlFor="my-modal" className="rounded btn btn-primary justify-end">Options</label>
            </button>

          </div>
        </div>

        <div className="flex flex-col flex-grow w-full p-4 overflow-auto">

          {chatHistory.map((chat, index) => {
            if (chat.isUser) {
              return (
                <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                  <div>
                    <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs">
                  <div>
                    <div aria-label='AI Chat Bubble' className="bg-secondary p-3 rounded-r-lg rounded-bl-lg">
                      <p className="text-sm text-white">{chat.message}</p>
                    </div>
                  </div>
                </div>
              );
            }
          })}

          {isGenerating && <div className="flex w-full mt-2 space-x-3 max-w-xs">
            <div>
              <div aria-label='AI Chat Bubble' className={`${!isStreaming && "animate-pulse"} bg-secondary p-3 rounded-r-lg rounded-bl-lg`}>
                <p className="text-sm text-white"
                >
                  {simpleOut}
                </p>
              </div>
            </div>
          </div>}
          <div ref={chatBottomRef}></div>
        </div>



        <div className="bg-gray-300 p-4 flex justify-between items-center h-20 w-full">
          <input className={`"h-full w-full rounded p-3 text-black text-sm ${isGenerating ? 'bg-gray-300' : 'bg-white'} `}
            type="text"
            placeholder={isGenerating ? "Loading..." : "Type your message…"}
            readOnly={!(!isGenerating && serverReady)}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <div onClick={handleSend} className='rounded btn btn-primary ml-4 mr-2'>send</div>
        </div>

      </div>
    </React.Fragment>
  )
}

export default Server
