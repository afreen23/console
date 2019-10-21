import * as React from 'react';
import { Grid, GridItem, EmptyState, Title, EmptyStateVariant } from '@patternfly/react-core';
import { humanizeBinaryBytesWithoutB, Humanize } from '@console/internal/components/utils';
import { DataPoint } from '@console/internal/components/graphs';
import { K8sKind } from '@console/internal/module/k8s';
import { TotalCapacityBody } from './breakdown-capacity';
import { BreakdownChartLoading } from './breakdown-loading';
import { BreakdownChart } from './breakdown-chart';
import { getCapacityValue } from './utils';

const getTotal = (stats: DataPoint[]) => {
  return stats.reduce((total, dataPoint) => total + dataPoint.y, 0);
};

const addOthers = (stats: DataPoint[], totalUsed, formatValue) => {
  const top5Total = getTotal(stats);
  const others = totalUsed - top5Total;
  const othersData = {
    x: '',
    y: others,
    label: formatValue(others).string, // need to check if its safe
  };
  return othersData;
};

const addAvailable = (stats: DataPoint[], total, used, totalUsed, formatValue) => {
  const availableInBytes = Number(total) - Number(used) - 3095310657888;
  let other: {};
  if (stats.length === 5) {
    other = addOthers(stats, totalUsed, formatValue)
  }
  const availableData = {
    x: '',
    y: availableInBytes,
    label: 'Available\n' + formatValue(availableInBytes).string, // need to check if its safe

  };
  return other ? [...stats, other, availableData] : [...stats, availableData];
};

export const BreakdownCardBody: React.FC<BreakdownBodyProps> = ({
  top5UsedStats,
  totalUsed,
  cephUsed,
  cephTotal,
  model,
  formatValue,
  isLoading,
}) => {
  if (isLoading) {
    return <BreakdownChartLoading />;
  }
  if (!cephUsed || !cephTotal || !totalUsed || !top5UsedStats.length) {
    return (
      <EmptyState variant={EmptyStateVariant.full}>
        <Title className="graph-empty-state__title text-secondary" size="sm">
          Not available.
        </Title>
      </EmptyState>
    );
  }

  const available = getCapacityValue(cephUsed, cephTotal, formatValue);
  const usedCapacity = `${formatValue(cephUsed).string} used of ${formatValue(cephTotal).string}`;
  const availableCapacity = `${available.string} available`;

  const chartData = addAvailable(top5UsedStats, cephTotal, cephUsed, totalUsed, formatValue);
  const legends: LegendType = chartData.map((d: DataPoint) => ({
    name: d.label,
    value: d.y,
  })) as LegendType;

  legends.pop(); // Removes Legend for available

  return (
    <Grid>
      <GridItem span={4}>
        <TotalCapacityBody value={usedCapacity} />
      </GridItem>
      <GridItem span={4} />
      <GridItem span={4}>
        <TotalCapacityBody value={availableCapacity} classname='ceph-capacity-breakdown-card__available-body text-secondary' />
      </GridItem>
      <GridItem span={12}>
        <BreakdownChart data={chartData} legends={legends} model={model} />
      </GridItem>
    </Grid>
  );
};

type BreakdownBodyProps = {
  isLoading: boolean;
  totalUsed: string;
  top5UsedStats: DataPoint[];
  cephUsed: string;
  cephTotal: string;
  model: K8sKind;
  formatValue: Humanize;
};

type LegendType = {
  name: string;
  value: number;
  namespace?: string;
}[];
