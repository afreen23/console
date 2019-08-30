import * as React from 'react';
import { ActivityProgress } from '@console/internal/components/dashboard/activity-card/activity-item';
import { ResourceLink } from '@console/internal/components/utils';
import { getNamespace, getName } from '@console/shared';
import { NodeModel } from '@console/internal/models';
import { PrometheusActivityProps, K8sActivityProps } from '@console/plugin-sdk';
import { Spinner } from '@patternfly/react-core/dist/esm/experimental';

export const DemoActivity: React.FC<K8sActivityProps> = ({ resource }) => (
  <ActivityProgress title={`Demo activity for node ${getName(resource)}`} progress={30}>
    <ResourceLink
      kind={NodeModel.kind}
      name={getName(resource)}
      namespace={getNamespace(resource)}
    />
  </ActivityProgress>
);

export const DemoPrometheusActivity: React.FC<PrometheusActivityProps> = () => (
  <div>
    <Spinner size="md" />
    Demo prometheus activity
  </div>
);
