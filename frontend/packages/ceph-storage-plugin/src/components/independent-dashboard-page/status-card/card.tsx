import * as React from 'react';
import { GalleryItem, Gallery } from '@patternfly/react-core';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import HealthBody from '@console/shared/src/components/dashboard/status-card/HealthBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import HealthItem from '@console/shared/src/components/dashboard/status-card/HealthItem';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { K8sResourceKind, referenceForModel } from '@console/internal/module/k8s';
import { getCephHealthState } from '../../dashboard-page/storage-dashboard/status-card/utils';
import { cephClusterResource } from '../../../constants/resources';
import { getClusterHealth } from '../../independent-mode/utils';
import { OCSServiceModel } from '../../../models';
import { OCS_INDEPENDENT_CR_NAME, CEPH_STORAGE_NAMESPACE } from '../../../constants';
import { FirehoseResource } from '@console/internal/components/utils';

const ocsResource: FirehoseResource = {
  kind: referenceForModel(OCSServiceModel),
  name: OCS_INDEPENDENT_CR_NAME,
  namespaced: true,
  namespace: CEPH_STORAGE_NAMESPACE,
  isList: false,
  prop: 'ocs',
};

const StatusCard: React.FC = () => {
  const [data, loaded, loadError] = useK8sWatchResource<K8sResourceKind[]>(cephClusterResource);
  const [ocsData, ocsloaded, ocsloadError] = useK8sWatchResource<K8sResourceKind>(ocsResource);

  const cephHealth = getCephHealthState({ ceph: { data, loaded, loadError } });
  const connectionStatus = getClusterHealth(ocsData, ocsloaded, ocsloadError);

  return (
    <DashboardCard gradient>
      <DashboardCardHeader>
        <DashboardCardTitle>Status</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <HealthBody>
          <Gallery className="co-overview-status__health" gutter="md">
            <GalleryItem>
              <HealthItem
                title="OCS Cluster Connection"
                state={connectionStatus.state}
                details={connectionStatus.message}
              />
            </GalleryItem>
            <GalleryItem>
              <HealthItem title="OCS Cluster Health" state={cephHealth.state} />
            </GalleryItem>
          </Gallery>
        </HealthBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default StatusCard;
