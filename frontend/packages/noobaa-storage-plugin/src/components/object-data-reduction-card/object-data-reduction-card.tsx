import * as React from 'react';
import * as _ from 'lodash';

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
import { ObjectDataReductionItem } from './object-data-reduction-item';
import './object-data-reduction-card.scss';

const ObjectDataReductionQueries = {
  EFFICIENCY_QUERY: 'NooBaa_reduction_ratio',
  SAVINGS_QUERY: 'NooBaa_savings',
};

const DataReductionCard: React.FC<ObjectDataReductionCardProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  React.useEffect(() => {
    Object.keys(ObjectDataReductionQueries).forEach((key) =>
      watchPrometheus(ObjectDataReductionQueries[key]),
    );
    return () =>
      Object.keys(ObjectDataReductionQueries).forEach((key) =>
        stopWatchPrometheusQuery(ObjectDataReductionQueries[key]),
      );
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const efficiencyQueryResult = prometheusResults.getIn([
    ObjectDataReductionQueries.EFFICIENCY_QUERY,
    'result',
  ]);
  const savingsQueryResult = prometheusResults.getIn([
    ObjectDataReductionQueries.SAVINGS_QUERY,
    'result',
  ]);
  //   const efficiency = '3.8:1';
  //   const savings = '77.2Pi(74%)';
  const efficiency = _.get(efficiencyQueryResult, 'data.result.value[1]', null);
  const savings = _.get(savingsQueryResult, 'data.result.value[1]', null);

  return (
    <DashboardCard className="co-buckets-card">
      <DashboardCardHeader>
        <DashboardCardTitle>Object Data Reduction</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <ObjectDataReductionItem
          title="Effeciency Ratio"
          value={efficiency}
          infoText="Efficiency ratio refers to the deduplication and compression process effectiveness."
          isLoading={!efficiencyQueryResult}
        />
        <ObjectDataReductionItem
          title="Savings"
          value={savings}
          infoText="Savings shows the uncompressed and non-deduped data that would have been stored without those techniques."
          isLoading={!savingsQueryResult}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

type ObjectDataReductionCardProps = DashboardItemProps;

export const ObjectDataReductionCard = withDashboardResources(DataReductionCard);
