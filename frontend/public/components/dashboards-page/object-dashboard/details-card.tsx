import * as React from 'react';
import * as _ from 'lodash-es';

import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '../../dashboard/dashboard-card';
import { DetailsBody, DetailItem } from '../../dashboard/details-card';
import { withDashboardResources, DashboardItemProps } from '../with-dashboard-resources';
import { InfrastructureModel, ClusterVersionModel } from '../../../models';
import { referenceForModel, K8sResourceKind, getOpenShiftVersion, getClusterName, ClusterVersionKind } from '../../../module/k8s';
import { FirehoseResource } from '../../utils';

const getInfrastructurePlatform = (infrastructure: K8sResourceKind): string => _.get(infrastructure, 'status.platform');

const clusterVersionResource: FirehoseResource = {
  kind: referenceForModel(ClusterVersionModel),
  namespaced: false,
  name: 'version',
  isList: false,
  prop: 'cv',
};

const infrastructureResource: FirehoseResource = {
  kind: referenceForModel(InfrastructureModel),
  namespaced: false,
  name: 'cluster',
  isList: false,
  prop: 'infrastructure',
};

export const DetailsCard_: React.FC<DetailsCardProps> = ({
  watchURL,
  stopWatchURL,
  watchK8sResource,
  stopWatchK8sResource,
  resources,
}) => {
  React.useEffect(() => {
    watchK8sResource(clusterVersionResource);
    watchK8sResource(infrastructureResource);
    watchURL('version');
    return () => {
      stopWatchK8sResource(clusterVersionResource);
      stopWatchK8sResource(infrastructureResource);
      stopWatchURL('version');
    };
  }, [watchK8sResource, stopWatchK8sResource, watchURL, stopWatchURL]);

  const clusterVersion = _.get(resources, 'cv');
  const clusterVersionLoaded = _.get(clusterVersion, 'loaded', false);
  const openshiftVersion = getOpenShiftVersion(_.get(clusterVersion, 'data') as ClusterVersionKind);

  const infrastructure = _.get(resources, 'infrastructure');
  const infrastructureLoaded = _.get(infrastructure, 'loaded', false);
  const infrastructureData = _.get(infrastructure, 'data') as K8sResourceKind;

  return (
    <DashboardCard className="co-details-card">
      <DashboardCardHeader>
        <DashboardCardTitle>Service Details</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <DetailsBody>
          <DetailItem
            key="name"
            title="Name"
            value={getClusterName()}
            isLoading={false}
          />
          <DetailItem
            key="provider"
            title="Provider"
            value={getInfrastructurePlatform(infrastructureData)}
            isLoading={!infrastructureLoaded}
          />
          <DetailItem
            key="openshift"
            title="Version"
            value={openshiftVersion}
            isLoading={!clusterVersionLoaded}
          />
        </DetailsBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

type DetailsCardProps = DashboardItemProps;

export const DetailsCard = withDashboardResources(DetailsCard_);
