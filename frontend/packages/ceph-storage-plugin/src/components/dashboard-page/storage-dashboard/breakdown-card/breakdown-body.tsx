import * as React from 'react';
import { Grid, GridItem, EmptyState, Title, EmptyStateVariant } from '@patternfly/react-core';
import { Humanize } from '@console/internal/components/utils';
import { K8sKind } from '@console/internal/module/k8s';
import { TotalCapacityBody } from './breakdown-capacity';
import { BreakdownChartLoading } from './breakdown-loading';
import { BreakdownChart } from './breakdown-chart';
import { addAvailable, getCapacityValue, StackDataPoint } from './utils';

export const BreakdownCardBody: React.FC<BreakdownBodyProps> = ({
  top5MetricsStats,
  metricTotal,
  cephUsed,
  cephTotal,
  metricModel,
  formatValue,
  isLoading,
}) => {
  if (isLoading) {
    return <BreakdownChartLoading />;
  }
  if (!cephUsed || !cephTotal || !metricTotal || !top5MetricsStats.length) {
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

  const chartData = addAvailable(top5MetricsStats, cephTotal, cephUsed, metricTotal, formatValue);

  const legends = chartData.map((d: StackDataPoint) => ({
    name: [d.name, d.label],
    symbol: { size: 3, padding: 0 }, // To be removed
    labels: { fill: d.color, padding: 0 },
    link: d.link,
  }));

  legends.pop(); // Removes Legend for available

  return (
    <Grid>
      <GridItem span={4}>
        <TotalCapacityBody value={usedCapacity} />
      </GridItem>
      <GridItem span={4} />
      <GridItem span={4}>
        <TotalCapacityBody
          value={availableCapacity}
          classname="ceph-breakdown-card__available-body text-secondary"
        />
      </GridItem>
      <GridItem span={12}>
        <BreakdownChart data={chartData} legends={legends} metricModel={metricModel} />
      </GridItem>
    </Grid>
  );
};

type BreakdownBodyProps = {
  isLoading: boolean;
  metricTotal: string;
  top5MetricsStats: StackDataPoint[];
  cephUsed: string;
  cephTotal: string;
  metricModel: K8sKind;
  formatValue: Humanize;
};
