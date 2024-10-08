/* eslint-disable @typescript-eslint/no-empty-function */
import * as BABYLON from "babylonjs";
import { GameManager } from "../../../src/gamemanager";
import { Component } from "../../../src/component";
import { Game } from "../../../src/game";
import { createPrefabAsync } from "../../../src/prefab";
import { Rotate } from "./rotate";
import { prefabs } from "../prefabs";

export class DemoGameManager extends GameManager {
  public game: Game;
  public cube?: BABYLON.TransformNode;

  constructor(game: Game, node: BABYLON.TransformNode) {
    super(game, node);
    this.game = game;
  }

  public toggleRotation(): void {
    if (this.cube) {
      Component.getComponentsInChildren(this.cube, Rotate).forEach((r) =>
        r.toggle()
      );
    }
  }

  public onStart(): void {
    Game.createHavok(this.node.getScene(), new BABYLON.Vector3(0, 0, 0)).then(
      () => {
        createPrefabAsync(this.node, prefabs.cube).then((n) => (this.cube = n));
      }
    );
  }
  public onUpdate(): void {}
  public onDestroy(): void {}
}
