const path = require("node:path")
const { app, BrowserWindow, ipcMain } = require("electron")
require("./schema.js")

if (require("electron-squirrel-startup")) {
  app.quit()
}

const initializeWindow = () => {
  const window = new BrowserWindow({
    width: 450,
    height: 600,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  window.loadFile(path.join(__dirname, "src/initialize.html"))
  window.webContents.openDevTools() // Disable this
  // Menu.setApplicationMenu(null)
}

const loginWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      // devTools: false,
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

const adminWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      // devTools: false,
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

const posWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  window.loadFile(path.join(__dirname, "src/pos.html"))
  window.maximize()
  window.webContents.openDevTools() // Disable this
  // Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
  const { DatabaseSync } = require("node:sqlite")
  const db = new DatabaseSync("./database.db")
  const hasStore = db.prepare(`select * from StoreInfo where id = ?`).get(1)
  db.close()

  if (!hasStore) initializeWindow()
  else loginWindow()

  ipcMain.on("open:loginWindow", () => {
    loginWindow()
  })

  ipcMain.on("open:adminWindow", () => {
    adminWindow()
  })

  ipcMain.on("open:posWindow", () => {
    posWindow()
  })
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    loginWindow()
  }
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
