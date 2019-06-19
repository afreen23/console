import * as React from 'react';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '../../dashboard/dashboard-card';
import { BucketsRow } from '../../dashboard/buckets-card';
import { withDashboardResources } from '../with-dashboard-resources';


//@TODO
const getUnhealthyObs = object => {
  return 0;
};

//@TODO
const getUnhealthyObcs = object => {
  return 0;
};

//@TODO
const getObsCount = obs => {
  return 0;
};

//@TODO
const getObcsCount = obcs => {
  return 0;
};

//@TODO
const getObcsObjectsCount = obcs => {
  return 0;
};

//@TODO
const getObsObjectsCount = obcs => {
  return 0;
};

/*
# Object Buckets - NooBaa_num_buckets
# Objects - NooBaa_num_objects
# Unhealthy Buckets - NooBaa_num_unhealthy_buckets
# Object Bucket Claims - NooBaa_num_buckets_claims
# Objects on Object Bucket Claims - NooBaa_num_objects_buckets_claims
# Unhealthy Bucket Claims -
*/

const mapObsToProps = obs => {
  const result = {errorCount: 0, count: 0, objects:0};
  result.count = getObsCount(obs);
  const unhealthyObsCount = getUnhealthyObs(obs);
  if (unhealthyObsCount) {
    result.errorCount = unhealthyObsCount;
  }
  return result;
};

const mapObcsToProps = obcs => {
  const result = {errorCount: 0, count: 0, objects:0};
  result.count = getObcsCount(obcs);
  const unhealthyObcsCount = getUnhealthyObcs(obcs);
  if (unhealthyObcsCount) {
    result.errorCount = unhealthyObcsCount;
  }
  return result;
};

const BucketsBody = () => (
  <React.Fragment>
    <BucketsRow title="ObjectBuckets" {...mapObsToProps('ObjectBuckets')} />
    <BucketsRow title="ObjectBucketClaims" {...mapObcsToProps('ObjectBucketClaims')} />
  </React.Fragment>
);


const BucketsCard_: React.FC<{}> = () => {
  return (
    <DashboardCard className="co-buckets-card">
      <DashboardCardHeader>
        <DashboardCardTitle>Buckets</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <BucketsBody />
      </DashboardCardBody>
    </DashboardCard>
  );
};


export const BucketsCard = withDashboardResources(BucketsCard_);
