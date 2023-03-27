import { app, Menu } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import * as remoteMain from "@electron/remote/main";
const electron = require("electron");
remoteMain.initialize();

const menuTemplate  = [
  {
    label: 'Help',
    submenu: [
      {
        label: 'Open DevTools',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        }
      },
      {
        label: 'alpaca.cpp Website',
        click: () => {
          electron.shell.openExternal('https://github.com/antimatter15/alpaca.cpp')
        }
      },
      {
        label: 'llama.cpp Website',
        click: () => {
          electron.shell.openExternal('https://github.com/ggerganov/llama.cpp')
        }
      },
    ]
  }
]

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
  });

  remoteMain.enable(mainWindow.webContents);

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
    //mainWindow.removeMenu();
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
