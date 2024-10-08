import * as BABYLON from "babylonjs";
import { GameManager } from "./gamemanager";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";

export class GameWebGL extends BABYLON.Engine {
  public _sceneRegistry: { [name: string]: BABYLON.Scene } = {};
  private _activeScene!: BABYLON.Scene;
  constructor(
    canvas: HTMLCanvasElement,
    gameManager: typeof GameManager,
    antialias: boolean
  ) {
    console.log("CREATING GAME WEBGL");
    super(canvas, antialias);
    begin(this, gameManager);
  }
}

export class GameWebGPU extends BABYLON.WebGPUEngine {
  public _sceneRegistry: { [name: string]: BABYLON.Scene } = {};
  private _activeScene!: BABYLON.Scene;
  constructor(canvas: HTMLCanvasElement, gameManager: typeof GameManager, antialias: boolean) {
    console.log("CREATING GAME WEBGPU");
    super(canvas, {
      antialias,
      glslangOptions: {
        jsPath: "/assets/glslang.js",
        wasmPath: "/assets/glslang.wasm",
      },
      twgslOptions: {
        jsPath: "/assets/twgsl.js",
        wasmPath: "/assets/twgsl.wasm",
      },
    });
    this.initAsync().then(() => begin(this, gameManager));
    public createScene(gameManager: typeof GameManager): BABYLON.Scene
    public get activeScene(): BABYLON.Scene 
    public get sceneRegistry(): { [name: string]: BABYLON.Scene } 
    public addScene(scene: BABYLON.Scene, name: string): boolean 
    public removeScene(name: string, disposeScene = false): boolean
    public setScene(name: string): boolean 
    public createDefaultLight(scene: BABYLON.Scene) 
    public createGameManager(
      scene: BABYLON.Scene,
      gameManager: typeof GameManager
    ) 
  }
}

const begin = (context: BABYLON.Engine | BABYLON.WebGPUEngine, gameManager: typeof GameManager): void => {
  console.log("BEGINNING GAME");
  window.addEventListener("resize", () => context.resize());
  context.onDisposeObservable.add(() => console.log("DISPOSING GAME"));
  const scene = context.createScene(gameManager);
  context.addScene(scene, "default_scene");
  context.setScene("default_scene");
  context.runRenderLoop(() => context.activeScene && context.activeScene.render());
}

const createScene = (context: BABYLON.Engine | BABYLON.WebGPUEngine,gameManager: typeof GameManager): BABYLON.Scene => {
  const newScene = new BABYLON.Scene(this);

  this.createDefaultCamera(newScene);
  this.createDefaultLight(newScene);
  this.createGameManager(newScene, gameManager);

  return newScene;
}

public get activeScene(context: BABYLON.Engine | BABYLON.WebGPUEngine): BABYLON.Scene {
  return this._activeScene;
}

public get sceneRegistry(context: BABYLON.Engine | BABYLON.WebGPUEngine): { [name: string]: BABYLON.Scene } {
  return this._sceneRegistry;
}

public addScene(context: BABYLON.Engine | BABYLON.WebGPUEngine,scene: BABYLON.Scene, name: string): boolean {
  if (this.sceneRegistry[name]) return false;
  this.sceneRegistry[name] = scene;
  return true;
}

public removeScene(context: BABYLON.Engine | BABYLON.WebGPUEngine, name: string, disposeScene = false): boolean {
  const scene = this.sceneRegistry[name];
  if (!scene) return true;
  delete this.sceneRegistry[name];
  if (disposeScene) scene.dispose();

  return true;
}

public setScene(context: BABYLON.Engine | BABYLON.WebGPUEngine, name: string): boolean {
  const scene = this.sceneRegistry[name];
  if (!scene) return false;
  this._activeScene = scene;
  return true;
}

public createDefaultCamera(context: BABYLON.Engine | BABYLON.WebGPUEngine, scene: BABYLON.Scene) {
  new BABYLON.FreeCamera(
    "default_camera",
    BABYLON.Vector3.Zero(),
    scene,
    true
  );
}

public createDefaultLight(context: BABYLON.Engine | BABYLON.WebGPUEngine, scene: BABYLON.Scene) {
  new BABYLON.HemisphericLight(
    "default_light",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );
}

public createGameManager(context: BABYLON.Engine | BABYLON.WebGPUEngine,
  scene: BABYLON.Scene,
  gameManager: typeof GameManager
) {
  const node = new BABYLON.TransformNode("default_gamemanager", scene);
  new gameManager(this, node);
}

export async const createHavok(
  scene: BABYLON.Scene,
  gavity: BABYLON.Vector3
): Promise<{
  havokInstance: HavokPhysicsWithBindings;
  havokPlugin: BABYLON.HavokPlugin;
}> => {
  console.log("HAVOK CREATED");
  const havokInstance = await HavokPhysics({
    locateFile: (path) => {
      if (path.includes("HavokPhysics") && path.endsWith(".wasm")) {
        return `assets/${path}`;
      }
      return path;
    },
  });

  const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
  scene.enablePhysics(gavity, havokPlugin);

  return { havokInstance, havokPlugin };
}