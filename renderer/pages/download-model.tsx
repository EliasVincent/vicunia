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
  const [downloadPercentValue, setDownloadPercentValue] = React.useState(0);
  const [downloadStatusMessage, setDownloadStatusMessage] = React.useState("");
  const [isDownloading, setIsDownloading] = React.useState(false);

  const downloadModel = () => {
    const url = "https://dl.eliasvsimon.com/model/gpt4all-lora-quantized.bin"
    const filename = "gpt4all-lora-quantized.bin"
    const modelDir = rootModelDir
    const downloader = new Downloader({
      url: url,
      directory: modelDir,
      cloneFiles: true, // do not overwrite existing files
      onProgress: (progress) => {
        setIsDownloading(true);
        setDownloadPercentValue(progress);
        setDownloadStatusMessage("Downloading model...");
        if (progress == 100.0) {
          console.log("Download complete");
          setDownloadStatusMessage("Download complete");
          setSuccess(true);
        }
      },
      onError: (err) => {
        console.log(err);
        setDownloadStatusMessage("Download failed" + err.toString());
      },
    });
    downloader.download();
    downloader.on("end", () => {
      console.log("Download complete, but this got reached???");
      progressBarRef.current.value = 100;
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
              <progress className="progress progress-primary w-56 border" value={downloadPercentValue} max="100"></progress>
            </div>
            <div className="text-center text-xl">
              {downloadStatusMessage == "" ? "" : downloadStatusMessage}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default DownloadModel;
