import * as _ from 'lodash';
import { referenceForModel } from '@console/internal/module/k8s';
import { KebabAction } from '@console/internal/components/utils';
import {
  ModifyApplication,
  EditApplication,
} from '@console/dev-console/src/actions/modify-application';
import { GetKebabActions } from '@console/plugin-sdk';
import { setTrafficDistribution } from '../actions/traffic-splitting';
import {
  EventSourceApiServerModel,
  EventSourceCamelModel,
  EventSourceContainerModel,
  EventSourceCronJobModel,
  EventSourceKafkaModel,
  EventSourceServiceBindingModel,
  ServiceModel,
} from '../models';

const modifyApplicationRefs = [
  referenceForModel(EventSourceApiServerModel),
  referenceForModel(EventSourceContainerModel),
  referenceForModel(EventSourceCronJobModel),
  referenceForModel(EventSourceCamelModel),
  referenceForModel(EventSourceKafkaModel),
  referenceForModel(EventSourceServiceBindingModel),
  referenceForModel(ServiceModel),
];

export const getKebabActions: GetKebabActions = (resourceKind) => {
  const menuActions: KebabAction[] = [];
  if (resourceKind) {
    if (_.includes(modifyApplicationRefs, referenceForModel(resourceKind))) {
      menuActions.push(ModifyApplication);
    }
    if (referenceForModel(resourceKind) === referenceForModel(ServiceModel)) {
      menuActions.push(setTrafficDistribution, EditApplication);
    }
  }
  return menuActions;
};
