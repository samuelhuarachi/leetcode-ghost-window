require('dotenv').config();
const { app, BrowserWindow, globalShortcut, desktopCapturer, ipcMain, screen } = require('electron/main');
const path = require('node:path')
const fs = require('fs');

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

  // to sure get primary display screen
  const primarySource = sources.find((source) => source.display_id == primaryDisplay.id)

  const screenSource = sources[0];
  const image = screenSource.thumbnail.toJPEG(100);
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  fs.writeFileSync(screenshotPath, image);
  return screenshotPath;
});

ipcMain.handle('read-screenshot', async () => {
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  return fs.readFileSync(screenshotPath).toString('base64');
})


ipcMain.handle('openai-response', async (event, {screenshotBase64}) => {
  const openai_api_key = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openai_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            {
              role: 'user',
              content: [
                { type: 'input_text', text: 'Here is a LeetCode problem shown in one or more screenshots. Give me only the solution in JavaScript. No explanation.' },
                {
                  type: 'input_image',
                  image_url: `data:image/jpeg;base64,${screenshotBase64}`
                },
              ],
            },
          ],
        }),
  });

  const openai_response = await response.json();
  return openai_response.output;
})

/* curl https://api.openai.com/v1/responses/resp_67fda268df2481928450f8aaed3c89c603623c968ff16c30 \
  -H "Authorization: Bearer tokennn_here */


// to continue: https://stackoverflow.com/questions/36753288/saving-desktopcapturer-to-video-file-in-electron
// https://www.youtube.com/watch?v=4zfU0e9VQG8


// title: LeetCode Problem (Image) – Just JavaScript Answer
// input 1: Here is a LeetCode problem shown in one or more screenshots. Give me only the solution in JavaScript. No explanation.
// input 2: These images together contain a LeetCode problem. Just solve it and give me the full JavaScript code only.