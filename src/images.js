var context = require.context("./assets/images", false, /\.png$/);

export default {
    speed: context("./speed.png")
}