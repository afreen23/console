import * as _ from 'lodash';

import { Plugin, ModelFeatureFlag, ModelDefinition, HrefNavItem, RoutePage } from '@console/plugin-sdk';

import * as models from './models';

type ConsumedExtensions = ModelFeatureFlag | ModelDefinition | HrefNavItem | RoutePage;

const NOOBAA_FLAG = 'NOOBAA';

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
      model: models.NooBaaSystemModel,
      flag: NOOBAA_FLAG,
    },
  },
  {
    type: 'NavItem/Href',
    properties: {
      section: 'Home',
      componentProps: {
        name: 'Object services',
        href: '/object-services',
        required: 'TEST_MODEL_FLAG',
        
      },
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: '/object-services',
      loader: () =>
      import('../../../public/components/dashboards-page/object-dashboard/object-dashboard' /* webpackChunkName: "demo-foobars" */).then(
        (m) => m.ObjectServicesDashboard,
      ),
    },
  },
];

export default plugin;
