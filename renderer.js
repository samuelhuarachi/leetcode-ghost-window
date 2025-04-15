

window.electronAPI.onTriggerScreenshot(async () => {
    const path = await window.electronAPI.captureScreen();
    alert('Screenshot saved to: ' + path);
});


window.addEventListener('DOMContentLoaded', async () => {
    const screenshotBase64 = await window.electronAPI.readScreenshot();
    document.getElementById('openai-response').innerText = ":)";


    const openai_respose_list = await window.electronAPI.openaiResponse({screenshotBase64});
    console.log("openai_respose_list", openai_respose_list);

    // for (const response of openai_respose_list) {
    //     console.log("response >>", response);
    // }
});