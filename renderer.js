
window.electronAPI.onTriggerScreenshot(async () => {
    const path = await window.electronAPI.captureScreen();
    alert('Screenshot saved to: ' + path);
});