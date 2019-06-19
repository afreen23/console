import * as React from 'react';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '../../dashboard/dashboard-card';
import { ObjectDataReductionItem } from '../../dashboard/object-data-reduction-card';
import { withDashboardResources } from '../with-dashboard-resources';

const ObjectDataReductionBody = ({efficiency, savings}) => (
  <React.Fragment>
    <ObjectDataReductionItem title="Effeciency Ratio" count={efficiency} />
    <ObjectDataReductionItem title="Savings" count={savings} />
  </React.Fragment>
);

const ObjectDataReductionCard_: React.FC<{}> = () => {
  const efficiency = '3.8:1';
  const savings = '77.2Pi(74%)';
  return (
    <DashboardCard className="co-buckets-card">
      <DashboardCardHeader>
        <DashboardCardTitle>Object Data reduction</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <ObjectDataReductionBody efficiency={efficiency} savings={savings} />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export const ObjectDataReductionCard = withDashboardResources(ObjectDataReductionCard_);
