import * as React from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import {
  Chart,
  ChartAxis,
  ChartStack,
  ChartThemeColor,
  ChartLegend,
  ChartBar,
  ChartLabel,
  ChartTooltip,
} from '@patternfly/react-charts';
import { DataPoint } from '@console/internal/components/graphs';
import { K8sKind } from '@console/internal/module/k8s';
import { resourcePathFromModel } from '@console/internal/components/utils';
import './breakdown-card.scss';

const getBarRadius = (index: number, length: number) => {
  if (index === 0) {
    return { bottom: 3 };
  }
  if (index === length - 1) {
    return { top: 3 };
  }
  return {};
};

const getBarColor = (index: number, length: number) => {
  if (index === length - 1) {
    return { data: { stroke: 'white', strokeWidth: 0.7, fill: '#b8bbbe' } };
  }
  return { data: { stroke: 'white', strokeWidth: 0.7 } };
};

const LinkableLegend = (props) => {
  const { model, datum } = props;
  return (
    <>
      <Link
        to={resourcePathFromModel(model, datum.link)}
        target="_blank"
        className="ceph-breakdown-chart__legend-link"
      >
        <ChartLabel
          {...props}
          labelPlacement="vertical"
          lineHeight={1.3}
          size={3}
          style={[
            { ...datum.labels, fontSize: 8, padding: 0 },
            { fill: 'black', fontSize: 8, padding: 0 },
          ]}
        />
      </Link>
    </>
  );
};

export const BreakdownChart: React.FC<BreakdownChartProps> = ({ data, legends, model }) => {
  const chartData = data.map((d: DataPoint, index) => (
    <ChartBar
      style={getBarColor(index, data.length)}
      cornerRadius={getBarRadius(index, data.length)}
      barWidth={20}
      padding={10}
      data={[d]}
      labelComponent={
        <ChartTooltip constrainToVisibleArea style={{ fontSize: 8 }} pointerOrientation="left" />
      }
    />
  ));

  return (
    <Chart
      legendPosition="bottom-left"
      legendComponent={
        <ChartLegend
          themeColor={ChartThemeColor.purple}
          data={legends}
          labelComponent={<LinkableLegend model={model} />}
          orientation="horizontal"
          symbolSpacer={7}
          height={30}
          gutter={10}
          // padding={{ top: 0, bottom: 0 }}
          style={{ padding: { top: 0, bottom: 0, left: 0, right: 0 } }}
        />
      }
      height={100}
      padding={{
        bottom: 75,
        left: 30,
        right: 30,
        top: 30,
      }}
      themeColor={ChartThemeColor.multiOrdered}
    >
      <ChartAxis
        style={{ axis: { stroke: 'none' }, ticks: { stroke: 'none' } }}
        tickFormat={() => ''}
      />
      <ChartStack horizontal>{chartData}</ChartStack>
    </Chart>
  );
};

type BreakdownChartProps = {
  data: DataPoint[];
  legends: any;
  model: K8sKind;
};
