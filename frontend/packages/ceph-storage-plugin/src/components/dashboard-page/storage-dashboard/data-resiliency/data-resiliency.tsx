import * as React from 'react';
import * as _ from 'lodash';
import { Progress } from '@patternfly/react-core';
import { PrometheusResponse } from '@console/internal/components/graphs';
import './data-resiliency.scss';

const getCapacityStats = (response) => {
  return _.get(response, 'data.result[0].value[1]', null);
};

const DataResiliencyBuildBody: React.FC<DataResiliencyBuildBody> = ({ progressPercentage }) => (
  <>
    <Progress
      className="ceph-data-resiliency__progress-bar"
      value={progressPercentage}
      title="Rebuilding in Progress"
      label={`${progressPercentage}%`}
    />
  </>
);

export const DataResiliency: React.FC<DataResiliencyProps> = (props) => {
  const [totalPGRaw, cleanAndActivePGRaw] = props.results;
  const totalPg = getCapacityStats(totalPGRaw);
  const cleanAndActivePg = getCapacityStats(cleanAndActivePGRaw);
  let progressPercentage;
  progressPercentage = ((Number(cleanAndActivePg) / Number(totalPg)) * 100).toFixed(1);
  if (!Number.isFinite(Number(progressPercentage))) {
    progressPercentage = 0;
  }
  return <DataResiliencyBuildBody progressPercentage={progressPercentage} />;
};

// export const DataResiliencyWithResources = withDashboardResources(DataResiliency);

type DataResiliencyProps = { results: PrometheusResponse[] };

type DataResiliencyBuildBody = {
  progressPercentage: number;
};
