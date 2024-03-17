const { createCanvas, loadImage } = require("@napi-rs/canvas")
const { colorFetch } = require("../utils/colorFetch")

async function Classic({
    thumbnail,
    progress,
    name,
    author,
    startTime,
    endTime,
}) {
    if (!progress) progress = 0
    if (!name) name = "Musicard"
    if (!author) author = "By Unburn"
    if (!startTime) startTime = "0:00"
    if (!endTime) endTime = "4:00"

    const color = `#${await colorFetch("auto", 50, thumbnail)}`
    let thumbnailImage

    try {
        thumbnailImage = await loadImage(thumbnail, {
            requestOptions: {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
                }
            }
        })
    } catch {
        throw new Error("Failed to load thumnail image")
    }

    if (progress < 2) {
        progress = 2
    } else if (progress > 98) {
        progress = 98
    }

    if (name.length > 15) {
        name = name.slice(0, 15) + ".."
    }

    if (author.length > 15) {
        author = author.slice(0, 15) + ".."
    }

    /* if (name.length > 15) name = name.slice(0, 13) + ".."
    if (author.length > 15) author = author.slice(0, 13) + ".." */

    try {
        const canvas = createCanvas(1320, 450)
        const ctx = canvas.getContext("2d")

        /* const backgroundSvg = `<svg width="2458" height="837" viewBox="0 0 2458 837" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1568" height="512" rx="80" fill="#0e0e0e"/>
    <rect y="565" width="1568" height="272" rx="80" fill="#0e0e0e"/>
    </svg>`

        const backgroundDataUrl = `data:image/svg+xml;base64,${Buffer.from(backgroundSvg).toString("base64")}`
        const background = await loadImage(backgroundDataUrl)
        ctx.drawImage(background, 0, 0, 1280, 450) */

        const background = await loadImage("https://i.imgur.com/tkTjm3n.png");
        ctx.drawImage(background, 0, 0, 1320, 450);

        // ---------------------------------
        const thumbnailCanvas = createCanvas(564, 564)
        const thumbnailCtx = thumbnailCanvas.getContext("2d")

        const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height)
        const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2
        const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2
        const thumbnailCornerRadius = 60

        thumbnailCtx.beginPath()
        thumbnailCtx.moveTo(0 + thumbnailCornerRadius, 0)
        thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, thumbnailCornerRadius)
        thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, thumbnailCornerRadius)
        thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, thumbnailCornerRadius)
        thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, thumbnailCornerRadius)
        thumbnailCtx.closePath()
        thumbnailCtx.clip()

        thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height)
        ctx.drawImage(thumbnailCanvas, 870, 0, 450, 450)
        // ---------------------------------

        const barwidth = (progress / 100) * 685
        const progressBarCanvas = createCanvas(685, 25)
        const progressBarCtx = progressBarCanvas.getContext("2d")
        const cornerRadius = 10

        progressBarCtx.beginPath()
        progressBarCtx.moveTo(cornerRadius, 0)
        progressBarCtx.lineTo(685 - cornerRadius, 0)
        progressBarCtx.arc(685 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI)
        progressBarCtx.lineTo(685, 25 - cornerRadius)
        progressBarCtx.arc(685 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI)
        progressBarCtx.lineTo(cornerRadius, 25)
        progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI)
        progressBarCtx.lineTo(0, cornerRadius)
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI)
        progressBarCtx.closePath()
        progressBarCtx.fillStyle = "#ababab"
        progressBarCtx.fill()

        progressBarCtx.beginPath()
        progressBarCtx.moveTo(cornerRadius, 0)
        progressBarCtx.lineTo(barwidth - cornerRadius, 0)
        progressBarCtx.arc(barwidth - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI)
        progressBarCtx.lineTo(barwidth, 25)
        progressBarCtx.lineTo(barwidth, 25)
        progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI)
        progressBarCtx.lineTo(0, cornerRadius)
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI)
        progressBarCtx.closePath()
        progressBarCtx.fillStyle = color
        progressBarCtx.fill()

        ctx.drawImage(progressBarCanvas, 75, 335+13)
        // ---------------------------------
        const circlewidth = (progress / 100) * 675
        const circleCanvas = createCanvas(circlewidth+60, 60+25)
        const circleCtx = circleCanvas.getContext("2d")

        circleCtx.beginPath()
        circleCtx.arc(circlewidth+5+10, 25, 20, 0, 2 * Math.PI)
        circleCtx.fillStyle = color
        circleCtx.fill()

        ctx.drawImage(circleCanvas, 75-10, 335)
        // ---------------------------------
        ctx.fillStyle = color
        ctx.font = "70px extrabold"
        ctx.fillText(name, 75, 120)

        ctx.fillStyle = "#b8b8b8"
        ctx.font = "50px semibold"
        ctx.fillText(author, 80, 190);

        ctx.fillStyle = "#fff"
        ctx.font = "30px semibold"
        ctx.fillText(startTime, 75, 415);

        ctx.fillStyle = "#fff"
        ctx.font = "30px semibold"
        ctx.fillText(endTime, 685, 415);
        // ---------------------------------
        return canvas.toBuffer("image/png")
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = { Classic }
