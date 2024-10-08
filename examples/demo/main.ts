import { Game } from "../../src/game";
import { DemoGameManager } from "./components/demogamemanager";

export const createGame = (canvas: HTMLCanvasElement): Game => {
  const game = new Game(canvas);
  game.initAsync().then(() => {
    game.begin(DemoGameManager);
  });
  return new Game(canvas);
};
