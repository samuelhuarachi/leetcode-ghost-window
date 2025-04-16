

class Utils {

    getBase64ImgByPath(path) {
        return fs.readFileSync(screenshotPath).toString('base64');
    }
}