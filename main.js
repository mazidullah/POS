const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('node:path')
require("./database.js")
const {DatabaseSync} = require("node:sqlite")
const db = new DatabaseSync("./database.db")

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createStoreWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  window.loadFile(path.join(__dirname, "src/create-store.html"))
  window.maximize()
  window.webContents.openDevTools() // Disable this
  // Menu.setApplicationMenu(null)
}

const createLoginWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  window.loadFile(path.join(__dirname, "src/login.html"))
  window.maximize()
  window.webContents.openDevTools() // Disable this
  // Menu.setApplicationMenu(null)
}

const createAdminWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  window.loadFile(path.join(__dirname, "src/admin.html"))
  window.maximize()
  window.webContents.openDevTools() // Disable this
  // Menu.setApplicationMenu(null)
}

const createWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,

      preload: path.join(__dirname, "preload.js")
    },
  })

  window.loadFile(path.join(__dirname, "src/index.html"))
  window.maximize()
  window.webContents.openDevTools() // Disable this
  Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
  if (!db.prepare(`select * from StoreInfo where id = ?`).get(1)) createStoreWindow()
  else createLoginWindow()

  ipcMain.on("open:login", () => {
    createLoginWindow()
  })

  ipcMain.on("open:adminWindow", () => {
    createAdminWindow()
  })

  ipcMain.on("open:window", () => {
    createWindow()
  })
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

