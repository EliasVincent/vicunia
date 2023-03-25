import React from 'react'
import { ServerSettings } from '../components/ServerSettings';

const os = require('os');
const path = require('path');
const fs = require('fs');

const defaultFolder = path.join(os.homedir(), "alpaca.cpp");

function SettingsModal() {

  const [settings, setSettings] = React.useState<ServerSettings>({
    folderPath: defaultFolder,
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
  })

  // load settings from file
  const loadSettings = () => {
    const settingsFile = path.join(os.homedir(), ".vicunia-settings.json");
    fs.readFile(settingsFile, (err: any, data: any) => {
      // write default settings if file doesn't exist
      if (err) {
        console.log("Settings file not found, creating new one...");
        saveSettings();
        return;
      }
      console.log(data);
      setSettings(JSON.parse(data));
      console.log("Successfully Read File.");
    });
  }


  // save settings to file
  const saveSettings = () => {
    const settingsFile = path.join(os.homedir(), ".vicunia-settings.json");
    fs.writeFile(settingsFile, JSON.stringify(settings), (err: any) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  }

  React.useEffect(() => {
    console.log("settings changed");
    console.log(settings);
  }, [settings])

  // like componentDidMount
  React.useEffect(() => {
    loadSettings();
  }, [])


  return (
    <React.Fragment>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal backdrop-blur-sm">
        <div className="modal-box">

          <h3 className="font-bold text-lg mb-5 w-full">Options</h3>

          <div className="modal-body flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="folder-path" className="font-bold ml-2 mb-1">Folder Path</label>
              <input type="text" id="folder-path" className="input input-bordered" value={settings.folderPath} onChange={(e) => setSettings({ ...settings, folderPath: e.target.value })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="t" className="font-bold ml-2 mb-1">Threads</label>
              <input type="number" step="1" id="t" className="input input-bordered" value={settings.llamaSettings.t} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, t: parseInt(e.target.value) } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="num-of-tokens" className="font-bold ml-2 mb-1">Num of Tokens</label>
              <input type="number" step="1" id="num-of-tokens" className="input input-bordered" value={settings.llamaSettings.numOfTokens} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, numOfTokens: parseInt(e.target.value) } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="repetition-penalty" className="font-bold ml-2 mb-1">Repetition Penalty</label>
              <input type="number" step="0.1" id="repetition-penalty" className="input input-bordered" value={settings.llamaSettings.repetitionPenalty} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, repetitionPenalty: parseFloat(e.target.value) } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="is-reverse" className="font-bold ml-2 mb-1">Is Reverse</label>
              <input type="checkbox" id="is-reverse" className="toggle toggle-primary" checked={settings.llamaSettings.isReverse} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, isReverse: e.target.checked } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="reverse-message" className="font-bold ml-2 mb-1">Reverse Message</label>
              <input type="text" id="reverse-message" className="input input-bordered" value={settings.llamaSettings.reverseMessage} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, reverseMessage: e.target.value } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="temp" className="font-bold ml-2 mb-1">Temp</label>
              <input type="number" step="0.1" id="temp" className="input input-bordered" value={settings.llamaSettings.temp} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, temp: parseFloat(e.target.value) } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="top-p" className="font-bold ml-2 mb-1">Top P</label>
              <input type="number" step="0.1" id="top-p" className="input input-bordered" value={settings.llamaSettings.topP} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, topP: parseFloat(e.target.value) } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="top-k" className="font-bold ml-2 mb-1">Top K</label>
              <input type="number" step="1" id="top-k" className="input input-bordered" value={settings.llamaSettings.topK} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, topK: parseInt(e.target.value) } })} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="repeat-last-n" className="font-bold ml-2 mb-1">Repeat Last N</label>
              <input type="number" step="1" id="repeat-last-n" className="input input-bordered" value={settings.llamaSettings.repeatLastN} onChange={(e) => setSettings({ ...settings, llamaSettings: { ...settings.llamaSettings, repeatLastN: parseInt(e.target.value) } })} />
            </div>
          </div>


          <div className="modal-action">
            <button className="btn btn-primary" onClick={saveSettings}>Save</button>
            <label htmlFor="my-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SettingsModal;
