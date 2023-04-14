import React from 'react';
import Head from 'next/head';
import Navbar from './navbar';
const { shell } = require('electron');
const os = require('os');
const { exec, spawn } = require("child_process");
const path = require('path');
const Downloader = require("nodejs-file-downloader");

const rootModelDir = path.join(".", "models");
const windows = os.platform == "win32";

function DownloadModel() {
  const progressBarRef = React.useRef(null);
  const [success, setSuccess] = React.useState(false);

  const downloadModel = () => {
    const url = "https://gpt4all.io/ggml-gpt4all-j.bin"
    const filename = "ggml-gpt4all-j.bin"
    const modelDir = rootModelDir
    const downloader = new Downloader({
      url: url,
      directory: modelDir,
      cloneFiles: true, // do not overwrite existing files
      onProgress: (progress) => {
        console.log(progress);
        progressBarRef.current.value = progress;
      }
    });
    downloader.download();
    downloader.on("end", () => {
      console.log("Download complete");
      progressBarRef.current.value = 100;
    });
    downloader.on("progress", (progress) => {
      progressBarRef.current.value = progress;
      console.log(progress);
    });
  }

  return (
    <React.Fragment>
      <Head>
        <title>Download Model</title>
      </Head>
      <Navbar />
      <div className="text-center mt-5">
        <div className="">
          <div className="flex flex-col flex-wrap gap-5 items-center">
            <h1 className='text-xl'>Download Model to default directory</h1>
            <button className="btn btn-primary" onClick={downloadModel}>Download Model</button>
            <div id="progress-bar">
            <progress className="progress progress-primary w-56 border" value="0" max="100"></progress>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default DownloadModel;
