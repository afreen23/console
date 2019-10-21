import * as _ from 'lodash';
import { Humanize } from '@console/internal/components/utils';
import { PrometheusResponse } from '@console/internal/components/graphs';

export const getStackChartStats: GetStackStats = (response, metric, humanize) => {
  const results = _.get(response, 'data.result', []);
  return results.map((r) => {
    const y = parseFloat(_.get(r, 'value[1]'));
    const name = _.get(r, ['metric', metric], '');
    const capacity = humanize(y).string;
    return {
      // INFO: x value needs to be same for single bar stack chart
      x: '',
      y,
      name: _.truncate(name, { length: 12 }),
      link: name,
      color: 'blue',
      label: capacity,
    };
  });
};

type GetStackStats = (
  response: PrometheusResponse,
  metric: string,
  humanize: Humanize,
) => StackDataPoint[];

export type StackDataPoint = {
  x: string;
  y: number;
  name: string;
  label: string;
  link: string;
  color: string;
};

export const getCapacityValue = (cephUsed: any, cephTotal: any, formatValue: Humanize) => {
  const totalFormatted = formatValue(cephTotal || 0);
  const usedFormatted = formatValue(cephUsed || 0, null, totalFormatted.unit);
  const available = formatValue(
    totalFormatted.value - usedFormatted.value,
    totalFormatted.unit,
    totalFormatted.unit,
  );
  return available;
};
