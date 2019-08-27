import * as _ from 'lodash';
import { Alert } from '@console/internal/components/monitoring';
import { Humanize } from '@console/internal/components/utils';
import { PrometheusResponse, DataPoint } from '@console/internal/components/graphs';
import { DATA_CONSUMPTION_QUERIES, ObjectServiceDashboardQuery } from './constants/queries';
import {
  ACCOUNTS,
  BY_IOPS,
  BY_LOGICAL_USAGE,
  BY_PHYSICAL_VS_LOGICAL_USAGE,
  BY_EGRESS,
  PROVIDERS,
} from './constants';

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

export const filterNooBaaAlerts = (alerts: Alert[]): Alert[] =>
  alerts.filter((alert) => _.get(alert, 'annotations.storage_type') === 'NooBaa');

export const getPropsData = (data) => _.get(data, 'data.result[0].value[1]', null);

export const getMetric = (result: PrometheusMetricResult, metric: string): string =>
  _.get(result, ['metric', metric], null);

export const getValue = (result: PrometheusMetricResult): number => _.get(result, 'value[1]', null);

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

type GetChartData = (
  response: PrometheusResponse,
  metric: string,
  humanize: Humanize,
  name?: string,
) => DataPoint[];

type GetLegendData = (response: PrometheusResponse, humanize: Humanize) => string;

export type PrometheusMetricResult = {
  metric: { [key: string]: any };
  value?: [number, string | number];
};
