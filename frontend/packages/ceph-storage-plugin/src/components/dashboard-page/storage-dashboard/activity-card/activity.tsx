import * as React from 'react';
import * as _ from 'lodash';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { InProgressIcon } from '@patternfly/react-icons';

const getCapacityStats = (response) => {
  return _.get(response, 'data.result[0].value[1]', null);
};

const getCapacity = (resource) => _.get(resource, 'spec.storageDeviceSets[0].count') * 3;

export const isDataResiliencyActivity = (results: PrometheusResponse[]) => {
  const [totalPGRaw, cleanAndActivePGRaw] = results;
  const totalPg = getCapacityStats(totalPGRaw);
  const cleanAndActivePg = getCapacityStats(cleanAndActivePGRaw);
  const error = !(totalPg && cleanAndActivePg);
  // const error = cleanAndActivePGRawError || totalPGRawError || !(totalPg && cleanAndActivePg);

  let progressPercentage;
  if (!error) {
    progressPercentage = ((Number(cleanAndActivePg) / Number(totalPg)) * 100).toFixed(1);
    if (!Number.isFinite(Number(progressPercentage))) {
      progressPercentage = 0;
    }
  }
  return progressPercentage >= 100 || !progressPercentage;
};

export const isExpandClusterActivity = (resource: K8sResourceKind) =>
  _.get(resource, 'status.phase') === 'Progressing';

export const getExpandClusterTimestamp = (resource: K8sResourceKind) =>
  new Date(_.get(resource, 'status.history[0].startedTime'));

export const ExpandClusterActivity: React.FC<ExpandClusterActivityProps> = React.memo(
  ({ resource }) => (
    <div>
      <InProgressIcon className="co-cluster-activity__icon co-dashboard-icon fa-spin" />
      Expanding cluster to {getCapacity(resource)}
    </div>
  ),
  (prevProps, newProps) => getCapacity(prevProps.resource) === getCapacity(newProps.resource),
);

type ExpandClusterActivityProps = {
  resource: K8sResourceKind;
};
