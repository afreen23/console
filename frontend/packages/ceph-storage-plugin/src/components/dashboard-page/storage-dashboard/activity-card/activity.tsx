import * as React from 'react';
import * as _ from 'lodash';
import { Progress, ProgressSize } from '@patternfly/react-core';
import { PrometheusResponse } from '@console/internal/components/graphs';

const getGaugeValue = (response: PrometheusResponse) => _.get(response, 'data.result[0].value[1]');

const getProgressPercentage = (results: PrometheusResponse[]): number => {
  const [cleanAndActivePgRaw, totalPgRaw] = results;
  const totalPg = getGaugeValue(totalPgRaw);
  const cleanAndActivePg = getGaugeValue(cleanAndActivePgRaw);
  const progressPercentage = Number(cleanAndActivePg) / Number(totalPg);
  if (Number.isFinite(progressPercentage)) {
    return Number((progressPercentage * 100).toFixed(1));
  }
  return null;
};

export const isDataResiliencyActivity = (results: PrometheusResponse[]): boolean => {
  const progress = getProgressPercentage(results);
  return progress && progress < 100;
};

export const DataResiliencyAcivity: React.FC<DataResiliencyProps> = ({ results }) => {
  const progress = getProgressPercentage(results);
  return (
    <>
      <Progress
        className="co-activity-item__progress"
        value={progress}
        size={ProgressSize.sm}
        title="Rebuilding data resiliency"
        label={`${progress}%`}
      />
      <div>Rebuilding covers rebalancing, redistributing, scrubbing, etc.</div>
    </>
  );
};

type DataResiliencyProps = {
  results: PrometheusResponse[];
};
