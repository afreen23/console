import * as React from 'react';
import { Gallery, GalleryItem } from '@patternfly/react-core';
import { ALERTS_KEY } from '@console/internal/actions/dashboards';
import AlertsBody from '@console/shared/src/components/dashboard/status-card/AlertsBody';
import AlertItem from '@console/shared/src/components/dashboard/status-card/AlertItem';
import { alertURL, PrometheusRulesResponse } from '@console/internal/components/monitoring';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import HealthBody from '@console/shared/src/components/dashboard/status-card/HealthBody';
import HealthItem from '@console/shared/src/components/dashboard/status-card/HealthItem';
import { getAlerts } from '@console/shared/src/components/dashboard/status-card/alert-utils';
import { PrometheusResponse } from '@console/internal/components/graphs';
import {
  withDashboardResources,
  DashboardItemProps,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import { FirehoseResource } from '@console/internal/components/utils';
import { DATA_RESILIENCY_QUERY, StorageDashboardQuery } from '../../../../constants/queries';
import { filterCephAlerts } from '../../../../selectors';
import { getCephHealthState, getDataResiliencyState } from './utils';
import { CephClusterModel } from '../../../../models';

const cephClusterResource: FirehoseResource = {
  isList: true,
  kind: CephClusterModel.kind,
  prop: 'cephCluster',
};

const resiliencyProgressQuery = DATA_RESILIENCY_QUERY[StorageDashboardQuery.RESILIENCY_PROGRESS];

const CephAlerts = withDashboardResources(({ watchAlerts, stopWatchAlerts, alertsResults }) => {
  React.useEffect(() => {
    watchAlerts();
    return () => {
      stopWatchAlerts();
    };
  }, [watchAlerts, stopWatchAlerts]);

  const alertsResponse = alertsResults.getIn([ALERTS_KEY, 'data']) as PrometheusRulesResponse;
  const alertsResponseError = alertsResults.getIn([ALERTS_KEY, 'loadError']);
  const alerts = filterCephAlerts(getAlerts(alertsResponse));

  return (
    <AlertsBody
      isLoading={!alertsResponse}
      error={alertsResponseError}
      emptyMessage="No persistent storage alerts"
    >
      {alerts.length
        ? alerts.map((alert) => <AlertItem key={alertURL(alert, alert.rule.id)} alert={alert} />)
        : null}
    </AlertsBody>
  );
});

export const StatusCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  watchK8sResource,
  stopWatchK8sResource,
  stopWatchPrometheusQuery,
  prometheusResults,
  resources,
}) => {
  React.useEffect(() => {
    watchK8sResource(cephClusterResource);
    watchPrometheus(resiliencyProgressQuery);

    return () => {
      stopWatchK8sResource(cephClusterResource);
      stopWatchPrometheusQuery(resiliencyProgressQuery);
    };
  }, [watchPrometheus, stopWatchPrometheusQuery, watchK8sResource, stopWatchK8sResource]);

  const cephResource = resources?.cephCluster;
  const cephLoaded = cephResource?.loaded;
  const cephStatus = cephResource?.data?.[0];
  const resiliencyProgress = prometheusResults.getIn([
    resiliencyProgressQuery,
    'data',
  ]) as PrometheusResponse;
  const resiliencyProgressError = prometheusResults.getIn([resiliencyProgressQuery, 'loadError']);

  const cephHealthState = getCephHealthState(cephStatus, cephLoaded);
  const dataResiliencyState = getDataResiliencyState(
    [resiliencyProgress],
    [resiliencyProgressError],
  );

  return (
    <DashboardCard gradient>
      <DashboardCardHeader>
        <DashboardCardTitle>Status</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <HealthBody>
          <Gallery className="co-overview-status__health" gutter="md">
            <GalleryItem>
              <HealthItem title="OCS Cluster" state={cephHealthState} />
            </GalleryItem>
            <GalleryItem>
              <HealthItem title="Data Resiliency" state={dataResiliencyState.state} />
            </GalleryItem>
          </Gallery>
        </HealthBody>
        <CephAlerts />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(StatusCard);
