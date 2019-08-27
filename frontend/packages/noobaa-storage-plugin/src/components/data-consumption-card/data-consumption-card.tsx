import * as React from 'react';
import * as _ from 'lodash';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartThemeColor,
} from '@patternfly/react-charts';
import { ChartBarIcon } from '@patternfly/react-icons';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/internal/components/dashboard/dashboard-card';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { GraphEmpty } from '@console/internal/components/graphs/graph-empty';
import {
  Humanize,
  humanizeBinaryBytes,
  humanizeNumber,
} from '@console/internal/components/utils';
import { PrometheusResponse, DataPoint } from '@console/internal/components/graphs';
import { DATA_CONSUMPTION_QUERIES, ObjectServiceDashboardQuery, DataConsumptionQueriesType } from '../../constants/queries';
import {
  ACCOUNTS,
  BY_IOPS,
  BY_LOGICAL_USAGE,
  BY_PHYSICAL_VS_LOGICAL_USAGE,
  BY_EGRESS,
  PROVIDERS,
} from '../../constants';
import { DataConsumptionDropdown } from './data-consumption-card-dropdown';
import {
  BarChartData,
} from './data-consumption-card-utils';
import './data-consumption-card.scss';


const DataConsumersValue = {
  [PROVIDERS]: 'PROVIDERS_',
  [ACCOUNTS]: 'ACCOUNTS_',
};
const DataConsumersSortByValue = {
  [BY_IOPS]: 'BY_IOPS',
  [BY_LOGICAL_USAGE]: 'BY_LOGICAL_USAGE',
  [BY_PHYSICAL_VS_LOGICAL_USAGE]: 'BY_PHYSICAL_VS_LOGICAL_USAGE',
  [BY_EGRESS]: 'BY_EGRESS',
};
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

const getLegendData: GetLegendData = (response, humanize) => {
  const value = _.get(response, 'data.result[0].value[1]', null);
  return value ? humanize(Number(value)).string : '';
};

const getQueries: GetQueries = (metric, kpi) => {
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

type GetChartData = (
  response: PrometheusResponse,
  metric: string,
  humanize: Humanize,
  name?: string,
) => DataPoint[];

type GetLegendData = (response: PrometheusResponse, humanize: Humanize) => string;

type GetQueries = (metric: string, kpi: string) => { queries: QueryObject; keys: string[] };

const DataConsumptionCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  const [metricType, setMetricType] = React.useState(PROVIDERS);
  const [sortByKpi, setsortByKpi] = React.useState(BY_IOPS);

  React.useEffect(() => {
    const { queries, keys } = getQueries(metricType, sortByKpi);
    keys.forEach((key) => watchPrometheus(queries[key]));
    return () => keys.forEach((key) => stopWatchPrometheusQuery(queries[key]));
  }, [watchPrometheus, stopWatchPrometheusQuery, metricType, sortByKpi]);

  const { queries, keys } = getQueries(metricType, sortByKpi);
  const result: { [key: string]: PrometheusResponse } = {};
  keys.forEach((key) => {
    result[key] = prometheusResults.getIn([queries[key], 'result']);
  });

  let chartData = [];
  let legendData = [];
  let maxData: BarChartData | any = {
    x: '',
    y: 0,
  };
  let maxVal;
  let yTickValues;

  if (!_.some(result, 'undefined')) {
    const curentDropdown = DataConsumersValue[metricType] + DataConsumersSortByValue[sortByKpi];
    switch (curentDropdown) {
      case 'PROVIDERS_BY_IOPS':
      case 'ACCOUNTS_BY_IOPS':
        chartData = [
          getChartData(result.read, 'account', humanizeNumber, 'Total Reads'),
          getChartData(result.write, 'account', humanizeNumber, 'Total Writes'),
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
            'account',
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
            'type',
            humanizeBinaryBytes,
            'Total Logical Used Capacity',
          ),
          getChartData(
            result.logicalUsage,
            'type',
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
        chartData = [getChartData(result.egress, 'type', humanizeBinaryBytes)];
        legendData = chartData[0].map((dataPoint) => ({
          name: `${dataPoint.x} ${humanizeBinaryBytes(dataPoint.y).string}`,
        }));
        break;
      default:
    }
    maxData = _.maxBy(chartData.map((data) => _.maxBy(data, 'y')), 'y');
    maxVal = maxData.y;
    yTickValues = [
      Number((maxVal / 10).toFixed(1)),
      Number((maxVal / 5).toFixed(1)),
      Number(((3 * maxVal) / 10).toFixed(1)),
      maxVal,
      Number(((4 * maxVal) / 10).toFixed(1)),
      Number(((5 * maxVal) / 10).toFixed(1)),
      Number(((6 * maxVal) / 10).toFixed(1)),
      Number(((7 * maxVal) / 10).toFixed(1)),
      Number(((8 * maxVal) / 10).toFixed(1)),
      Number(((9 * maxVal) / 10).toFixed(1)),
      Number(Number(maxVal).toFixed(1)),
    ];
  }

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Data Consumption</DashboardCardTitle>
        <DataConsumptionDropdown
          type={metricType}
          setType={setMetricType}
          kpi={sortByKpi}
          setKpi={setsortByKpi}
        />
      </DashboardCardHeader>
      <DashboardCardBody isLoading={!result}>
        {!chartData.some(_.isEmpty) ? (
          <div>
            <Chart
              themeColor={ChartThemeColor.purple}
              domain={{ y: [0, maxVal] }}
              domainPadding={{ x: [15, 20], y: [10, 10] }}
              padding={{ top: 20, bottom: 40, left: 40, right: 17 }}
              height={280}
            >
              <ChartAxis style={{ tickLabels: { padding: 5, fontSize: 10 } }} />
              <ChartAxis
                dependentAxis
                tickValues={yTickValues}
                style={{
                  tickLabels: { padding: 5, fontSize: 8, fontWeight: 500 },
                  grid: { stroke: '#4d525840' },
                }}
              />
              <ChartGroup offset={11}>
                {chartData.map((data) => (
                  <ChartBar key={data.name} data={data} />
                ))}
              </ChartGroup>
            </Chart>
            <ChartLegend
              themeColor={ChartThemeColor.purple}
              data={legendData}
              orientation="horizontal"
              height={40}
              style={{ labels: { fontSize: 10 } }}
            />
          </div>
        ) : (
          <GraphEmpty icon={ChartBarIcon} />
        )}
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(DataConsumptionCard);
