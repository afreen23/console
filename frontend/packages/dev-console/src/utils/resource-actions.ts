import * as _ from 'lodash';
import { referenceForModel } from '@console/internal/module/k8s';
import {
  DaemonSetModel,
  DeploymentConfigModel,
  DeploymentModel,
  StatefulSetModel,
} from '@console/internal/models';
<<<<<<< HEAD:frontend/packages/dev-console/src/utils/resource-actions.ts
import { GetResourceActions } from '@console/plugin-sdk';
=======
import { GetKebabActions } from '@console/plugin-sdk';
>>>>>>> Migrate KebabActions extension:frontend/packages/dev-console/src/utils/kebab-actions.ts
import { ModifyApplication, EditApplication } from '../actions/modify-application';

const modifyWebConsoleApplicationRefs = [
  referenceForModel(DeploymentConfigModel),
  referenceForModel(DeploymentModel),
  referenceForModel(DaemonSetModel),
  referenceForModel(StatefulSetModel),
];

const editApplicationRefs = [
  referenceForModel(DeploymentConfigModel),
  referenceForModel(DeploymentModel),
];

<<<<<<< HEAD:frontend/packages/dev-console/src/utils/resource-actions.ts
export const getResourceActions: GetResourceActions = (resourceKind) => {
=======
export const getKebabActions: GetKebabActions = (resourceKind) => {
>>>>>>> Migrate KebabActions extension:frontend/packages/dev-console/src/utils/kebab-actions.ts
  if (!resourceKind) {
    // no common actions
    return [];
  }

  return _.includes(modifyWebConsoleApplicationRefs, referenceForModel(resourceKind))
    ? [
        ModifyApplication,
        ...(_.includes(editApplicationRefs, referenceForModel(resourceKind))
          ? [EditApplication]
          : []),
      ]
    : [];
};
