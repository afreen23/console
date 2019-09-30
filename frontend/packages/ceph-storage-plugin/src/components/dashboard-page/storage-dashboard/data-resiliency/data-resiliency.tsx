import * as React from 'react';
import * as _ from 'lodash';
import { Progress, ProgressSize } from '@patternfly/react-core';
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
      size={ProgressSize.sm}
    />
  </>
);

export const DataResiliency: React.FC<DataResiliencyProps> = ({ results }) => {
  const [totalPGRaw, cleanAndActivePGRaw] = results;
  const totalPg = getCapacityStats(totalPGRaw);
  const cleanAndActivePg = getCapacityStats(cleanAndActivePGRaw);
  const progressPercentage = ((Number(cleanAndActivePg) / Number(totalPg)) * 100).toFixed(1);
  return <DataResiliencyBuildBody progressPercentage={Number(progressPercentage)} />;
};

type DataResiliencyProps = { results: PrometheusResponse[] };

type DataResiliencyBuildBody = {
  progressPercentage: number;
};
