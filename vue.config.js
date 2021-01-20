module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/physics-2048'
        : '/'
}