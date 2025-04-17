const path = require('node:path')

class ChatGptHelper {

    #openai_api_key;
    #utils;
    #quantityScreenshotToUse;

    constructor({utils, openai_api_key, quantityScreenshotToUse}) {
        this.#openai_api_key = openai_api_key;
        this.#utils = utils;
        this.#quantityScreenshotToUse = quantityScreenshotToUse;
    }
    
    async doRequest() {
      const payload = this.#buildChatgptPayloadByNumberOfScreenshots(this.#quantityScreenshotToUse);
      const response = await fetch('https://api.openai.com/v1/responses', payload);
      return response.json();
    }

    #buildChatgptPayloadByNumberOfScreenshots(quantityScreenshotToUse = 1) {
      const rules_for_ai = [];
      rules_for_ai.push({ type: 'input_text', text: 'Here is a LeetCode problem shown in one or more screenshots. Give me only the solution in JavaScript. No explanation. Please, don\'t change variables names.' });

      for (let index = 1; index <= quantityScreenshotToUse; index++) {
        let screenshotName = "screenshot.png"
        if (index == 2) {
          screenshotName = "screenshot2.png"
        } else if (index == 3) {
          screenshotName = "screenshot3.png"
        }

        const base64Img = this.#utils.getBase64ImgByPath(path.join(__dirname, "/../screenshots", screenshotName));
        rules_for_ai.push({
          type: 'input_image',
          image_url: `data:image/png;base64,${base64Img}`
        });
      }

      return {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.#openai_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            {
              role: 'user',
              content: rules_for_ai,
            },
          ],
        }),
      }
    }
}

module.exports = {
  ChatGptHelper
}