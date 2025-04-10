const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

// We are using Node.js 20.18.3, Chromium 130.0.6723.191, and Electron 33.4.9.


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundThrottling : true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  
  win.setContentProtection(true)

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})