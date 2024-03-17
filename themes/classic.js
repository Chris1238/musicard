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
        const canvas = createCanvas(1280, 450)
        const ctx = canvas.getContext("2d")

        const backgroundSvg = `<svg width="1280" height="450" viewBox="0 0 1280 450" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="816" height="270" rx="60" fill="#0e0e0e"/>
    <rect y="300" width="816" height="150" rx="60" fill="#0e0e0e"/>
    </svg>`

        const backgroundDataUrl = `data:image/svg+xml;base64,${Buffer.from(backgroundSvg).toString("base64")}`
        const background = await loadImage(backgroundDataUrl)
        ctx.drawImage(background, 0, 0)

        const thumbnailCanvas = createCanvas(564, 564)
        const thumbnailCtx = thumbnailCanvas.getContext("2d")

        const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height)
        const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2
        const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2
        const thumbnailCornerRadius = 45

        thumbnailCtx.beginPath()
        thumbnailCtx.moveTo(0 + thumbnailCornerRadius, 0)
        thumbnailCtx.arcTo(thumbnailCanvas.width, 0, thumbnailCanvas.width, thumbnailCanvas.height, thumbnailCornerRadius)
        thumbnailCtx.arcTo(thumbnailCanvas.width, thumbnailCanvas.height, 0, thumbnailCanvas.height, thumbnailCornerRadius)
        thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, thumbnailCornerRadius)
        thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, thumbnailCornerRadius)
        thumbnailCtx.closePath()
        thumbnailCtx.clip()

        thumbnailCtx.drawImage(thumbnailImage, thumbnailX, thumbnailY, thumbnailSize, thumbnailSize, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height)
        ctx.drawImage(thumbnailCanvas, 837, 8, 435, 435)

        const completed = (progress / 100) * 670
        const circleX = completed + 60

        const progressBarCanvas = createCanvas(670, 25)
        const progressBarCtx = progressBarCanvas.getContext("2d")
        const cornerRadius = 10

        progressBarCtx.beginPath()
        progressBarCtx.moveTo(cornerRadius, 0)
        progressBarCtx.lineTo(670 - cornerRadius, 0)
        progressBarCtx.arc(670 - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI)
        progressBarCtx.lineTo(670, 25 - cornerRadius)
        progressBarCtx.arc(670 - cornerRadius, 25 - cornerRadius, cornerRadius, 0, 0.5 * Math.PI)
        progressBarCtx.lineTo(cornerRadius, 25)
        progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI)
        progressBarCtx.lineTo(0, cornerRadius)
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI)
        progressBarCtx.closePath()
        progressBarCtx.fillStyle = "#ababab"
        progressBarCtx.fill()
        progressBarCtx.beginPath()
        progressBarCtx.moveTo(cornerRadius, 0)
        progressBarCtx.lineTo(completed - cornerRadius, 0)
        progressBarCtx.arc(completed - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI)
        progressBarCtx.lineTo(completed, 25)
        progressBarCtx.lineTo(cornerRadius, 25)
        progressBarCtx.arc(cornerRadius, 25 - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI)
        progressBarCtx.lineTo(0, cornerRadius)
        progressBarCtx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI)
        progressBarCtx.closePath()
        progressBarCtx.fillStyle = color
        progressBarCtx.fill()

        const circleCanvas = createCanvas(1000, 1000)
        const circleCtx = circleCanvas.getContext("2d")

        const circleRadius = 20
        const circleY = 97

        circleCtx.beginPath()
        circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI)
        circleCtx.fillStyle = color
        circleCtx.fill()

        ctx.drawImage(progressBarCanvas, 70, 340, 670, 25)
        ctx.drawImage(circleCanvas, 10, 255, 1000, 1000)

        ctx.fillStyle = color
        ctx.font = "75px extrabold"
        ctx.fillText(name, 70, 120)

        ctx.fillStyle = "#b8b8b8"
        ctx.font = "50px semibold"
        ctx.fillText(author, 75, 190)

        ctx.fillStyle = "#fff"
        ctx.font = "30px semibold"
        ctx.fillText(startTime, 70, 410)

        ctx.fillStyle = "#fff"
        ctx.font = "30px semibold"
        ctx.fillText(endTime, 670, 410)
        return canvas.toBuffer("image/png")
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = { Classic }