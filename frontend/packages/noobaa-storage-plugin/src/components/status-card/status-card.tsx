import * as React from 'react';
import * as _ from 'lodash';
import { Gallery, GalleryItem } from '@patternfly/react-core';
import {
  DashboardCardHeader,
  DashboardCard,
  DashboardCardTitle,
  DashboardCardBody,
} from '@console/internal/components/dashboard/dashboard-card';
import { AlertsBody } from '@console/internal/components/dashboard/status-card/status-body';
import { HealthBody } from '@console/internal/components/dashboard/status-card/health-body';
import { HealthItem } from '@console/internal/components/dashboard/status-card/health-item';
import { AlertItem } from '@console/internal/components/dashboard/status-card/alert-item';
import { ALERTS_KEY } from '@console/internal/actions/dashboards';
import { alertURL, PrometheusRulesResponse } from '@console/internal/components/monitoring';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { FirehoseResource, FirehoseResult } from '@console/internal/components/utils';
import { getAlerts } from '@console/internal/components/dashboard/health-card';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { referenceForModel } from '@console/internal/module/k8s';
import { filterNooBaaAlerts } from '../../utils';
import { DATA_RESILIENCE_QUERIES, HealthCardQueries } from '../../queries';
import { NooBaaSystemModel } from '../../models';
import { getObjectStorageHealthState, getDataResiliencyState } from './utils';

const noobaaSystemResource: FirehoseResource = {
  kind: referenceForModel(NooBaaSystemModel),
  isList: true,
  prop: 'noobaa',
};

export const StatusCard = withDashboardResources(
  ({
    watchK8sResource,
    stopWatchK8sResource,
    watchPrometheus,
    resources,
    stopWatchPrometheusQuery,
    prometheusResults,
  }: DashboardItemProps) => {
    React.useEffect(() => {
      watchK8sResource(noobaaSystemResource);
      Object.keys(HealthCardQueries).forEach((key) => watchPrometheus(HealthCardQueries[key]));
      watchPrometheus(DATA_RESILIENCE_QUERIES.REBUILD_PROGRESS_QUERY);
      return () => {
        stopWatchK8sResource(noobaaSystemResource);
        Object.keys(HealthCardQueries).forEach((key) =>
          stopWatchPrometheusQuery(HealthCardQueries[key]),
        );
        stopWatchPrometheusQuery(DATA_RESILIENCE_QUERIES.REBUILD_PROGRESS_QUERY);
      };
    }, [watchK8sResource, stopWatchK8sResource, watchPrometheus, stopWatchPrometheusQuery]);

    const bucketsQueryResult = prometheusResults.getIn([
      HealthCardQueries.BUCKETS_COUNT,
      'data',
    ]) as PrometheusResponse;
    const bucketsQueryResultError = prometheusResults.getIn([
      HealthCardQueries.BUCKETS_COUNT,
      'loadError',
    ]);

    const unhealthyBucketsQueryResult = prometheusResults.getIn([
      HealthCardQueries.UNHEALTHY_BUCKETS,
      'data',
    ]) as PrometheusResponse;
    const unhealthyBucketsQueryResultError = prometheusResults.getIn([
      HealthCardQueries.UNHEALTHY_BUCKETS,
      'loadError',
    ]);

    const poolsQueryResult = prometheusResults.getIn([
      HealthCardQueries.POOLS_COUNT,
      'data',
    ]) as PrometheusResponse;
    const poolsQueryResultError = prometheusResults.getIn([
      HealthCardQueries.POOLS_COUNT,
      'loadError',
    ]);

    const unhealthyPoolsQueryResult = prometheusResults.getIn([
      HealthCardQueries.UNHEALTHY_POOLS,
      'data',
    ]) as PrometheusResponse;
    const unhealthyPoolsQueryResultError = prometheusResults.getIn([
      HealthCardQueries.UNHEALTHY_POOLS,
      'loadError',
    ]);

    const progressResult = prometheusResults.getIn([
      DATA_RESILIENCE_QUERIES.REBUILD_PROGRESS_QUERY,
      'data',
    ]) as PrometheusResponse;
    const progressError = prometheusResults.getIn([
      DATA_RESILIENCE_QUERIES.REBUILD_PROGRESS_QUERY,
      'loadError',
    ]);

    const error =
      bucketsQueryResultError ||
      unhealthyBucketsQueryResultError ||
      poolsQueryResultError ||
      unhealthyPoolsQueryResultError;
    const noobaaSystem = _.get(resources, 'noobaa') as FirehoseResult;

    const objectServiceHealthState = getObjectStorageHealthState(
      bucketsQueryResult,
      unhealthyBucketsQueryResult,
      poolsQueryResult,
      unhealthyPoolsQueryResult,
      noobaaSystem,
      error,
    );

    return (
      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Status</DashboardCardTitle>
        </DashboardCardHeader>
        <DashboardCardBody>
          <HealthBody>
            <Gallery className="co-overview-status__health" gutter="md">
              <GalleryItem>
                <HealthItem
                  title="Noobaa"
                  state={objectServiceHealthState.state}
                  details={objectServiceHealthState.message}
                />
              </GalleryItem>
              <GalleryItem>
                <HealthItem
                  title="Data Resiliency"
                  state={getDataResiliencyState([progressResult], [progressError]).state}
                />
              </GalleryItem>
            </Gallery>
          </HealthBody>
          <CephAlerts />
        </DashboardCardBody>
      </DashboardCard>
    );
  },
);

const CephAlerts = withDashboardResources(({ watchAlerts, stopWatchAlerts, alertsResults }) => {
  React.useEffect(() => {
    watchAlerts();
    return () => {
      stopWatchAlerts();
    };
  }, [watchAlerts, stopWatchAlerts]);

  const alertsResponse = alertsResults.getIn([ALERTS_KEY, 'data']) as PrometheusRulesResponse;
  const alertsResponseError = alertsResults.getIn([ALERTS_KEY, 'loadError']);
  const alerts = filterNooBaaAlerts(getAlerts(alertsResponse));

  return (
    <AlertsBody
      isLoading={!alertsResponse}
      error={alertsResponseError}
      emptyMessage="No object service alerts"
    >
      {alerts.length
        ? alerts.map((alert) => <AlertItem key={alertURL(alert, alert.rule.id)} alert={alert} />)
        : null}
    </AlertsBody>
  );
});
