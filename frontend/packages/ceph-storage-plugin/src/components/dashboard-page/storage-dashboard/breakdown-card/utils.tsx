import * as _ from 'lodash';
import { Humanize } from '@console/internal/components/utils';
import { PrometheusResponse } from '@console/internal/components/graphs';

const getTotal = (stats: StackDataPoint[]) => {
  return stats.reduce((total, dataPoint) => total + dataPoint.y, 0);
};

const addOthers = (stats: StackDataPoint[], totalUsed, formatValue) => {
  const top5Total = getTotal(stats);
  const others = totalUsed - top5Total;
  const othersData = {
    x: '',
    y: others,
    name: 'Others',
    color: 'black',
    label: formatValue(others).string,
  };
  return othersData;
};

export const addAvailable = (stats: StackDataPoint[], total, used, totalUsed, formatValue) => {
  const availableInBytes = Number(total) - Number(used) - 3095310657888;
  let othersData = {};
  if (stats.length === 5) {
    othersData = addOthers(stats, totalUsed, formatValue);
  }
  const availableData = {
    x: '',
    y: availableInBytes,
    label: `Available\n${formatValue(availableInBytes).string}`,
  };
  return othersData ? [...stats, othersData, availableData] : [...stats, availableData];
};

export const getBarRadius = (index: number, length: number) => {
  if (index === 0) {
    return { bottom: 3 };
  }
  if (index === length - 1) {
    return { top: 3 };
  }
  return {};
};

export const isAvailableBar = (index: number, length: number) => {
  if (index === length - 1) {
    return { fill: '#b8bbbe' };
  }
  return {};
};

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
