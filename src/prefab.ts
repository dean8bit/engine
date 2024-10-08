import * as BABYLON from "babylonjs";
import { IModel, createModel } from "./model";

export interface IPrefab {
  name: string;
  model?: IModel;
  position?: BABYLON.Vector3;
  rotation?: BABYLON.Vector3;
  scale?: BABYLON.Vector3;
  children?: IPrefab[];
  postBuild?: (node: BABYLON.TransformNode) => void;
}

interface ITask {
  run: (node: BABYLON.TransformNode) => void;
  on: BABYLON.TransformNode;
}

export const createPrefabAsync = async (
  parent: BABYLON.TransformNode | BABYLON.Scene | undefined,
  prefab: IPrefab
): Promise<BABYLON.TransformNode | undefined> => {
  const tasks: ITask[] = [];
  const result = await createPrefab(parent, clonePrefab(prefab), tasks);
  if (result) {
    for (const task of tasks) {
      try {
        task.run(task.on);
      } catch (error) {
        console.error(`Error running postBuild task: ${error}`);
      }
    }
  }
  return result;
};

const clonePrefab = (prefab: IPrefab): IPrefab => {
  const root: IPrefab = {
    name: prefab.name,
    model: prefab.model ? { ...prefab.model } : undefined,
    position: prefab.position?.clone(),
    rotation: prefab.rotation?.clone(),
    scale: prefab.scale?.clone(),
    children: [],
    postBuild: prefab.postBuild,
  };
  prefab.children?.forEach((c) => root.children?.push(clonePrefab(c)));
  return root;
};

const createPrefab = async (
  parent: BABYLON.TransformNode | BABYLON.Scene | undefined,
  prefab: IPrefab,
  tasks: ITask[]
): Promise<BABYLON.TransformNode | undefined> => {
  let root: BABYLON.TransformNode | undefined;

  const sceneParent = parent instanceof BABYLON.Scene ? parent : undefined;
  if (prefab.model) root = await createModel(sceneParent, prefab.model);
  else root = new BABYLON.TransformNode("", sceneParent);

  if (!root) return undefined;
  if (parent instanceof BABYLON.TransformNode) root.parent = parent;
  root.name = prefab.name;
  root.position = prefab.position ?? BABYLON.Vector3.Zero();
  root.rotation = prefab.rotation
    ? new BABYLON.Vector3(
        BABYLON.Tools.ToRadians(prefab.rotation.x),
        BABYLON.Tools.ToRadians(prefab.rotation.y),
        BABYLON.Tools.ToRadians(prefab.rotation.z)
      )
    : BABYLON.Vector3.Zero();
  root.scaling = prefab.scale ?? BABYLON.Vector3.One();

  if (prefab.children && root instanceof BABYLON.TransformNode) {
    await Promise.all(prefab.children.map((p) => createPrefab(root, p, tasks)));
  }

  if (prefab.postBuild) {
    tasks.push({ run: prefab.postBuild, on: root });
  }

  return root;
};
