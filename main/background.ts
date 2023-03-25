import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import * as remoteMain from "@electron/remote/main";
const electron = require("electron");
remoteMain.initialize();

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: __dirname + "/preload.js",
    },
  });

  remoteMain.enable(mainWindow.webContents);

  const ipcMain = electron.ipcMain;
  const dialog = electron.dialog;
  let dir;
  ipcMain.on("open-folder-dialog", (event) => {
    dir = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"],
    });
    event.returnValue = dir;
    event.sender.send("selected-directory", dir);
    console.log(dir);
  });
  
  ipcMain.on("open-dev-tools", (event) => {
    mainWindow.webContents.openDevTools();
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
    mainWindow.removeMenu();
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
