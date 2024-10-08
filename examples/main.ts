import "./main.css";
import { createGame } from "./demo/main";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas id="canvas"></canvas>
`;
const canvas = document.getElementById("canvas");
if (canvas && canvas instanceof HTMLCanvasElement) createGame(canvas);
console.log("finished");
