import * as React from 'react';
import * as _ from 'lodash';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartThemeColor,
  getLegendX,
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
import { getInstantVectorStats } from '@console/internal/components/graphs/utils';
import { GraphEmpty } from '@console/internal/components/graphs/graph-empty';
import {
  Humanize,
  humanizeBinaryBytes,
  humanizeDecimalBytes,
  humanizeNumber,
} from '@console/internal/components/utils';
import { PrometheusResponse, DataPoint } from '@console/internal/components/graphs';
import { DATA_CONSUMPTION_QUERIES, ObjectServiceDashboardQuery } from '../../constants/queries';
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
  metricsChartDataMap,
  metricsChartLegendDataMap,
} from './data-consumption-card-utils';
import './data-consumption-card.scss';
import { getMetric, getValue } from '../../utils';

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
export const getGraphInstantVectorStats: GetStats = (response, metric, humanize) => {
  const result = _.get(response, 'data.result', []);
  return result.map((r) => {
    return r.values.map((arr) => ({
      x: _.get(r, ['metric', metric], ''),
      y: Number(humanize(arr[1]).value),
    }));
  });
};

type GetStats = (
  response: PrometheusResponse[],
  metric?: string,
  humanize?: Humanize,
) => DataPoint[];

const DataConsumptionCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  const [metricType, setMetricType] = React.useState(PROVIDERS);
  const [sortByKpi, setsortByKpi] = React.useState(BY_IOPS);

  React.useEffect(() => {
    const queriesObject =
      DATA_CONSUMPTION_QUERIES[
        ObjectServiceDashboardQuery[
          DataConsumersValue[metricType] + DataConsumersSortByValue[sortByKpi]
        ]
      ];
    const keys = Object.keys(queriesObject);
    keys.pop();
    keys.forEach((key) => watchPrometheus(queriesObject[key]));
    return () => keys.forEach((key) => stopWatchPrometheusQuery(queriesObject[key]));
  }, [watchPrometheus, stopWatchPrometheusQuery, metricType, sortByKpi]);

  const queriesObject =
    DATA_CONSUMPTION_QUERIES[
      ObjectServiceDashboardQuery[
        DataConsumersValue[metricType] + DataConsumersSortByValue[sortByKpi]
      ]
    ];
  const keys = Object.keys(queriesObject);
  keys.pop();
  const queryResult = keys.map((key) => {
    const result = prometheusResults.getIn([queriesObject[key], 'result']);
    return result;
  });

  let newChartData = [];
  let newLegendData = [];
  const curentDropdown = DataConsumersValue[metricType] + DataConsumersSortByValue[sortByKpi];
  switch (curentDropdown) {
    case 'ACCOUNTS_BY_IOPS':
    case 'PROVIDERS_BY_IOPS':
      newChartData = [
        getGraphInstantVectorStats(queryResult[0], queriesObject.type, humanizeNumber),
        getGraphInstantVectorStats(queryResult[1], queriesObject.type, humanizeNumber),
      ];
      newLegendData = [
        { name: `Total Reads ${humanizeNumber(getValue(queryResult[2])).string}` },
        { name: `Total Writes ${humanizeNumber(getValue(queryResult[3])).string}` },
      ];
      break;
    case 'ACCOUNTS_BY_LOGICAL_USAGE':
      newChartData = [
        getGraphInstantVectorStats(queryResult[0], queriesObject.type, humanizeBinaryBytes),
      ];
      newLegendData = [
        {
          name: `Total Logical Used Capacity ${
            humanizeBinaryBytes(getValue(queryResult[1])).string
          }`,
        },
      ];
      break;
    case 'PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE':
      newChartData = [
        getGraphInstantVectorStats(queryResult[0], queriesObject.type, humanizeBinaryBytes),
        getGraphInstantVectorStats(queryResult[1], queriesObject.type, humanizeBinaryBytes),
      ];
      newLegendData = [
        {
          name: `Total Logical Used Capacity ${
            humanizeBinaryBytes(getValue(queryResult[2])).string
          }`,
        },
        {
          name: `Total Physical Used Capacity ${
            humanizeBinaryBytes(getValue(queryResult[3])).string
          }`,
        },
      ];
      break;
    case 'PROVIDERS_BY_EGRESS':
      newChartData = [
        getGraphInstantVectorStats(queryResult[0], queriesObject.type, humanizeBinaryBytes),
      ];
      newLegendData = newChartData.map((dataPoint) => ({
        name: `${dataPoint.x} ${humanizeBinaryBytes(dataPoint.y)}`,
      }));
      break;
    default:
  }

  let maxUnit: string;
  let maxVal: number;
  let chartData = [];
  let legendData = [];
  // const result = _.get(queryResult, 'data.result', []);
  // if (result.length) {
  let maxData: BarChartData | any = {
    x: '',
    y: 0,
    name: '',
  };
  chartData = metricsChartDataMap[metricType][sortByKpi](result);
  legendData = metricsChartLegendDataMap[metricType][sortByKpi](chartData);
  maxData = _.maxBy(chartData.map((data) => _.maxBy(data, 'y')), 'y');
  maxVal = maxData.y;
  maxUnit =
    (sortByKpi === BY_IOPS || sortByKpi === BY_PHYSICAL_VS_LOGICAL_USAGE) &&
    chartData.length === 2
      ? humanizeDecimalBytes(maxVal).unit
      : humanizeBinaryBytesWithoutB(maxVal).unit;
  // }

  const yTickValues = [
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
      <DashboardCardBody isLoading={!queryResult}>
        {chartData.length > 0 ? (
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
                tickFormat={(t) => `${t}${maxUnit}`}
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
