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
import { humanizeBinaryBytes, humanizeNumber } from '@console/internal/components/utils';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { BY_IOPS, PROVIDERS } from '../../constants';
import {
  DataConsumersValue,
  DataConsumersSortByValue,
  getChartData,
  getLegendData,
  getQueries,
} from '../../utils';
import { DataConsumptionDropdown } from './data-consumption-card-dropdown';
import { BarChartData } from './data-consumption-card-utils';
import './data-consumption-card.scss';

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

  const isLoading = _.values(result).some(_.isEmpty);

  if (!isLoading) {
    const metric = metricType === PROVIDERS ? 'type' : 'account';
    const curentDropdown = DataConsumersValue[metricType] + DataConsumersSortByValue[sortByKpi];
    switch (curentDropdown) {
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
        return [];
    }
    if (!chartData.some(_.isEmpty)) {
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
      <DashboardCardBody isLoading={isLoading}>
        {!_.some(chartData, _.isEmpty) ? (
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
