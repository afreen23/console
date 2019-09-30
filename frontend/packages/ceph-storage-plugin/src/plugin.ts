import * as _ from 'lodash';
import {
  DashboardsCard,
  DashboardsTab,
  DashboardsOverviewHealthPrometheusSubsystem,
  DashboardsOverviewPrometheusActivity,
  ModelFeatureFlag,
  ModelDefinition,
  Plugin,
  DashboardsOverviewActivity,
  DashboardsOverviewQuery,
  RoutePage,
  ClusterServiceVersionAction,
} from '@console/plugin-sdk';
import { GridPosition } from '@console/internal/components/dashboard';
import { OverviewQuery } from '@console/internal/components/dashboards-page/overview-dashboard/queries';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager/src/models';
import { referenceForModel } from '@console/internal/module/k8s';
import * as models from './models';
import { isDataResiliencyActivity } from './components/dashboard-page/storage-dashboard/activity-card/activity';
import {
  CAPACITY_USAGE_QUERIES,
  StorageDashboardQuery,
  STORAGE_HEALTH_QUERIES,
} from './constants/queries';
import { STORAGE_HEALTH_RESOURCES, StorageDashboardResource } from './constants/resources';
import { getCephHealthState } from './components/dashboard-page/storage-dashboard/health-card/utils';

type ConsumedExtensions =
  | ModelFeatureFlag
  | ModelDefinition
  | DashboardsTab
  | DashboardsCard
  | DashboardsOverviewActivity
  | DashboardsOverviewHealthPrometheusSubsystem
  | DashboardsOverviewPrometheusActivity
  | DashboardsOverviewQuery
  | RoutePage
  | ClusterServiceVersionAction;

const CEPH_FLAG = 'CEPH';
// keeping this for testing, will be removed once ocs operator available
// const apiObjectRef = 'core.libopenstorage.org~v1alpha1~StorageCluster';
const apiObjectRef = referenceForModel(models.OCSServiceModel);

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
      model: models.CephClusterModel,
      flag: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Tab',
    properties: {
      id: 'persistent-storage',
      title: 'Persistent Storage',
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/${ClusterServiceVersionModel.plural}/:appName/${apiObjectRef}/~new`,
      loader: () =>
        import(
          './components/ocs-install/create-ocs-service' /* webpackChunkName: "ceph-ocs-service" */
        ).then((m) => m.CreateOCSService),
    },
  },
  // Ceph Storage Dashboard Left cards
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.LEFT,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/details-card' /* webpackChunkName: "ceph-storage-details-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.LEFT,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/inventory-card' /* webpackChunkName: "ceph-storage-inventory-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  // Ceph Storage Dashboard Main Cards
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.MAIN,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/health-card/health-card' /* webpackChunkName: "ceph-storage-health-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.MAIN,
      span: 6,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/capacity-card/capacity-card' /* webpackChunkName: "ceph-storage-capacity-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.MAIN,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/top-consumers-card/top-consumers-card' /* webpackChunkName: "ceph-storage-top-consumers-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  // Ceph Storage Dashboard Right Cards
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.RIGHT,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/activity-card/activity-card' /* webpackChunkName: "ceph-storage-activity-card" */
        ).then((m) => m.ActivityCard),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.RIGHT,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/utilization-card/utilization-card' /* webpackChunkName: "ceph-storage-utilization-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Overview/Health/Prometheus',
    properties: {
      title: 'Storage',
      query: STORAGE_HEALTH_QUERIES[StorageDashboardQuery.CEPH_STATUS_QUERY],
      resource: STORAGE_HEALTH_RESOURCES[StorageDashboardResource.CEPH_CLUSTER_RESOURCE],
      healthHandler: getCephHealthState,
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Overview/Query',
    properties: {
      queryKey: OverviewQuery.STORAGE_TOTAL,
      query: CAPACITY_USAGE_QUERIES[StorageDashboardQuery.CEPH_CAPACITY_TOTAL],
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Overview/Query',
    properties: {
      queryKey: OverviewQuery.STORAGE_UTILIZATION,
      query: `${CAPACITY_USAGE_QUERIES[StorageDashboardQuery.CEPH_CAPACITY_USED]}[60m:5m]`,
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Overview/Prometheus/Activity',
    properties: {
      queries: [
        StorageDashboardQuery.CEPH_PG_CLEAN_AND_ACTIVE_QUERY,
        StorageDashboardQuery.CEPH_PG_TOTAL_QUERY,
      ],
      isActivity: isDataResiliencyActivity,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/data-resiliency/data-resiliency' /* webpackChunkName: "data-resiliency-activity" */
        ).then((m) => m.DataResiliency),
    },
  },
  {
    type: 'ClusterServiceVersion/Action',
    properties: {
      kind: 'StorageCluster',
      label: 'Add Capacity',
      apiGroup: models.OCSServiceModel.apiGroup,
      callback: (kind, ocsConfig) => () => {
        const clusterObject = { ocsConfig };
        import(
          './components/modals/add-capacity-modal/add-capacity-modal' /* webpackChunkName: "ceph-storage-add-capacity-modal" */
        )
          .then((m) => m.addCapacityModal(clusterObject))
          .catch((e) => {
            throw e;
          });
      },
    },
  },
];

export default plugin;
