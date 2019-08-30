import * as React from 'react';
import * as _ from 'lodash';
import { ClusterVersionKind } from '@console/internal/module/k8s';
import { InProgressIcon } from '@patternfly/react-icons';

import './activity.scss';

export const isClusterUpdateActivity = (resource: ClusterVersionKind) =>
  _.get(resource, 'status.history[0].state') === 'Partial';

export const getClusterUpdateTimestamp = (resource: ClusterVersionKind) =>
  new Date(_.get(resource, 'status.history[0].startedTime'));

const getVersion = (clusterVersion: ClusterVersionKind) =>
  _.get(
    clusterVersion,
    'status.history[0].version',
  ) as ClusterVersionKind['status']['history'][0]['version'];

export const ClusterUpdateActivity: React.FC<ClusterUpdateActivityProps> = React.memo(
  ({ resource }) => (
    <div>
      <InProgressIcon className="co-cluster-activity__icon co-dashboard-icon fa-spin" />
      Updating cluster to {getVersion(resource)}
    </div>
  ),
  (prevProps, newProps) => getVersion(prevProps.resource) === getVersion(newProps.resource),
);

type ClusterUpdateActivityProps = {
  resource: ClusterVersionKind;
};
