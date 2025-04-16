

window.electronAPI.onTriggerScreenshot(async () => {
    const path = await window.electronAPI.captureScreen();
    document.getElementById("screenshot").innerText = novaHora();
});


window.electronAPI.onTriggerScreenshot2(async () => {
    const path = await window.electronAPI.captureScreen2();
    document.getElementById("screenshot2").innerText = novaHora();
});


window.electronAPI.onTriggerScreenshot3(async () => {
    const path = await window.electronAPI.captureScreen3();
    document.getElementById("screenshot3").innerText = novaHora();
});

window.electronAPI.onTriggerAi1(async () => {
    const answers = await window.electronAPI.findAnswerUsingOneScreenshot();
    // const answers = [];

    let final_response = "";
    for (const answer of answers) {
        final_response += answer.content[0].text;
    }

    const highlightedCode = hljs.highlight(final_response.replaceAll("```javascript", "").replaceAll("```", ""),{ language: 'javascript' }).value
    document.getElementById("answer").innerHTML = highlightedCode;
});


window.addEventListener('DOMContentLoaded', async () => {
    // const screenshotBase64 = await window.electronAPI.readScreenshot();
    // const openai_respose_list = await window.electronAPI.openaiResponse({screenshotBase64});

});

function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

function novaHora() {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':');
}