
window.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("log-content").innerHTML += '<br> [SYSTEM] sistema iniciado';
    document.getElementById("log-content").innerHTML += '<br> [APP] aguardando screenshot';
    document.getElementById("log-content").innerHTML += '<br> [HELPER] você pode apertar ctrl+shift+1 para tirar o primeiro screenshot';
});

window.electronAPI.onTriggerScreenshot(async () => {
    const path = await window.electronAPI.captureScreen();
    document.getElementById("log-content").innerHTML += '<br> [APP] opa! recebi o screenshot 1 as ' + novaHora();
});


window.electronAPI.onTriggerScreenshot2(async () => {
    const path = await window.electronAPI.captureScreen2();
    document.getElementById("log-content").innerHTML += '<br> [APP] opa! recebi o screenshot 2 as ' + novaHora();
});


window.electronAPI.onTriggerScreenshot3(async () => {
    const path = await window.electronAPI.captureScreen3();
    document.getElementById("log-content").innerHTML += '<br> [APP] opa! recebi o screenshot 3 as ' + novaHora();
});

window.electronAPI.onTriggerAi1(async () => {
    const openai_api_key = document.getElementById("apikey").value;
    const answers = await window.electronAPI.findAnswerUsingScreenshot({quantityScreenshotToUse: 1, openai_api_key});  
    renderAnswer({answers});
});

function renderAnswer({answers}) {
    if (!Array.isArray(answers) && !answers.hasOwnProperty("output")) {
        document.getElementById("response-text").innerHTML = answers.error.message; 
        return;
    }

    let final_response = "";


    for (const answer of answers) {
        final_response += answer.content[0].text;
    }

    const highlightedCode = hljs.highlight(final_response.replaceAll("```javascript", "").replaceAll("```", ""),{ language: 'javascript' }).value
    document.getElementById("response-text").innerHTML = highlightedCode;
}


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