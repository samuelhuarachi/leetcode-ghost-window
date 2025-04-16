
class ChatGptHelper {

    #openai_api_key;
    #utils;

    constructor(utils) {
        this.#openai_api_key = process.env.OPENAI_API_KEY;
        this.#utils = utils;
    }
    
    async doRequest(payload) {
        const response = await fetch('https://api.openai.com/v1/responses', payload);
        return await response.json();
    }

    #buildChatgptPayloadByNumberOfScreenshots(HowManyScreenShotIWillUse = 1) {
      const rules_for_ai = [];
      rules_for_ai.push({ type: 'input_text', text: 'Here is a LeetCode problem shown in one or more screenshots. Give me only the solution in JavaScript. No explanation.' });

      for (let index = 1; index <= HowManyScreenShotIWillUse; index++) {
        let screenshotName = "screenshot.png"
        if (index == 2) {
          screenshotName = "screenshot2.png"
        } else {
          screenshotName = "screenshot3.png"
        }

        const base64Img = this.#utils.getBase64ImgByPath(path.join(__dirname, "screenshots", screenshotName));
        rules_for_ai.push({
          type: 'input_image',
          image_url: `data:image/jpeg;base64,${base64Img}`
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