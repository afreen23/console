import * as React from 'react';
import * as _ from 'lodash';

import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/internal/components/dashboard/dashboard-card';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { BucketsItem } from './buckets-card-row';
import './buckets-card.scss';

enum BucketsCardQueries {
  BUCKETS_COUNT = 'NooBaa_num_buckets',
  BUCKET_OBJECTS_COUNT = 'NooBaa_num_objects',
  BUCKET_CLAIMS_COUNT = 'NooBaa_num_buckets_claims',
  BUCKET_CLAIMS_OBJECTS_COUNT = 'NooBaa_num_objects_buckets_claims',
  UNHEALTHY_BUCKETS = 'NooBaa_num_unhealthy_buckets',
  UNHEALTHY_BUCKETS_CLAIMS = '',
}

const getPropsData = (data) => _.get(data, 'data.result[0].value[1]', null);

const ObjectDashboardBucketsCard: React.FC<BucketsCardProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  React.useEffect(() => {
    Object.keys(BucketsCardQueries).forEach((key) => watchPrometheus(BucketsCardQueries[key]));
    return () =>
      Object.keys(BucketsCardQueries).forEach((key) =>
        stopWatchPrometheusQuery(BucketsCardQueries[key]),
      );
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const bucketsCount = prometheusResults.getIn([BucketsCardQueries.BUCKETS_COUNT, 'result']);
  const objectsCountOnBuckets = prometheusResults.getIn([
    BucketsCardQueries.BUCKET_OBJECTS_COUNT,
    'result',
  ]);
  const unhealthyBucketsCount = prometheusResults.getIn([
    BucketsCardQueries.UNHEALTHY_BUCKETS,
    'result',
  ]);
  const bucketClaimsCount = prometheusResults.getIn([
    BucketsCardQueries.BUCKET_CLAIMS_COUNT,
    'result',
  ]);
  const objectsCountOnBucketClaims = prometheusResults.getIn([
    BucketsCardQueries.BUCKET_CLAIMS_OBJECTS_COUNT,
    'result',
  ]);
  const unhealthyBucketClaimsCount = prometheusResults.getIn([
    BucketsCardQueries.UNHEALTHY_BUCKETS_CLAIMS,
    'result',
  ]);

  const bucketProps = {
    bucketsCount: getPropsData(bucketsCount),
    objects: getPropsData(objectsCountOnBuckets),
    unhealthy: getPropsData(unhealthyBucketsCount),
    isLoading: !(bucketsCount && objectsCountOnBuckets && unhealthyBucketsCount),
  };
  const bucketClaimProps = {
    bucketsCount: getPropsData(bucketClaimsCount),
    objects: getPropsData(objectsCountOnBucketClaims),
    unhealthy: getPropsData(unhealthyBucketClaimsCount),
    isLoading: !(bucketClaimsCount && objectsCountOnBucketClaims && unhealthyBucketClaimsCount),
  };
  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Buckets</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <BucketsItem title="ObjectBucket" {...bucketProps} />
        <BucketsItem title="ObjectBucketClaim" {...bucketClaimProps} />
      </DashboardCardBody>
    </DashboardCard>
  );
};

type BucketsCardProps = DashboardItemProps;

export const BucketsCard = withDashboardResources(ObjectDashboardBucketsCard);
