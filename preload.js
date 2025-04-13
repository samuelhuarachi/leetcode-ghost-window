const { contextBridge, ipcRenderer, desktopCapturer  } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
})

contextBridge.exposeInMainWorld('electronAPI', {
  onTriggerScreenshot: (callback) => ipcRenderer.on('trigger-screenshot', callback),
  captureScreen: () => ipcRenderer.invoke('capture-screen')
});

