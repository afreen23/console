import * as React from 'react';

import { Dashboard, DashboardGrid } from '../../dashboard';
import { HealthCard } from './health-card';
import { DetailsCard } from './details-card';
import { ResourceProvidersCard } from './resource-providers-card';
import { BucketsCard } from './buckets-card';
import { ObjectDataReductionCard } from './object-data-reduction-card';

export const ObjectServicesDashboard: React.FC<{}> = () => {
  const mainCards = [
    <HealthCard key="health" />,
  ];

  const leftCards = [
    <DetailsCard key="details" />,
    <BucketsCard key="buckets" />,
    <ResourceProvidersCard key="providers" />,
  ];

  const rightCards = [
    <ObjectDataReductionCard key="data-reduction" />,
  ]

  return (
    <Dashboard>
      <DashboardGrid mainCards={mainCards} leftCards={leftCards} rightCards={rightCards} />
    </Dashboard>
  );
};
