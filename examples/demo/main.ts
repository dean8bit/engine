import { Game } from "../../src/game";
import { DemoGameManager } from "./components/demogamemanager";

export const createGame = (canvas: HTMLCanvasElement): Game => {
  return new Game(canvas, DemoGameManager);
};