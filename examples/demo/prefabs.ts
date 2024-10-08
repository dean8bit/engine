import * as BABYLON from "babylonjs";
import { IPrefab } from "../../src/prefab";
import { Rotate } from "./components/rotate";
import { modelBlock } from "./models";

export const prefabCube: IPrefab = {
  name: "cube",
  position: new BABYLON.Vector3(0, 0, 10),
  children: [
    {
      name: "cube",
      model: modelBlock,
      position: new BABYLON.Vector3(0, 0, 0),
      postBuild: (n) => new Rotate(n),
      children: [
        {
          name: "cube",
          model: modelBlock,
          position: new BABYLON.Vector3(2, 0, 0),
          postBuild: (n) => new Rotate(n),
        },
      ],
    },
  ],
};

export const prefabs = {
  cube: prefabCube,
};
