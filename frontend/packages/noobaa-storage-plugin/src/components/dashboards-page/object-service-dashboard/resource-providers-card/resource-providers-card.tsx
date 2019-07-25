import * as React from 'react';
import * as _ from 'lodash';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardHelp,
  DashboardCardTitle,
} from '@console/internal/components/dashboard/dashboard-card';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { ResourceProviderQueries } from '../queries';
import { getMetric, getValue } from '../utils';
import { ResourceProvidersBody } from './resource-providers-card-body';
import { ResourceProvidersItem, ProviderType } from './resource-providers-card-item';
import './resource-providers-card.scss';

const filterProviders = (allProviders: ProviderType): string[] => {
  return _.keys(allProviders).filter((provider) => allProviders[provider] > 0);
};

const createProvidersList = (data: PrometheusResponse): ProviderType => {
  const providers = _.get(data, 'data.result', null);
  const providersList: ProviderType = {};
  if (_.isNil(providers)) return null;
  providers.forEach((provider) => {
    providersList[getMetric(provider, 'type')] = Number(getValue(provider));
  });
  return providersList;
};

const ResourceProviders: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  React.useEffect(() => {
    Object.keys(ResourceProviderQueries).forEach((key) =>
      watchPrometheus(ResourceProviderQueries[key]),
    );
    return () =>
      Object.keys(ResourceProviderQueries).forEach((key) =>
        stopWatchPrometheusQuery(ResourceProviderQueries[key]),
      );
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const providersTypesQueryResult = prometheusResults.getIn([
    ResourceProviderQueries.PROVIDERS_TYPES,
    'result',
  ]);
  const unhealthyProvidersTypesQueryResult = prometheusResults.getIn([
    ResourceProviderQueries.UNHEALTHY_PROVIDERS_TYPES,
    'result',
  ]);

  const allProviders = createProvidersList(providersTypesQueryResult);
  const unhealthyProviders = createProvidersList(unhealthyProvidersTypesQueryResult);

  const providerTypes = filterProviders(allProviders);

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Resource Providers</DashboardCardTitle>
        <DashboardCardHelp>
          A list of all MCG (Multi-cloud gateway) resources that are currently in use. Those
          resources are used to store data according to the buckets policies and can be a
          cloud-based resource or a bare metal resource.
        </DashboardCardHelp>
      </DashboardCardHeader>
      <DashboardCardBody>
        <ResourceProvidersBody
          isLoading={!(providersTypesQueryResult && unhealthyProvidersTypesQueryResult)}
          hasProviders={!_.isEmpty(allProviders) || !_.isNil(allProviders)}
        >
          {providerTypes.map((provider) => (
            <ResourceProvidersItem
              key={provider}
              title={provider}
              count={allProviders[provider]}
              unhealthyProviders={unhealthyProviders}
            />
          ))}
        </ResourceProvidersBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export const ResourceProvidersCard = withDashboardResources(ResourceProviders);
