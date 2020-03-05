import * as _ from 'lodash';
<<<<<<< HEAD
import { Kebab, KebabOption, extendKebabOptions } from '@console/internal/components/utils';
import { modelFor, referenceFor } from '@console/internal/module/k8s';
import { ResourceActionProvider } from '@console/plugin-sdk';
=======
import { Kebab, KebabOption, mergePluginKebabOptions } from '@console/internal/components/utils';
import { modelFor, referenceFor } from '@console/internal/module/k8s';
import { KebabActionFactory } from '@console/plugin-sdk';
>>>>>>> Migrate KebabActions extension
import { TopologyDataObject } from '../topology-types';
import { getTopologyResourceObject } from '../topology-utils';

export const nodeActions = (
  node: TopologyDataObject,
<<<<<<< HEAD
  actionExtensions: ResourceActionProvider[],
=======
  actionExtensions: KebabActionFactory[],
>>>>>>> Migrate KebabActions extension
): KebabOption[] => {
  const contextMenuResource = getTopologyResourceObject(node);
  if (!contextMenuResource) {
    return null;
  }

  const resourceKind = modelFor(referenceFor(contextMenuResource));
  const menuActions = [...Kebab.factory.common];
  const menuOptions = _.map(menuActions, (a) => a(resourceKind, contextMenuResource));

<<<<<<< HEAD
  return extendKebabOptions(menuOptions, actionExtensions, resourceKind, contextMenuResource);
=======
  return mergePluginKebabOptions(menuOptions, actionExtensions, resourceKind, contextMenuResource);
>>>>>>> Migrate KebabActions extension
};
