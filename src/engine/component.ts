/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as BABYLON from "babylonjs";

export class Component<T extends BABYLON.Node> {
  public readonly node: T;
  private startObservable!: BABYLON.Nullable<BABYLON.Observer<BABYLON.Scene>>;
  private updateObservable!: BABYLON.Nullable<BABYLON.Observer<BABYLON.Scene>>;
  private disposeObservable!: BABYLON.Nullable<BABYLON.Observer<BABYLON.Node>>;

  public static getComponents<T extends Component<BABYLON.Node>>(
    node: BABYLON.Node,
    typeConstructor: new (...args: any[]) => T
  ): T[] {
    return (node as any).components
      ? (((node as any).components as Component<BABYLON.Node>[]).filter(
          (c) => c instanceof typeConstructor
        ) as T[])
      : [];
  }

  public static getComponentsInChildren<T extends Component<BABYLON.Node>>(
    node: BABYLON.Node,
    typeConstructor: new (...args: any[]) => T
  ): T[] {
    const matchingComponents: T[] = [];

    const processNode = (currentNode: BABYLON.Node, isRootNode: boolean) => {
      if (!isRootNode) {
        const components: T[] | undefined = Component.getComponents(
          currentNode,
          typeConstructor
        );
        if (components) matchingComponents.push(...(components as T[]));
      }

      for (const childNode of currentNode.getChildren()) {
        processNode(childNode, false);
      }
    };

    processNode(node, true);

    return matchingComponents;
  }

  constructor(node: T, updateHook: boolean) {
    this.node = node;
    this.init();
    this.add();
    this.hooks(updateHook);
  }

  public onStart(): void {}

  public onUpdate(): void {}

  public onDestroy(): void {}

  private init() {
    if (!(this.node as any).components) {
      (this.node as any).components = [];
    }
  }

  private add() {
    (this.node as any).components.push(this);
  }

  private hooks(updateHook: boolean) {
    const scene = this.node.getScene();

    this.startObservable = scene.onBeforeRenderObservable.addOnce(() => {
      this.tryCall(this.onStart);
    });

    if (updateHook)
      this.updateObservable = scene.onBeforeRenderObservable.add(() => {
        this.tryCall(this.onUpdate);
      });

    this.disposeObservable = this.node.onDisposeObservable.add(() => {
      this.destroy();
    });
  }

  public destroy() {
    const scene = this.node.getScene();
    scene.onBeforeRenderObservable.remove(this.startObservable);
    scene.onBeforeRenderObservable.remove(this.updateObservable);
    this.node.onDisposeObservable.remove(this.disposeObservable);
    this.tryCall(this.onDestroy);
    const components = (this.node as any).components;
    const index = components.indexOf(this);
    if (index !== -1) {
      components.splice(index, 1);
    }
  }

  private tryCall(f: () => void) {
    try {
      f.call(this);
    } catch (error: any) {
      console.error(`(${this.node.name}) ERROR: ${error.stack}`);
    }
  }
}
