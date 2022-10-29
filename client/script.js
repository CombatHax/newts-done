/*
FIRST LAW: An object in motion stays in motion and an object at rest stays in rest
SECOND LAW: An object's acceleration increases with more force and less mass.
*/
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }
const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
console.log(ctx);
let size = [cnv.clientWidth, cnv.clientHeight];
let mass = 40;
let accel = [0, 0];
const forces = [0, 0, 0, 0];
const gradient = ctx.createLinearGradient(0, 0, 800, 600);
// ROYGBP
gradient.addColorStop(0, "red");
gradient.addColorStop(1, "orange");
window.addEventListener("resize", e => {
    size = [cnv.clientWidth, cnv.clientHeight]
})
window.addEventListener("keydown", e => {
    if(e.key == "+") mass++;
    else if(e.key == "-" || e.key == "_") mass--;
    if(mass <= 0) mass = 1;
    /*
    0 U
    1 R
    2 D
    3 L
    */
    let dir = -1;
    switch(e.key) {
        case "ArrowLeft":
            dir++;
        case "ArrowDown":
            dir++;
        case "ArrowRight":
            dir++;
        case "ArrowUp":
            dir++;
    }
    let op = e.shiftKey ? -1 : 1;
    forces[dir] += op
    if(dir === -1) {
        if(e.key === "Enter" || e.key == "Return") {
            accel[0] += forces[1] - forces[3];
            accel[1] += forces[2] - forces[0];
            // R U L D
            let arrows = ["&#8592;", "&#8593;", "&#8594;", "&#8595;"]
            document.getElementById("net-force").innerHTML =
                `The net force is:
                ${Math.abs(accel[0])} N ${accel[0] < 0 ? arrows[0] : arrows[2]}
                ${Math.abs(accel[1])} N ${accel[1] < 0 ? arrows[1] : arrows[3]}`
        }
    }
})
const backOff = [0, 0];
const getBlock = () => {
    return [(size[0] - mass) / 2, (size[1] - mass) / 2];
}
const draw = () => {
    // Background
    let ind = 0;
    backOff[0] -= accel[0] / mass;
    backOff[1] -= accel[1] / mass;
    for(let x = -100; x <= 800 + 100; x += 10) {
        for(let y = -100; y <= 600 + 100; y += 10) {
            ctx.fillStyle = ind % 2 ? "#ddd" : "#aaa";
            ctx.fillRect(x + backOff[0] % 100, y + backOff[1] % 100, 10, 10);
            ind++;
        }
    }
    // Dude + Text
    ctx.fillStyle = gradient;
    block = getBlock();
    /*
    ctx.fillRect(block[0], block[1], mass, mass);
    */
    ctx.roundRect(block[0], block[1], mass, mass, 15).fill();;
    ctx.font = "20px Comic Sans MS";
    const stuff = ["alphabetic", "middle", "top", "middle"];
    const poss = [
        [block[0], block[1]],
        [block[0] + mass, block[1] + mass/2],
        [block[0], block[1] + mass]
    ]
    for(let i = 0; i < 4; i++) {
        ctx.textBaseline = stuff[i]
        const mes = ctx.measureText(`${forces[0]} N`);
        const tsize = [mes.width, mes.height];
        const pos = i < 3 ? poss[i] : [block[0] - tsize[0], block[1] + mass/2]
        if(i % 2 === 0 && i != 3) {
            pos[0] += mass / 2 - tsize[0] / 2
        }
        ctx.fillText(`${forces[i]} N`, pos[0], pos[1], mass);
    }
    // UI
    ctx.font = "50px Comic Sans MS";
    ctx.fillStyle = "#000";
    ctx.textBaseline = "top";
    ctx.fillText(`Mass: ${mass}`, 0, 10, 800);
    ctx.font = "15px sans-serif";
    const width = ctx.measureText("Scroll down to see the laws and how they apply").width;
    ctx.fillText("Scroll down to see the laws and how they apply", 800 - width, 0);
}
const run = () => {
    draw();
    window.requestAnimationFrame(run);
}
run();