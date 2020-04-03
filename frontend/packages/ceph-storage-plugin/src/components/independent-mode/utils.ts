import * as _ from 'lodash';
import { ClusterServiceVersionKind } from '@console/operator-lifecycle-manager';
import { HealthState } from '@console/shared/src/components/dashboard/status-card/states';
import { DataValidator, DataState, ErrorType, Field } from './types';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { SubsystemHealth } from '@console/plugin-sdk';

export const getValidJSON: DataValidator = (fData) => {
  try {
    // Just see if it fails
    const parsedData = JSON.parse(fData);
    return { isValid: true, parsedData };
  } catch (e) {
    return { isValid: false, errorMessage: 'File is not a valid JSON file.' };
  }
};

export const checkError = (data: DataState): ErrorType[] => {
  const errors: ErrorType[] = [];
  for (const key in data) {
    if (!_.isNull(data[key]) && _.isEmpty(_.trim(data[key])))
      errors.push({ field: key as Field, message: `${key} cannot be empty` });
    else errors.push({ field: key as Field, message: '' });
  }
  return errors;
};

export const checkForIndependentSupport = (csv: ClusterServiceVersionKind): boolean => {
  const independent: string =
    csv.metadata.annotations?.['external.cluster.ocs.openshift.io/supported'];
  return independent === 'true';
};

enum ClusterPhase {
  CONNECTED = 'Connected',
  READY = 'Ready',
  CONNECTING = 'Connecting',
  PROGRESSING = 'Progressing',
  ERROR = 'Error',
}

const PhaseToState = Object.freeze({
  [ClusterPhase.CONNECTED]: { state: HealthState.OK, message: 'Connected' },
  [ClusterPhase.READY]: { state: HealthState.OK, message: 'Ready' },
  [ClusterPhase.CONNECTING]: { state: HealthState.UPDATING, message: 'Connecting' },
  [ClusterPhase.PROGRESSING]: { state: HealthState.UPDATING, message: 'Progressing' },
  [ClusterPhase.ERROR]: { state: HealthState.ERROR, message: 'Error in Connection' },
});

export const getClusterHealth = (
  cluster: K8sResourceKind,
  loaded: boolean,
  error,
): SubsystemHealth => {
  const phase = cluster?.status?.phase;
  if (!_.isEmpty(error)) {
    if (error?.response?.status === 404) return { state: HealthState.NOT_AVAILABLE };
    return { state: HealthState.ERROR, message: 'Error in Connection' };
  }
  if (!loaded) return { state: HealthState.LOADING };
  if (!_.isEmpty(cluster)) return PhaseToState[phase];
  return { state: HealthState.NOT_AVAILABLE };
};
