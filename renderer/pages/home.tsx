import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from './navbar';
import { prepareCommand } from '../components/utils';

const os = require('os');
const { exec, spawn } = require("child_process");


const wrenchScrewdriver = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
)

const play = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
)

const chat = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
  </svg>

)

function openServerWindow(url: String, external: boolean = false): void {
  // execute `npx dalai serve` and after its done open the browser
  const spawnCommand = prepareCommand("npx dalai serve -y");
  const child = spawn(spawnCommand[0], spawnCommand.slice(1));

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  const { BrowserWindow } = require('@electron/remote')
  if (external) {
    if (os.platform() === "win32") {
      exec(`start ${url}`);
    } else if (os.platform() === "darwin") {
      exec(`open ${url}`);
    } else if (os.platform() === "linux") {
      exec(`xdg-open ${url}`);
    }
  } else {
    let win = new BrowserWindow({ width: 800, height: 600 })
    win.loadURL(url)
    // handle connection error by reloading the page
    win.webContents.on('did-fail-load', () => {
      win.reload()
    })
  }
}

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Vicunia</title>
      </Head>
      <Navbar />
      <div className='flex items-center justify-center w-full mt-20 bg-gradient-to-tr from-neutral to-base-100'>
        <div className='m-2 w-full h-80 flex max-[500px]:flex-wrap justify-evenly'>
          <Link href='/server'>
            <a className='btn-primary w-full m-4 rounded flex items-center justify-center text-center cursor-pointer bg-gradient-to-tr from-primary to-secondary hover:scale-105 transition-all duration-200 ease-in-out'

            >
              {play}
              <p className='flex text-2xl'>Start</p>
            </a>
          </Link>
          <Link href='/download-model'>
            <a className='btn-secondary w-full m-4 rounded flex items-center justify-center text-center bg-gradient-to-br from-secondary to-accent hover:scale-105 transition-all duration-200 ease-in-out '>
              {wrenchScrewdriver}
              <p className='flex text-2xl'>Setup</p>
              <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
