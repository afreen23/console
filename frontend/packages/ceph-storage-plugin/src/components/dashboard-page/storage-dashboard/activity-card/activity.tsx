import * as _ from 'lodash';
import { PrometheusResponse } from '@console/internal/components/graphs';

const getGaugeValue = (response) => {
  return _.get(response, 'data.result[0].value[1]', null);
};

export const isDataResiliencyActivity = (results: PrometheusResponse[]) => {
  const [totalPGRaw, cleanAndActivePGRaw] = results;
  const totalPg = getGaugeValue(totalPGRaw);
  const cleanAndActivePg = getGaugeValue(cleanAndActivePGRaw);
  const error = !(totalPg && cleanAndActivePg);
  let progressPercentage = null;
  if (!error) {
    progressPercentage = ((Number(cleanAndActivePg) / Number(totalPg)) * 100).toFixed(1);
  }
  return progressPercentage >= 100 || !progressPercentage;
};
