import * as _ from 'lodash';
import { HealthState } from '@console/internal/components/dashboard/health-card/states';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { FirehoseResult } from '@console/internal/components/utils';
import { PrometheusHealthHandler } from '@console/plugin-sdk';
import { getGaugeValue } from '../../utils';

export const getObjectStorageHealthState = (
  bucketsResponse: PrometheusResponse,
  unhealthyBucketsResponse: PrometheusResponse,
  poolsResponse: PrometheusResponse,
  unhealthyPoolResponse: PrometheusResponse,
  noobaaSystem: FirehoseResult,
  queryError: boolean,
): ObjectStorageHealth => {
  const loadError = _.get(noobaaSystem, 'loadError');
  const loaded = _.get(noobaaSystem, 'loaded');
  const noobaaSystemData = _.get(noobaaSystem, 'data[0]', null) as K8sResourceKind;
  const noobaaPhase = _.get(noobaaSystemData, 'status.phase');

  const buckets = getGaugeValue(bucketsResponse);
  const unhealthyBuckets = getGaugeValue(unhealthyBucketsResponse);
  const pools = getGaugeValue(poolsResponse);
  const unhealthyPools = getGaugeValue(unhealthyPoolResponse);

  const result: ObjectStorageHealth = {
    state: HealthState.OK,
  };

  if (
    !queryError &&
    !(
      (loaded || loadError) &&
      bucketsResponse &&
      unhealthyBucketsResponse &&
      poolsResponse &&
      unhealthyPoolResponse
    )
  ) {
    return { state: HealthState.LOADING };
  }
  if (queryError || loadError || !(buckets && unhealthyBuckets && pools && unhealthyPools)) {
    return { state: HealthState.UNKNOWN };
  }
  if (!noobaaSystemData || noobaaPhase !== 'Ready') {
    result.message = 'MCG is not running';
    result.state = HealthState.ERROR;
    return result;
  }
  if (!_.isNil(pools) && !_.isNil(unhealthyPools)) {
    if (Number(pools) === Number(unhealthyPools)) {
      result.message = 'All resources are unhealthy';
      result.state = HealthState.ERROR;
      return result;
    }
  }
  if (!_.isNil(buckets) && !_.isNil(unhealthyBuckets)) {
    const value = Number(unhealthyBuckets) / Number(buckets);
    if (value >= 0.5) {
      result.message = 'Many buckets have issues';
      result.state = HealthState.ERROR;
      return result;
    }
    if (value >= 0.3) {
      result.message = 'Some buckets have issues';
      result.state = HealthState.WARNING;
    }
  }
  return result;
};

type ObjectStorageHealth = {
  state?: HealthState;
  message?: string;
};

export const getDataResiliencyState: PrometheusHealthHandler = (results, error) => {
  const rebuildProgress = getGaugeValue(results[0]);
  if (error[0]) {
    return { state: HealthState.UNKNOWN };
  }
  if (!results[0]) {
    return { state: HealthState.LOADING };
  }
  if (Number(rebuildProgress) < 100) {
    return { state: HealthState.PROGRESS };
  }
  return { state: HealthState.OK };
};
