import { ModelConstructor } from "@stantanasi/jsonapi-client";
import { slices } from "../store";

export type ReduxHelpers<DocType, ModelType extends ModelConstructor<DocType>> = {
  redux: {
    name: keyof typeof slices;
  };
}

export const createReduxHelpers = <DocType, ModelType extends ModelConstructor<DocType>>(
  model: ModelType,
) => {
  return {
    register: (name: keyof typeof slices): ReduxHelpers<DocType, ModelType>['redux'] => {
      return {
        name: name,
      };
    },
  };
};
