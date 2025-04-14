// const { app, BrowserWindow } = require('electron/main')
const { app, BrowserWindow, globalShortcut, desktopCapturer, ipcMain, screen } = require('electron/main');
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
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: false, // keep false for security
      enableRemoteModule: false,
      sandbox: false
    }
  })

  
  win.setContentProtection(true)

  win.loadFile('index.html')

  globalShortcut.register('Control+P', () => {
    win.webContents.send('trigger-screenshot');
  });

  win.webContents.openDevTools();
}

app.commandLine.appendSwitch('enable-usermedia-screen-capturing');
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

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
  const primaryDisplay = screen.getPrimaryDisplay();
  const {width, height} = primaryDisplay.size;

  const options = {
    types: ["screen"],
    thumbnailSize: {width, height},
  }
  

  const sources = await desktopCapturer.getSources(options);
  const screenSource = sources[0];

  const image = screenSource.thumbnail.toJPEG(100);
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  fs.writeFileSync(screenshotPath, image);
  return screenshotPath;
});


// to continue: https://stackoverflow.com/questions/36753288/saving-desktopcapturer-to-video-file-in-electron
// https://www.youtube.com/watch?v=4zfU0e9VQG8

