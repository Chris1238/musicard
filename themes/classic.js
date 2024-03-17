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
        const canvas = createCanvas(2458, 837)
        const ctx = canvas.getContext("2d")

        const backgroundSvg = `<svg width="2458" height="837" viewBox="0 0 2458 837" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1568" height="512" rx="80" fill="#0e0e0e"/>
    <rect y="565" width="1568" height="272" rx="80" fill="#0e0e0e"/>
    </svg>`

        const backgroundDataUrl = `data:image/svg+xml;base64,${Buffer.from(backgroundSvg).toString("base64")}`
        const background = await loadImage(backgroundDataUrl)
        ctx.drawImage(background, 0, 0)

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
        ctx.drawImage(thumbnailCanvas, 1621, 0, 837, 837)
        // ---------------------------------

        const completed = (progress / 100) * 1342
        const progressBarCanvas = createCanvas(1342, 47)
        const progressBarCtx = progressBarCanvas.getContext("2d")
        const cornerRadius = 20

        progressBarCtx.beginPath()
        progressBarCtx.moveTo(cornerRadius, 0)
        progressBarCtx.lineTo(1342 - cornerRadius, 0)
        progressBarCtx.arc(1342 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI)
        progressBarCtx.lineTo(1342, 47 - cornerRadius)
        progressBarCtx.arc(1342 - cornerRadius, 47 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI)
        progressBarCtx.lineTo(cornerRadius, 47)
        progressBarCtx.arc(cornerRadius, 47 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI)
        progressBarCtx.lineTo(0, cornerRadius)
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI)
        progressBarCtx.closePath()
        progressBarCtx.fillStyle = "#ababab"
        progressBarCtx.fill()
        progressBarCtx.beginPath()
        progressBarCtx.moveTo(cornerRadius, 0)
        progressBarCtx.lineTo(completed - cornerRadius, 0)
        progressBarCtx.arc(completed - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI)
        progressBarCtx.lineTo(completed, 47)
        progressBarCtx.lineTo(cornerRadius, 47)
        progressBarCtx.arc(cornerRadius, 47 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI)
        progressBarCtx.lineTo(0, cornerRadius)
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI)
        progressBarCtx.closePath()
        progressBarCtx.fillStyle = color
        progressBarCtx.fill()

        ctx.drawImage(progressBarCanvas, 113, 635+13)
        // ---------------------------------
        const circleCanvas = createCanvas(completed+60+60, 60+37.5)
        const circleCtx = circleCanvas.getContext("2d")

        circleCtx.beginPath()
        circleCtx.arc(completed+5, 37.5, 30, 0, 2 * Math.PI)
        circleCtx.fillStyle = color
        circleCtx.fill()

        ctx.drawImage(circleCanvas, 113-5, 635)
        // ---------------------------------
        ctx.fillStyle = color
        ctx.font = "124px extrabold"
        ctx.fillText(name, 113, 230)

        ctx.fillStyle = "#b8b8b8"
        ctx.font = "87px semibold"
        ctx.fillText(author, 113, 370)

        ctx.fillStyle = "#fff"
        ctx.font = "50px semibold"
        ctx.fillText(startTime, 113, 768)

        ctx.fillStyle = "#fff"
        ctx.font = "50px semibold"
        ctx.fillText(endTime, 1332, 768)
        // ---------------------------------
        return canvas.toBuffer("image/png")
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = { Classic }
