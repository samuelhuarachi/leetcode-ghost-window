require('dotenv').config();
const { app, BrowserWindow, globalShortcut, desktopCapturer, ipcMain, screen } = require('electron/main');
const path = require('node:path')
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 400,
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

  
  win.setContentProtection(false); // <-- GHOST 
  win.setAlwaysOnTop(true, 'screen');
  win.loadFile('index.html');

  globalShortcut.register('Control+shift+1', () => {
    win.webContents.send('trigger-screenshot');
  });

  globalShortcut.register('Control+shift+2', () => {
    win.webContents.send('trigger-screenshot2');
  });

  globalShortcut.register('Control+shift+3', () => {
    win.webContents.send('trigger-screenshot3');
  });

  globalShortcut.register('Control+shift+a', () => {
    win.webContents.send('trigger-ai1');
  });


  // win.webContents.openDevTools();
  win.setMenu(null);
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

ipcMain.handle('capture-screen2', async () => {
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
  const screenshotPath = path.join(__dirname, 'screenshot2.png');
  fs.writeFileSync(screenshotPath, image);
  return screenshotPath;
});

ipcMain.handle('capture-screen3', async () => {
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
  const screenshotPath = path.join(__dirname, 'screenshot3.png');
  fs.writeFileSync(screenshotPath, image);
  return screenshotPath;
});

ipcMain.handle('read-screenshot', async () => {
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  return fs.readFileSync(screenshotPath).toString('base64');
})


ipcMain.handle('find-answer-using-one-screenshot', async () => {
  const openai_api_key = process.env.OPENAI_API_KEY;
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  const screenshot1_base64 =  fs.readFileSync(screenshotPath).toString('base64');

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
                  image_url: `data:image/jpeg;base64,${screenshot1_base64}`
                },
              ],
            },
          ],
        }),
  });

  const openai_response = await response.json();
  return openai_response.output;
})

// {
//   error: {
//     message: 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.',
//     type: 'insufficient_quota',
//     param: null,
//     code: 'insufficient_quota'
//   }
// }

ipcMain.handle('openai-response', async (event, {screenshotBase64}) => {
  const openai_api_key = process.env.OPENAI_API_KEY;
})



/* curl https://api.openai.com/v1/responses/resp_67fee0530dc08192a07731b805e4c0700b994dcba53f8fb8 \
  -H "Authorization: Bearer tokennn_here */


// to continue: https://stackoverflow.com/questions/36753288/saving-desktopcapturer-to-video-file-in-electron
// https://www.youtube.com/watch?v=4zfU0e9VQG8


// title: LeetCode Problem (Image) – Just JavaScript Answer
// input 1: Here is a LeetCode problem shown in one or more screenshots. Give me only the solution in JavaScript. No explanation.
// input 2: These images together contain a LeetCode problem. Just solve it and give me the full JavaScript code only.