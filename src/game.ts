import * as BABYLON from "babylonjs";
import { GameManager } from "./gamemanager";

export class Game extends BABYLON.Engine {
  public _sceneRegistry: { [name: string]: BABYLON.Scene } = {};
  private _activeScene!: BABYLON.Scene;
  constructor(canvas: HTMLCanvasElement, gameManager: typeof GameManager) {
    console.log("CREATING GAME");
    super(canvas, true);

    window.addEventListener("resize", () => this.resize());
    this.onDisposeObservable.add(() => console.log("DISPOSING GAME"));
    const scene = this.createScene(gameManager);
    this.addScene(scene, "default_scene");
    this.setScene("default_scene");
    this.runRenderLoop(() => this.activeScene && this.activeScene.render());
  }

  public createScene(gameManager: typeof GameManager): BABYLON.Scene {
    const newScene = new BABYLON.Scene(this);

    this.createDefaultCamera(newScene);
    this.createDefaultLight(newScene);
    this.createGameManager(newScene, gameManager);

    return newScene;
  }

  public get activeScene(): BABYLON.Scene {
    return this._activeScene;
  }

  public get sceneRegistry(): { [name: string]: BABYLON.Scene } {
    return this._sceneRegistry;
  }

  public addScene(scene: BABYLON.Scene, name: string): boolean {
    if (this.sceneRegistry[name]) return false;
    this.sceneRegistry[name] = scene;
    return true;
  }

  public removeScene(name: string, disposeScene = false): boolean {
    const scene = this.sceneRegistry[name];
    if (!scene) return true;
    delete this.sceneRegistry[name];
    if (disposeScene) scene.dispose();

    return true;
  }

  public setScene(name: string): boolean {
    const scene = this.sceneRegistry[name];
    if (!scene) return false;
    this._activeScene = scene;
    return true;
  }

  public createDefaultCamera(scene: BABYLON.Scene) {
    new BABYLON.FreeCamera(
      "default_camera",
      BABYLON.Vector3.Zero(),
      scene,
      true
    );
  }

  public createDefaultLight(scene: BABYLON.Scene) {
    new BABYLON.HemisphericLight(
      "default_light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
  }

  public createGameManager(
    scene: BABYLON.Scene,
    gameManager: typeof GameManager
  ) {
    const node = new BABYLON.TransformNode("default_gamemanager", scene);
    new gameManager(this, node);
  }
}
