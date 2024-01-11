import p5 from "p5";
import { loadCanvas } from "./lib/elementLoader/loadCanvas";
import { sketch } from "./p5/sketch";

document.addEventListener("DOMContentLoaded", setup);

function setup(): void {
    new p5(sketch, loadCanvas("#canvas_size"));
}
