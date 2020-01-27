import * as _ from 'lodash';
import { HealthState } from '@console/shared/src/components/dashboard/status-card/states';
import { PrometheusHealthHandler } from '@console/plugin-sdk';
import { getResiliencyProgress } from '../../../../utils';
import { K8sResourceKind } from '@console/internal/module/k8s';

const CephHealthStatus = {
  HEALTH_OK: HealthState.OK,
  HEALTH_WARN: HealthState.WARNING,
  HEALTH_ERR: HealthState.ERROR,
};

export const getCephHealthState: GetCephHealthState = (response, loaded) => {
  if (loaded && !response) {
    return HealthState.UNKNOWN;
  }
  if (!loaded) {
    return { state: HealthState.LOADING };
  }

  const value = response?.spec?.status?.ceph.health;
  return CephHealthStatus[value] || HealthState.UNKNOWN;
};

type GetCephHealthState = (response: K8sResourceKind, loaded: boolean) => HealthState;

export const getDataResiliencyState: PrometheusHealthHandler = (responses = [], errors = []) => {
  const progress: number = getResiliencyProgress(responses[0]);
  if (errors[0]) {
    return { state: HealthState.UNKNOWN };
  }
  if (!responses[0]) {
    return { state: HealthState.LOADING };
  }
  if (Number.isNaN(progress)) {
    return { state: HealthState.UNKNOWN };
  }
  if (progress < 1) {
    return { state: HealthState.PROGRESS };
  }
  return { state: HealthState.OK };
};
