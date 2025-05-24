
let x = 0
let y = 0
let k = 100
const screen_width = 1500
const screen_height = 800
const max_count = 10000
let mouse_clicked = false
tags = Object.values(tag_json[0]["tag"]).slice(0, max_count)
xs = Object.values(tag_json[0]["x"]).slice(0, max_count)
ys = Object.values(tag_json[0]["y"]).slice(0, max_count)
let search_id = -1
function pos_trans([a, b]) {
    return [(a - (x - screen_width * 0.5 / k)) * k, (b - (y - screen_height * 0.5 / k)) * k]
}
function len_trans(l) {
    return l * k
}
function draw() {
    window.requestAnimationFrame(draw)
    const canvas = document.getElementById("canvas")
    canvas.addEventListener("mousemove", (ev) => {
        if (mouse_clicked) {
            x -= ev.movementX / (200 * k)
            y -= ev.movementY / (200 * k)
        }

    })
    canvas.addEventListener("mousedown", (ev) => {
        mouse_clicked = true
    })
    canvas.addEventListener("mouseup", (ev) => {
        mouse_clicked = false
    })
    canvas.addEventListener("mouseout", (ev) => {
        mouse_clicked = false
    })
    canvas.addEventListener("wheel", (ev) => {
        ev.preventDefault()
        k += ev.deltaY * 0.0005 * Math.log(k / 5)
        k = Math.min(Math.max(10, k), 10000)
    })
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, screen_width, screen_height)
        //ctx.fillRect(0, 0, screen_width, screen_height)
        /*
        ctx.fillStyle = "rgb(200 0 0)";
        ctx.fillRect(pos_trans([10, 10])[0], pos_trans([10, 10])[1], len_trans(50), len_trans(50));

        ctx.fillStyle = "rgb(0 0 200 / 50%)";
        ctx.fillRect(pos_trans([30, 30])[0], pos_trans([30, 30])[1], len_trans(50), len_trans(50));
        */
        ctx.font = "10px serif"
        ctx.globalAlpha = 0.8
        for (i = 0; i < tags.length; i++) {
            pos = pos_trans([xs[i], ys[i]])
            if (i == search_id) {
                ctx.fillStyle = "green"
            } else {
                ctx.fillStyle = "black"
            }
            ctx.font = Math.floor(10 + 10 * (tags.length - i) / tags.length) + "px serif"
            ctx.fillText(tags[i], pos[0], pos[1])
        }
        ctx.globalAlpha = 1
        ctx.font = "bold 15px serif"
        ctx.fillStyle = "purple"
        ctx.fillText("x:" + Math.floor(x * 100) / 100
            + ", y:" + Math.floor(y * 100) / 100
            + ", k:" + Math.floor(k * 100) / 100, screen_width - 200, screen_height - 10)
    }
}
window.addEventListener("load", draw)

tag_input = document.getElementById("tag_input")
button = document.getElementById("button")

button.addEventListener("click", (ev) => {
    search_id = tags.indexOf(tag_input.value)
    if (search_id != -1) {
        x = xs[search_id]
        y = ys[search_id]
    }
})
tag_input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        button.dispatchEvent(new PointerEvent("click"))
        e.preventDefault()
    }
})