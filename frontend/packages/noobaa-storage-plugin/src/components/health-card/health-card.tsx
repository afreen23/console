import * as React from 'react';
import * as _ from 'lodash';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardHelp,
  DashboardCardTitle,
} from '@console/internal/components/dashboard/dashboard-card';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { HealthBody, HealthItem } from '@console/internal/components/dashboard/health-card';
import { HealthState } from '@console/internal/components/dashboard/health-card/states';

import { NOOBAA_HEALTHY, NOOBAA_DEGRADED, NOOBAA_ERROR, NOOBAA_UNKNOWN } from './constants';

enum STORAGE_HEALTH_QUERIES {
  NOOBAA_STATUS_QUERY = 'Noobaa_health_status',
}

const NoobaaHealthStatus = {
  0: {
    message: NOOBAA_HEALTHY,
    state: HealthState.OK,
  },
  1: {
    message: NOOBAA_DEGRADED,
    state: HealthState.WARNING,
  },
  2: {
    message: NOOBAA_ERROR,
    state: HealthState.ERROR,
  },
  3: {
    message: NOOBAA_UNKNOWN,
    state: HealthState.ERROR,
  },
};

const getNoobaaHealthState = (ocsResponse): NoobaaHealth => {
  if (!ocsResponse) {
    return { state: HealthState.LOADING };
  }
  const value = _.get(ocsResponse, 'data.result[0].value[1]');
  return NoobaaHealthStatus[value] || NoobaaHealthStatus[3];
};

const ObjectServiceHealthCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  React.useEffect(() => {
    watchPrometheus(STORAGE_HEALTH_QUERIES.NOOBAA_STATUS_QUERY);
    return () => {
      stopWatchPrometheusQuery(STORAGE_HEALTH_QUERIES.NOOBAA_STATUS_QUERY);
    };
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const queryResult = prometheusResults.getIn([
    STORAGE_HEALTH_QUERIES.NOOBAA_STATUS_QUERY,
    'result',
  ]);

  const NoobaaHealthState = getNoobaaHealthState(queryResult);

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Health</DashboardCardTitle>
        <DashboardCardHelp>
          The object storage health state consists of the system’s data availability, buckets, and
          resources health and functionality.
        </DashboardCardHelp>
      </DashboardCardHeader>
      <DashboardCardBody isLoading={NoobaaHealthState.state === HealthState.LOADING}>
        <HealthBody>
          <HealthItem state={NoobaaHealthState.state} message={NoobaaHealthState.message} />
        </HealthBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export const HealthCard = withDashboardResources(ObjectServiceHealthCard);

type NoobaaHealth = {
  state: HealthState;
  message?: string;
};
