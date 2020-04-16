import * as React from 'react';
import { ContextMenuItem, ContextSubMenuItem, Node, Graph } from '@console/topology';
import {
  history,
  KebabItem,
  KebabOption,
  KebabMenuOption,
  kebabOptionsToMenu,
  isKebabSubMenu,
} from '@console/internal/components/utils';
<<<<<<< HEAD:frontend/packages/dev-console/src/components/topology/components/nodeContextMenu.tsx
import { ResourceActionProvider } from '@console/plugin-sdk';
import { workloadActions } from '../actions/workloadActions';
import { groupActions } from '../actions/groupActions';
import { nodeActions } from '../actions/nodeActions';
import { graphActions } from '../actions/graphActions';
import { TopologyApplicationObject } from '../topology-types';
import { regroupActions } from '../actions/regroupActions';
import { helmReleaseActions } from '../actions/helmReleaseActions';
=======
import { KebabActionFactory } from '@console/plugin-sdk';
import { workloadActions } from './actions/workloadActions';
import { groupActions } from './actions/groupActions';
import { nodeActions } from './actions/nodeActions';
import { graphActions } from './actions/graphActions';
import { TopologyApplicationObject } from './topology-types';
import { regroupActions } from './actions/regroupActions';
>>>>>>> Migrate KebabActions extension:frontend/packages/dev-console/src/components/topology/nodeContextMenu.tsx

const onKebabOptionClick = (option: KebabOption) => {
  if (option.callback) {
    option.callback();
  }
  if (option.href) {
    history.push(option.href);
  }
};

const createMenuItems = (actions: KebabMenuOption[]) =>
  actions.map((option) =>
    isKebabSubMenu(option) ? (
      <ContextSubMenuItem label={option.label} key={option.label}>
        {createMenuItems(option.children)}
      </ContextSubMenuItem>
    ) : (
      <ContextMenuItem
        key={option.label}
        component={<KebabItem option={option} onClick={() => onKebabOptionClick(option)} />}
      />
    ),
  );

export const workloadContextMenu = (element: Node) =>
  createMenuItems(kebabOptionsToMenu(workloadActions(element.getData())));

export const groupContextMenu = (element: Node, options?: NodeContextMenuOptions) => {
  const applicationData: TopologyApplicationObject = {
    id: element.getId(),
    name: element.getLabel(),
    resources: element.getData().groupResources,
  };

  const graphData = element.getGraph().getData();
  return createMenuItems(
    kebabOptionsToMenu(groupActions(graphData, applicationData, options?.connectorSource)),
  );
};

export const nodeContextMenu = (element: Node, options?: NodeContextMenuOptions) =>
  createMenuItems(kebabOptionsToMenu(nodeActions(element.getData(), options?.actionExtensions)));

export const graphContextMenu = (graph: Graph, options?: NodeContextMenuOptions) =>
  createMenuItems(kebabOptionsToMenu(graphActions(graph.getData(), options?.connectorSource)));

export const regroupContextMenu = (element: Node) =>
  createMenuItems(kebabOptionsToMenu(regroupActions(element)));

export const regroupGroupContextMenu = (element: Node) =>
  createMenuItems(kebabOptionsToMenu(regroupActions(element, true)));

<<<<<<< HEAD:frontend/packages/dev-console/src/components/topology/components/nodeContextMenu.tsx
export const helmReleaseContextMenu = (element: Node) =>
  createMenuItems(kebabOptionsToMenu(helmReleaseActions(element)));

type NodeContextMenuOptions = {
  connectorSource?: Node;
  actionExtensions?: ResourceActionProvider[];
=======
type NodeContextMenuOptions = {
  connectorSource?: Node;
  actionExtensions?: KebabActionFactory[];
>>>>>>> Migrate KebabActions extension:frontend/packages/dev-console/src/components/topology/nodeContextMenu.tsx
};
