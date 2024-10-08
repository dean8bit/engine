/* eslint-disable @typescript-eslint/no-empty-function */
import * as BABYLON from "babylonjs";
import { Component } from "../../../src/component";

export class Rotate extends Component<BABYLON.TransformNode> {
  public enabled = true;

  constructor(node: BABYLON.TransformNode) {
    super(node, true);
  }

  public toggle(): void {
    this.enabled = !this.enabled;
  }

  public onStart(): void {}
  public onDestroy(): void {}
  public onUpdate() {
    if (this.enabled && this.node instanceof BABYLON.TransformNode) {
      this.node.rotate(
        BABYLON.Vector3.One(),
        this.node.getScene().deltaTime * 0.001
      );
      console.log("Rotate Component");
    }
  }
}
