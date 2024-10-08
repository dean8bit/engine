import * as BABYLON from "babylonjs";

import { Component } from "./component";
import { Game } from "./game";

export class GameManager extends Component<BABYLON.TransformNode> {
  public game: Game;

  constructor(game: Game, node: BABYLON.TransformNode) {
    super(node, true);
    this.game = game;
  }
}
