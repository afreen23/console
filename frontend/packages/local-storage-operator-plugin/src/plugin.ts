import * as _ from 'lodash';
import { ModelDefinition, ModelFeatureFlag, Plugin, RoutePage } from '@console/plugin-sdk';
import { referenceForModel } from '@console/internal/module/k8s';
import * as models from './models';

type ConsumedExtensions = ModelFeatureFlag | ModelDefinition | RoutePage;

const LSO_FLAG = 'LSO';

const LocalVolumeGroupModel = models.LocalVolumeGroupModel;

const plugin: Plugin<ConsumedExtensions> = [
  {
    type: 'ModelDefinition',
    properties: {
      models: _.values(models),
    },
  },
  {
    type: 'FeatureFlag/Model',
    properties: {
      model: models.LocalVolumeModel,
      flag: LSO_FLAG,
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/${LocalVolumeGroupModel.plural}/:appName/${referenceForModel(LocalVolumeGroupModel)}/~new`,
      loader: () =>
        import('./components/local-volume-group/lvg-install-wizard' /* webpackChunkName: "local-volume-group-install" */).then(
          (m) => m.default,
        ),
      required: LSO_FLAG,
    },
  },
];

export default plugin;
