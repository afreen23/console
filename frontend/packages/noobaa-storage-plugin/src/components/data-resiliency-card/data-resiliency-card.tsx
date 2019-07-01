import * as React from 'react';
import * as _ from 'lodash';
import { Icon } from 'patternfly-react';
import { Progress } from '@patternfly/react-core';

import './data-resiliency-card.scss';

import { DashboardCard } from '@console/internal/components/dashboard/dashboard-card/card';
import { DashboardCardBody } from '@console/internal/components/dashboard/dashboard-card/card-body';
import { DashboardCardHeader } from '@console/internal/components/dashboard/dashboard-card/card-header';
import { DashboardCardTitle } from '@console/internal/components/dashboard/dashboard-card/card-title';
import {
  withDashboardResources,
  DashboardItemProps,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { DashboardCardHelp } from '@console/internal/components/dashboard/dashboard-card';

enum DATA_RESILIENCE_QUERIES {
  CEPH_PG_CLEAN_AND_ACTIVE_QUERY = 'ceph_pg_clean and ceph_pg_acti',
  CEPH_PG_TOTAL_QUERY = 'ceph_pg_tot',
}

const getCapacityStats = (response) => {
  return _.get(response, 'data.result[0].value[1]');
};

const DataResiliencyStatusBody: React.FC<DataResiliencyStatusBody> = ({ isResilient }) =>
  isResilient ? (
    <>
      <div className="ceph-data-resiliency__status-title-ok">Your Data is Resilient</div>
      <div className="ceph-data-resiliency__icon-ok">
        <Icon type="fa" name="check-circle" size="5x" />
      </div>
    </>
  ) : (
    <>
      <div className="ceph-data-resiliency__icon-error">
        <Icon type="fa" name="exclamation-triangle" size="5x" />
      </div>
      <div className="ceph-data-resiliency__status-title-error">No data available</div>
    </>
  );

const DataResiliencyBuildBody: React.FC<DataResiliencyBuildBody> = ({ progressPercentage }) => (
  <>
    <div className="ceph-data-resiliency__title">Rebuilding data</div>
    <Progress
      className="ceph-data-resiliency__utilization-bar"
      value={progressPercentage}
      title="Rebuilding in Progress"
      label={`${progressPercentage}%`}
    />
  </>
);

const DataResiliency: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  React.useEffect(() => {
    Object.keys(DATA_RESILIENCE_QUERIES).forEach((key) =>
      watchPrometheus(DATA_RESILIENCE_QUERIES[key]),
    );
    return () =>
      Object.keys(DATA_RESILIENCE_QUERIES).forEach((key) =>
        stopWatchPrometheusQuery(DATA_RESILIENCE_QUERIES[key]),
      );
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const cleanAndActivePgRaw = prometheusResults.getIn([
    DATA_RESILIENCE_QUERIES.CEPH_PG_CLEAN_AND_ACTIVE_QUERY,
    'result',
  ]);
  const totalPgRaw = prometheusResults.getIn([
    DATA_RESILIENCE_QUERIES.CEPH_PG_TOTAL_QUERY,
    'result',
  ]);

  const totalPg = getCapacityStats(totalPgRaw);
  const cleanAndActivePg = getCapacityStats(cleanAndActivePgRaw);

  let progressPercentage;
  if (totalPg && cleanAndActivePg) {
    progressPercentage = ((Number(cleanAndActivePg) / Number(totalPg)) * 100).toFixed(1);
  }
  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Data Resiliency</DashboardCardTitle>
        <DashboardCardHelp>
          Data resiliency is the ability of stored objects to recover and continue operating in the
          case of a failure.Certain changes in the system (unavailable resource/ change of bucket
          policy etc.) cause an object to require a rebuilding process in order to stay resilient.
        </DashboardCardHelp>
      </DashboardCardHeader>
      <DashboardCardBody
        className="ceph-data-resiliency__dashboard-body"
        isLoading={!(totalPgRaw && cleanAndActivePgRaw)}
      >
        {progressPercentage >= 100 || !progressPercentage ? (
          <DataResiliencyStatusBody isResilient={progressPercentage} />
        ) : (
          <DataResiliencyBuildBody progressPercentage={progressPercentage} />
        )}
      </DashboardCardBody>
    </DashboardCard>
  );
};

export const DataResiliencyCard = withDashboardResources(DataResiliency);

type DataResiliency = {
  totalPgRaw: object;
  cleanAndActivePgRaw: object;
};

type DataResiliencyBuildBody = {
  progressPercentage: number;
};

type DataResiliencyStatusBody = {
  isResilient: number;
};