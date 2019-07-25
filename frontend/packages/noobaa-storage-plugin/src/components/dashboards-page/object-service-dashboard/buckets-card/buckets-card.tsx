import * as React from 'react';
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
import { BucketsCardQueries } from '../constants/queries';
import { getPropsData } from '../utils';
import { BucketsItem, BucketsType } from './buckets-card-item';
import './buckets-card.scss';

const ObjectDashboardBucketsCard: React.FC<DashboardItemProps> = ({
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

  const objectBucketsCount = prometheusResults.getIn([BucketsCardQueries.BUCKETS_COUNT, 'result']);
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

  const bucketProps: BucketsType = {
    bucketsCount: getPropsData(objectBucketsCount),
    objectsCount: getPropsData(objectsCountOnBuckets),
    unhealthyCount: getPropsData(unhealthyBucketsCount),
    isLoading: !(objectBucketsCount && objectsCountOnBuckets && unhealthyBucketsCount),
  };
  const bucketClaimProps: BucketsType = {
    bucketsCount: getPropsData(bucketClaimsCount),
    objectsCount: getPropsData(objectsCountOnBucketClaims),
    unhealthyCount: getPropsData(unhealthyBucketClaimsCount),
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

export const BucketsCard = withDashboardResources(ObjectDashboardBucketsCard);
