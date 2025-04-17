const fs = require('fs');

class Utils {

    getBase64ImgByPath(path) {
        return fs.readFileSync(path).toString('base64');
    }
}


module.exports = {
    Utils
}