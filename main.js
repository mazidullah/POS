const path = require("node:path")
const { app, BrowserWindow, ipcMain } = require("electron")
require("./schema.js")

if (require("electron-squirrel-startup")) {
  app.quit()
}

const initializeWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  window.loadFile(path.join(__dirname, "src/initialize.html"))
  window.maximize()
  window.webContents.openDevTools() // Disable this
  // Menu.setApplicationMenu(null)
}

const window = () => {
  const window = new BrowserWindow({
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  })

  window.loadFile(path.join(__dirname, "src/index.html"))
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
  else window()

  ipcMain.on("open:window", () => {
    window()
  })
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    posWindow()
  }
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
