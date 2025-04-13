// const { app, BrowserWindow } = require('electron/main')
const { app, BrowserWindow, globalShortcut, desktopCapturer, ipcMain } = require('electron/main');
const path = require('node:path')
const fs = require('fs');

// We are using Node.js 20.18.3, Chromium 130.0.6723.191, and Electron 33.4.9.


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundThrottling : true,
    hasShadow: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  
  win.setContentProtection(true)

  win.loadFile('index.html')

  globalShortcut.register('Control+P', () => {
    win.webContents.send('trigger-screenshot');
  });
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

ipcMain.handle('capture-screen', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });

  const screenSource = sources[0];

  const image = screenSource.thumbnail.toPNG();
  const screenshotPath = path.join(__dirname, 'screenshot.png');

  fs.writeFileSync(screenshotPath, image);
  return screenshotPath;
});