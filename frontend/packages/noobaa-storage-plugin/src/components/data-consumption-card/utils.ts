import * as _ from 'lodash';
import { Humanize, humanizeBinaryBytes, humanizeNumber } from '@console/internal/components/utils';
import { PrometheusResponse, DataPoint } from '@console/internal/components/graphs';
import {
  ACCOUNTS,
  BY_IOPS,
  BY_LOGICAL_USAGE,
  BY_PHYSICAL_VS_LOGICAL_USAGE,
  BY_EGRESS,
  PROVIDERS,
} from '../../constants';
import { DATA_CONSUMPTION_QUERIES, ObjectServiceDashboardQuery } from '../../constants/queries';

export const DataConsumersValue = {
  [PROVIDERS]: 'PROVIDERS_',
  [ACCOUNTS]: 'ACCOUNTS_',
};
export const DataConsumersSortByValue = {
  [BY_IOPS]: 'BY_IOPS',
  [BY_LOGICAL_USAGE]: 'BY_LOGICAL_USAGE',
  [BY_PHYSICAL_VS_LOGICAL_USAGE]: 'BY_PHYSICAL_VS_LOGICAL_USAGE',
  [BY_EGRESS]: 'BY_EGRESS',
};

export const getQueries: GetQueries = (metric, kpi) => {
  const queries =
    DATA_CONSUMPTION_QUERIES[
      ObjectServiceDashboardQuery[DataConsumersValue[metric] + DataConsumersSortByValue[kpi]]
    ];
  const keys = Object.keys(queries);
  return { queries, keys };
};

type QueryObject = {
  [key: string]: string;
};

type GetQueries = (metric: string, kpi: string) => { queries: QueryObject; keys: string[] };

export const getChartData: GetChartData = (response, metric, humanize, name) => {
  const result = _.get(response, 'data.result', []);
  return result.map((r) => {
    const x = _.get(r, ['metric', metric], '');
    const y = parseFloat(_.get(r, 'value[1]'));
    let val = name;
    if (!name) val = x;
    return {
      name: val,
      x,
      y: Number(humanize(y).value),
    };
  });
};

export const getLegendData: GetLegendData = (response, humanize) => {
  const value = _.get(response, 'data.result[0].value[1]', null);
  return value ? humanize(Number(value)).string : '';
};

export const getDataConsumptionChartData: GetDataConsumptionChartData = (
  result,
  metric,
  dropdownValue,
) => {
  let chartData;
  let legendData;
  switch (dropdownValue) {
    case 'PROVIDERS_BY_IOPS':
    case 'ACCOUNTS_BY_IOPS':
      chartData = [
        getChartData(result.read, metric, humanizeNumber, 'Total Reads'),
        getChartData(result.write, metric, humanizeNumber, 'Total Writes'),
      ];
      legendData = [
        { name: `Total Reads ${getLegendData(result.totalRead, humanizeNumber)}` },
        { name: `Total Writes ${getLegendData(result.totalWrite, humanizeNumber)}` },
      ];
      break;
    case 'ACCOUNTS_BY_LOGICAL_USAGE':
      chartData = [
        getChartData(
          result.logicalUsage,
          metric,
          humanizeBinaryBytes,
          'Total Logical Used Capacity',
        ),
      ];
      legendData = [
        {
          name: `Total Logical Used Capacity ${getLegendData(
            result.totalLogicalUsage,
            humanizeBinaryBytes,
          )}`,
        },
      ];
      break;
    case 'PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE':
      chartData = [
        getChartData(
          result.physicalUsage,
          metric,
          humanizeBinaryBytes,
          'Total Logical Used Capacity',
        ),
        getChartData(
          result.logicalUsage,
          metric,
          humanizeBinaryBytes,
          'Total Physical Used Capacity',
        ),
      ];
      legendData = [
        {
          name: `Total Logical Used Capacity ${getLegendData(
            result.totalPhysicalUsage,
            humanizeBinaryBytes,
          )}`,
        },
        {
          name: `Total Physical Used Capacity ${getLegendData(
            result.totalLogicalUsage,
            humanizeBinaryBytes,
          )}`,
        },
      ];
      break;
    case 'PROVIDERS_BY_EGRESS':
      chartData = [getChartData(result.egress, metric, humanizeBinaryBytes)];
      legendData = chartData[0].map((dataPoint) => ({
        name: `${dataPoint.x} ${humanizeBinaryBytes(dataPoint.y).string}`,
      }));
      break;
    default:
      chartData = [];
      legendData = [];
  }
  return { chartData, legendData };
};

export type BarChartData = {
  x: string;
  y: number;
  name: string;
};

type GetChartData = (
  response: PrometheusResponse,
  metric: string,
  humanize: Humanize,
  name?: string,
) => DataPoint[];

type GetDataConsumptionChartData = (
  result: { [key: string]: PrometheusResponse },
  metric: string,
  dropdownValue: string,
) => {
  chartData: [BarChartData[]] | [BarChartData[], BarChartData[]];
  legendData: { name: string }[];
};

type GetLegendData = (response: PrometheusResponse, humanize: Humanize) => string;
