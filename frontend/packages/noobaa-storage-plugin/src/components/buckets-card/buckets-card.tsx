import * as React from 'react';
import * as _ from 'lodash';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import { getName } from '@console/shared';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import InventoryItem, {
  ResourceInventoryItem,
} from '@console/shared/src/components/dashboard/inventory-card/InventoryItem';
import { StorageClassModel } from '@console/internal/models';
import { FirehoseResource } from '@console/internal/components/utils';
import { referenceForModel, K8sResourceKind } from '@console/internal/module/k8s';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { getGaugeValue } from '../../utils';
import { NooBaaObjectBucketClaimModel, NooBaaObjectBucketModel } from '../../models';
import './buckets-card.scss';
import { getBucketObjects } from './buckets-card-item';
import {
  getObStatusGroups,
  getObcStatusGroups,
} from '@console/shared/src/components/dashboard/inventory-card/utils';

enum BucketsCardQueries {
  BUCKETS_COUNT = 'NooBaa_num_buckets',
  BUCKET_OBJECTS_COUNT = 'NooBaa_num_objects',
  BUCKET_CLAIMS_OBJECTS_COUNT = 'NooBaa_num_objects_buckets_claims',
}

const objectBucketClaimsResource: FirehoseResource = {
  kind: referenceForModel(NooBaaObjectBucketClaimModel),
  namespaced: false,
  isList: true,
  prop: 'obc',
};

const objectBucketResource: FirehoseResource = {
  kind: referenceForModel(NooBaaObjectBucketClaimModel),
  namespaced: false,
  isList: true,
  prop: 'ob',
};

const storageClassResource: FirehoseResource = {
  kind: StorageClassModel.kind,
  isList: true,
  prop: 'storageclass',
};

const getNoobaaStorageClassList = (storageClassesList: K8sResourceKind[]): K8sResourceKind[] =>
  storageClassesList.filter((sc: K8sResourceKind) =>
    _.endsWith(_.get(sc, 'provisioner'), 'noobaa.io/obc'),
  );

const filterNoobaaResources = (
  resources: K8sResourceKind[],
  noobaaStorageClassList: K8sResourceKind[],
): K8sResourceKind[] =>
  resources.filter((res: K8sResourceKind) => {
    const storageClassName = _.get(res, 'spec.storageClassName');
    return noobaaStorageClassList.some((sc: K8sResourceKind) => getName(sc) === storageClassName);
  });

const ObjectDashboardBucketsCard: React.FC<DashboardItemProps> = ({
  watchK8sResource,
  watchPrometheus,
  stopWatchPrometheusQuery,
  stopWatchK8sResource,
  prometheusResults,
  resources,
}) => {
  React.useEffect(() => {
    watchK8sResource(objectBucketClaimsResource);
    watchK8sResource(objectBucketResource);
    watchK8sResource(storageClassResource);
    Object.keys(BucketsCardQueries).forEach((key) => watchPrometheus(BucketsCardQueries[key]));
    return () => {
      stopWatchK8sResource(objectBucketClaimsResource);
      stopWatchK8sResource(objectBucketResource);
      stopWatchK8sResource(storageClassResource);
      Object.keys(BucketsCardQueries).forEach((key) =>
        stopWatchPrometheusQuery(BucketsCardQueries[key]),
      );
    };
  }, [watchK8sResource, watchPrometheus, stopWatchK8sResource, stopWatchPrometheusQuery]);

  const noobaaBuckets = prometheusResults.getIn([
    BucketsCardQueries.BUCKETS_COUNT,
    'data',
  ]) as PrometheusResponse;
  const noobaaBucketsError = prometheusResults.getIn([
    BucketsCardQueries.BUCKETS_COUNT,
    'loadError',
  ]);
  const noobaaBucketsObjects = prometheusResults.getIn([
    BucketsCardQueries.BUCKET_OBJECTS_COUNT,
    'data',
  ]) as PrometheusResponse;
  const noobaaBucketsObjectsError = prometheusResults.getIn([
    BucketsCardQueries.BUCKET_OBJECTS_COUNT,
    'loadError',
  ]);
  const obcObjects = prometheusResults.getIn([
    BucketsCardQueries.BUCKET_CLAIMS_OBJECTS_COUNT,
    'data',
  ]) as PrometheusResponse;
  const obcObjectsError = prometheusResults.getIn([
    BucketsCardQueries.BUCKET_CLAIMS_OBJECTS_COUNT,
    'loadError',
  ]);

  const storageClassesData = _.get(resources.storageclass, 'data', []) as K8sResourceKind[];
  const storageClassesLoaded = _.get(resources.storageclass, 'loaded');
  const storageClassesLoadError = _.get(resources.storageclass, 'loadError');

  const obcData = _.get(resources.obc, 'data', []) as K8sResourceKind[];
  const obcLoaded = _.get(resources.obc, 'loaded');
  const obcLoadError = _.get(resources.obc, 'loadError');

  const obData = _.get(resources.ob, 'data', []) as K8sResourceKind[];
  const obLoaded = _.get(resources.ob, 'loaded');
  const obLoadError = _.get(resources.ob, 'loadError');

  const noobaaStorageClassList = getNoobaaStorageClassList(storageClassesData);

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Buckets</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <InventoryItem
          title="Noobaa Bucket"
          TitleComponent={getBucketObjects(getGaugeValue(noobaaBucketsObjects))}
          isLoading={!(noobaaBuckets && noobaaBucketsObjects)}
          error={noobaaBucketsError || noobaaBucketsObjectsError}
          count={+getGaugeValue(noobaaBuckets)}
        />
        <ResourceInventoryItem
          isLoading={!(storageClassesLoaded && obLoaded && obcObjects)}
          error={storageClassesLoadError || obLoadError || obcObjectsError}
          kind={NooBaaObjectBucketModel}
          resources={filterNoobaaResources(obData, noobaaStorageClassList)}
          mapper={getObStatusGroups}
          ExpandedComponent={getBucketObjects(getGaugeValue(obcObjects))}
        />
        <ResourceInventoryItem
          isLoading={!(storageClassesLoaded && obcLoaded && obcObjects)}
          error={storageClassesLoadError || obcLoadError || obcObjectsError}
          kind={NooBaaObjectBucketClaimModel}
          resources={filterNoobaaResources(obcData, noobaaStorageClassList)}
          mapper={getObcStatusGroups}
          ExpandedComponent={getBucketObjects(getGaugeValue(obcObjects))}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export const BucketsCard = withDashboardResources(ObjectDashboardBucketsCard);
