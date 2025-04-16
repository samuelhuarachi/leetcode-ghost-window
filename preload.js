const { contextBridge, ipcRenderer  } = require('electron');

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
  onTriggerScreenshot2: (callback) => ipcRenderer.on('trigger-screenshot2', callback),
  onTriggerScreenshot3: (callback) => ipcRenderer.on('trigger-screenshot3', callback),
  onTriggerAi1: (callback) => ipcRenderer.on('trigger-ai1', callback),
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  captureScreen2: () => ipcRenderer.invoke('capture-screen2'),
  captureScreen3: () => ipcRenderer.invoke('capture-screen3'),
  findAnswerUsingOneScreenshot: () => ipcRenderer.invoke('find-answer-using-one-screenshot'),
  readScreenshot: () => ipcRenderer.invoke('read-screenshot'),
  openaiResponse: (args) => ipcRenderer.invoke('openai-response', args)
});

