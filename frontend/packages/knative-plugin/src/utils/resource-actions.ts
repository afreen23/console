import * as _ from 'lodash';
import { referenceForModel } from '@console/internal/module/k8s';
import { KebabAction } from '@console/internal/components/utils';
import {
  ModifyApplication,
  EditApplication,
} from '@console/dev-console/src/actions/modify-application';
<<<<<<< HEAD:frontend/packages/knative-plugin/src/utils/resource-actions.ts
import { GetResourceActions } from '@console/plugin-sdk';
=======
import { GetKebabActions } from '@console/plugin-sdk';
>>>>>>> Migrate KebabActions extension:frontend/packages/knative-plugin/src/utils/kebab-actions.ts
import { setTrafficDistribution } from '../actions/traffic-splitting';
import { setSinkSource } from '../actions/sink-source';
import {
  EventSourceApiServerModel,
  EventSourceCamelModel,
  EventSourceContainerModel,
  EventSourceCronJobModel,
  EventSourceKafkaModel,
  EventSourceSinkBindingModel,
  ServiceModel,
} from '../models';

const eventSourceModelrefs = [
  referenceForModel(EventSourceApiServerModel),
  referenceForModel(EventSourceContainerModel),
  referenceForModel(EventSourceCronJobModel),
  referenceForModel(EventSourceCamelModel),
  referenceForModel(EventSourceKafkaModel),
  referenceForModel(EventSourceSinkBindingModel),
];
const modifyApplicationRefs = [...eventSourceModelrefs, referenceForModel(ServiceModel)];

<<<<<<< HEAD:frontend/packages/knative-plugin/src/utils/resource-actions.ts
export const getResourceActions: GetResourceActions = (resourceKind) => {
=======
export const getKebabActions: GetKebabActions = (resourceKind) => {
>>>>>>> Migrate KebabActions extension:frontend/packages/knative-plugin/src/utils/kebab-actions.ts
  const menuActions: KebabAction[] = [];
  if (resourceKind) {
    if (_.includes(modifyApplicationRefs, referenceForModel(resourceKind))) {
      menuActions.push(ModifyApplication);
    }
    if (referenceForModel(resourceKind) === referenceForModel(ServiceModel)) {
      menuActions.push(setTrafficDistribution, EditApplication);
    }
    if (_.includes(eventSourceModelrefs, referenceForModel(resourceKind))) {
      menuActions.push(setSinkSource);
    }
  }
  return menuActions;
};
