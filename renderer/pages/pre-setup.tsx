import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from './navbar';
import { prepareCommand } from '../components/utils';
import ReactMarkdown from 'react-markdown'
const { shell } = require('electron');
const os = require('os');
const { exec, spawn } = require("child_process");
const path = require('path');
const semver = require('semver');
const Downloader = require("nodejs-file-downloader");
const cmake = require('cmake-js');

const home = path.join(require('os').homedir(), 'alpaca.cpp');
const windows = os.platform == "win32";

interface CommandItem {
  name: String,
  label: String,
  command: String,
  output: String,
  passed: Boolean
}

function Home() {
  //const termRef = React.useRef(null);
  let [items, setItems] = React.useState([
    {
      name: "check-node",
      label: "Check whether or not NodeJS is installed",
      command: "node -v",
      output: "",
      passed: false
    },
    {
      name: "check-python",
      label: "Check whether or not Python is installed",
      command: "python -V",
      output: "",
      passed: false
    },
    {
      name: "check-git",
      label: "Check whether or not Git is installed",
      command: "git --version",
      output: "",
      passed: false
    }
  ]);

  let [OLDliveItems, OLDsetLiveItems] = React.useState([
    {
      name: "clone-alpaca",
      label: "Clone the alpaca repository",
      command: "git clone https://github.com/antimatter15/alpaca.cpp",
      output: "",
      passed: false
    },
    {
      name: "download-alpaca",
      label: "Download the alpaca weights (4GB, this may take a while)",
      command: "",
      output: "",
      passed: false
    },
    {
      name: "make-alpaca",
      label: "Build the alpaca executable",
      command: "",
      output: "",
      passed: false
    }
  ]);

  let [liveItems, setLiveItems] = React.useState([
    {
      name: "npx-dalai-alpaca",
      label: "Run npx dalai alpaca",
      command: "npx dalai alpaca install 7B",
      output: "",
      passed: false
    },
  ]);

  let [installItemState, setInstallItemState] = React.useState([{
    name: "npx dalai llama",
    label: "Install npx dalai llama",
    command: "npx dalai llama -y",
    output: "",
    passed: false
  }])

  const execute = (command: String, item: CommandItem, items, add: Boolean = false) => {
    console.log(`executing ${command}`)
    let e = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        // update state
        const index = items.findIndex(i => i.name === item.name);
        const newItems = [...items];
        add ? newItems[index].output += error.message + "\n" : newItems[index].output = error.message;
        add ? setInstallItemState(newItems) : setItems(newItems);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        // update state
        const index = items.findIndex(i => i.name === item.name);
        const newItems = [...items];
        add ? newItems[index].output += stderr + "\n" : newItems[index].output = stderr;
        add ? setInstallItemState(newItems) : setItems(newItems);
        return;
      }
      console.log(`stdout: ${stdout}`);
      // update state
      const index = items.findIndex(i => i.name === item.name);
      const newItems = [...items];
      add ? newItems[index].output += stdout + "\n" : newItems[index].output = stdout;
      newItems[index].passed = true;
      add ? setInstallItemState(newItems) : setItems(newItems);

      // if the command is node -v, check if the version is greater than 18.0.0
      if (item.name === "check-node") {
        if (!semver.gte(stdout, '18.0.0')) {
          const index = items.findIndex(i => i.name === item.name);
          const newItems = [...items];
          newItems[index].output = "NodeJS version is too low. Please update to version 18.0.0 or higher";
          newItems[index].passed = true;
          add ? setInstallItemState(newItems) : setItems(newItems);
        }
      }
    });
  }

  // in this function the output is being outputted to the terminal live with spawn
  // TODO: clean this up, please
  const executeLive = (command: string, item: CommandItem, items, add: Boolean = false) => {
    // COMMAND SPECIFIC CODE
    // DOWNLOAD ALPACA
    if (item.name == "download-alpaca") {
      const downloader = new Downloader({
        url: "https://cloudflare-ipfs.com/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC",
        directory: "./",
        cloneFiles: true
      });
      downloader.on("end", () => {
        console.log("Download completed");
        // update state
        const index = items.findIndex(i => i.name === item.name);
        const newItems = [...items];
        newItems[index].output = "Download Completed";
        newItems[index].passed = true;
        add ? setLiveItems(newItems) : setLiveItems(newItems);
      });
      downloader.on("progress", (progress) => {
        console.log(progress);
        // update state
        const index = items.findIndex(i => i.name === item.name);
        const newItems = [...items];
        newItems[index].output = progress;
        add ? setLiveItems(newItems) : setLiveItems(newItems);
      });
      downloader.download();
      return
    }
    if (item.name == "make-alpaca") {
      let alpacaMade = false
      // run "cd alpaca.cpp" and "make chat" with cmake-js
      //exec("cd alpaca.cpp")
      const child2 = spawn("cmake-js", [], { cwd: home });
      child2.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        // update state
        const index = items.findIndex(i => i.name === item.name);
        const newItems = [...items];
        add ? newItems[index].output += data + "\n" : newItems[index].output = data;
        add ? setLiveItems(newItems) : setLiveItems(newItems);
      });

      child2.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        // update state
        const index = items.findIndex(i => i.name === item.name);
        const newItems = [...items];
        add ? newItems[index].output += data + "\n" : newItems[index].output = data;
        add ? setLiveItems(newItems) : setLiveItems(newItems);
      });

      child2.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code == 0) {
          alpacaMade = true
        }
        // update state
        const index = items.findIndex(i => i.name === item.name);
        const newItems = [...items];
        newItems[index].output += `child process exited with code ${code}`;
        //newItems[index].passed = true;
        add ? setLiveItems(newItems) : setLiveItems(newItems);
      }
      );

      if (alpacaMade) {
        // find the files in the alpaca.cpp/build/Release folder and move them to the alpaca.cpp folder
        const child3 = spawn("mv", ["alpaca.cpp/build/Release/alpaca.node", "alpaca.cpp/alpaca.node"], { cwd: home });
        child3.stdout.on('data', (data) => { console.log(`stdout: ${data}`); });
        child3.stderr.on('data', (data) => { console.log(`stderr: ${data}`); });
        child3.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          // update state
          const index = items.findIndex(i => i.name === item.name);
          const newItems = [...items];
          newItems[index].output += `child process exited with code ${code}`;
          code == 0 ? newItems[index].passed = true : newItems[index].passed = false;
          add ? setLiveItems(newItems) : setLiveItems(newItems);
        }
        );
      }

      return
    }
    const spawnCommand = prepareCommand(command);
    let child = windows ? spawn('cmd') : spawn('sh');

    if (child) {
      console.log("if shell")
      child.stdin.write(command + "\n")
    }
    // GENERIC COMMANDS
    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      // update state
      const index = items.findIndex(i => i.name === item.name);
      const newItems = [...items];
      add ? newItems[index].output += data + "\n" : newItems[index].output = data;
      add ? setInstallItemState(newItems) : setItems(newItems);
    });

    child.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      // update state
      const index = items.findIndex(i => i.name === item.name);
      const newItems = [...items];
      add ? newItems[index].output += data + "\n" : newItems[index].output = data;
      add ? setInstallItemState(newItems) : setItems(newItems);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      // update state
      const index = items.findIndex(i => i.name === item.name);
      const newItems = [...items];
      newItems[index].passed = true;
      add ? setInstallItemState(newItems) : setItems(newItems);
    });
  }

  // React.useEffect(() => {
  //     termRef.current.scrollIntoView();
  // });

  return (
    <React.Fragment>
      <Head>
        <title>Setup - Vicunia</title>
      </Head>
      <Navbar />
      <div className="alert alert-warning shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Warning: This is still experimental! For now, you're probably better off <a className='underline cursor-pointer' onClick={() => shell.openExternal("https://github.com/antimatter15/alpaca.cpp")}>following the instructions on Alpaca.cpp</a>. Make sure to place the alpaca.cpp folder, including the compiled binaries and model, in the home directory of your OS. The compiled binaries and model should all be in the root folder of Alpaca.cpp.</span>
        </div>
      </div>
      <div className="grid text-2xl w-full h-full text-center rounded">
        Check dependencies
        <ul className="grid text-lg w-90">
          {items.map((item) => {
            return (<li key={item.name}>
              <div className='bg-primary flex flex-wrap items-center justify-evenly m-2 ml-5 mr-5'>
                <div></div>
                <p className=''>{item.label}</p>
                <button className='btn bg-focus m-1' onClick={() => execute(item.command, item, items)}>Test</button>
                <ReactMarkdown className='font-mono'>{">" + item.output}</ReactMarkdown>
              </div>
            </li>)
          })}
        </ul>
        <div>
          <div className="alert shadow-lg">
            <div className='flex flex-wrap items-center justify-evenly'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className='text-center text-sm'>On Windows, you might need to install <a className='link' onClick={() => shell.openExternal("https://visualstudio.microsoft.com/de/vs/features/cplusplus/")}>Visual Studio with C++</a></span>
            </div>
          </div>
        </div>
        <hr />
        Download and install alpaca
        <ul className="grid text-lg w-90">
          {liveItems.map((item) => {
            return (<li key={item.name}>
              <div className='bg-primary items-center justify-evenly m-2'>
                <div></div>
                <p className=''>{item.label}</p>
                <div className='flex items-center justify-center'>
                  <button className='btn bg-focus m-1' onClick={() => executeLive(item.command, item, liveItems, true)}>RUN</button>
                  {item.passed ? <div className='w-40 h-14 alert alert-success'>Success</div> : <div className='w-40 h-14 alert alert-error'>Not yet passed</div>}
                </div>
                <p className='mockup-code whitespace-pre-wrap text-xs max-h-80 overflow-y-scroll font-mono'>{item.output}</p>
              </div>
            </li>)
          })}
        </ul>
        {/* Cool Terminal Window
                <div className='grid text-md w-90 text-center'>
                    <div className='self-center'>
                        <button className='btn bg-focus m-1'
                            onClick={() => executeLive(installItemState[0].command, installItemState[0], installItemState, true)}>
                            RUN
                        </button>
                    </div>
                    <div><p className='text-md'>{installItemState[0].label}</p></div>
                    <div className='mockup-code whitespace-pre-wrap text-xs max-h-80 overflow-y-scroll'>
                        {installItemState[0].output}
                        <div ref={termRef}></div>
                    </div>
                </div> */}
      </div>
    </React.Fragment>
  );
}

export default Home;
