import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

export interface IModel {
  modelName?: string;
  folderPath: string;
  fileName: string;
}

export const createModel = async (
  scene: BABYLON.Scene | undefined,
  model: IModel
): Promise<BABYLON.AbstractMesh | undefined> => {
  try {
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      model.modelName ?? "",
      model.folderPath,
      model.fileName,
      scene
    );

    if (result.meshes.length === 0) {
      console.error(`No meshes found in model: ${model.fileName}`);
      return undefined;
    }

    return result.meshes[0];
  } catch (error) {
    console.error(`Error loading model: ${error}`);
    return undefined;
  }
};
