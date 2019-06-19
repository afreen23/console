import * as React from 'react';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardCardHelp,
} from '../../dashboard/dashboard-card';
import { ResourceProvidersRow } from '../../dashboard/resource-providers-card';
import { withDashboardResources } from '../with-dashboard-resources';

const providers = ['AWS S3', 'Azure Blob', 'Google Cloud Storage', 'Ceph', 'S3 Compatible' ];

//@TODO
const getStats = provider => {
  return 0;
};

//@TODO
const getProviderCount = provider => {
  return 0;
};

const mapProviderToProps = provider => {
  const result = {errorCount: 0, count: 0};
  result.count = getProviderCount(provider);
  const statusErrorCount = getStats(provider);
  if (statusErrorCount) {
    result.errorCount = statusErrorCount;
  }
  return result;
};

const ResourceProvidersBody = () => (
  <React.Fragment>
    {providers.map(provider => <ResourceProvidersRow key={provider} title={provider} {...mapProviderToProps(provider)} />)}
  </React.Fragment>
);


const ResourceProvidersCard_: React.FC<{}> = () => {
  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Resource Providers</DashboardCardTitle>
        <DashboardCardHelp>help for resource provider</DashboardCardHelp>
      </DashboardCardHeader>
      <DashboardCardBody>
        <ResourceProvidersBody />
      </DashboardCardBody>
    </DashboardCard>
  );
};


export const ResourceProvidersCard = withDashboardResources(ResourceProvidersCard_);
