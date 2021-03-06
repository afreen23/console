import i18next from 'i18next';
import { Node } from '@patternfly/react-topology';
import { MenuOptions } from '@console/dev-console/src/utils/add-resources-menu-utils';
import {
  addResourceMenuWithoutCatalog,
  addResourceMenu,
  addGroupResourceMenu,
} from '@console/dev-console/src/actions/add-resources';
import { GraphData } from '@console/topology/src/topology-types';
import { getResource } from '@console/topology/src/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import { errorModal } from '@console/internal/components/modals';
import { addEventSource } from '../actions/add-event-source';
import { addTrigger } from '../actions/add-trigger';
import { addChannels } from '../actions/add-channel';
import { addSubscription } from '../actions/add-subscription';
import { addPubSubConnectionModal } from '../components/pub-sub/PubSubModalLauncher';
import { isEventingChannelResourceKind } from '../utils/fetch-dynamic-eventsources-utils';
import {
  ServiceModel,
  EventingBrokerModel,
  EventingSubscriptionModel,
  EventingTriggerModel,
} from '../models';
import { createEventSourceKafkaConnection } from './knative-topology-utils';
import { TYPE_EVENT_SOURCE_KAFKA } from './const';

export const getKnativeContextMenuAction = (
  graphData: GraphData,
  menu: MenuOptions,
  connectorSource?: Node,
  isGroupActions: boolean = false,
): MenuOptions => {
  if (connectorSource?.getData().type === TYPE_EVENT_SOURCE_KAFKA) {
    return [];
  }
  if (!connectorSource && isGroupActions) {
    if (graphData.eventSourceEnabled) {
      return [...addGroupResourceMenu, addEventSource, addChannels];
    }
  }
  if (!connectorSource) {
    if (graphData.eventSourceEnabled) {
      return [...addResourceMenu, addEventSource, addChannels];
    }
    return menu;
  }
  const sourceKind = connectorSource?.getData().data.kind;
  if (isEventingChannelResourceKind(sourceKind)) {
    return [addSubscription(EventingSubscriptionModel, connectorSource.getData().resource)];
  }
  switch (sourceKind) {
    case referenceForModel(ServiceModel):
      return graphData.eventSourceEnabled
        ? isGroupActions
          ? [...addGroupResourceMenu, addEventSource]
          : [...addResourceMenuWithoutCatalog, addEventSource]
        : menu;
    case referenceForModel(EventingBrokerModel):
      return [addTrigger(EventingTriggerModel, connectorSource.getData().resource)];
    default:
      return menu;
  }
};

const createPubSubConnector = (source: Node, target: Node) => {
  return Promise.resolve(
    addPubSubConnectionModal({ source: getResource(source), target: getResource(target) }),
  ).then(() => null);
};

const createKafkaConnection = (source: Node, target: Node) =>
  createEventSourceKafkaConnection(source, target)
    .then(() => null)
    .catch((error) => {
      errorModal({
        title: i18next.t('knative-plugin~Error moving event source kafka connector'),
        error: error.message,
        showIcon: true,
      });
    });

export const getCreateConnector = (createHints: string[]) => {
  if (createHints.includes('createKafkaConnection')) {
    return createKafkaConnection;
  }
  if (createHints.includes('createTrigger') || createHints.includes('createSubscription')) {
    return createPubSubConnector;
  }
  return null;
};
