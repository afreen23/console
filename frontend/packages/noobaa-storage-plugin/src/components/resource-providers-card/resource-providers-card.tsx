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
import { ResourceProviderItems } from './resource-providers-card-body';
import './resource-providers-card.scss';

const RESOURCE_PROVIDERS_QUERY = {
  PROVIDERS_TYPES: ' NooBaa_providers_types',
  UNHEALTHY_PROVIDERS_TYPES: 'NooBaa_unhealthy_providers_types',
};

const getProviderType = (provider) => _.get(provider, 'metric.type', null);
const getProviderCount = (provider) => Number(_.get(provider, 'value[1]', null));

const createProvidersList = (data) => {
  const providers = _.get(data, 'data.result', null);
  const providersList: providerType = {};
  if (_.isNil(providers)) return null;
  providers.forEach((provider) => {
    providersList[getProviderType(provider)] = getProviderCount(provider);
  });
  return providersList;
};

const ResourceProviders: React.FC<ResourceProvidersCardProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  React.useEffect(() => {
    watchPrometheus(RESOURCE_PROVIDERS_QUERY.PROVIDERS_TYPES);
    watchPrometheus(RESOURCE_PROVIDERS_QUERY.UNHEALTHY_PROVIDERS_TYPES);
    return () => {
      stopWatchPrometheusQuery(RESOURCE_PROVIDERS_QUERY.PROVIDERS_TYPES);
      stopWatchPrometheusQuery(RESOURCE_PROVIDERS_QUERY.UNHEALTHY_PROVIDERS_TYPES);
    };
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const providersTypesQueryResult = prometheusResults.getIn([
    RESOURCE_PROVIDERS_QUERY.PROVIDERS_TYPES,
    'result',
  ]);
  const unhealthyProvidersTypesQueryResult = prometheusResults.getIn([
    RESOURCE_PROVIDERS_QUERY.UNHEALTHY_PROVIDERS_TYPES,
    'result',
  ]);

  const providersTypes = createProvidersList(providersTypesQueryResult);
  const unhealthyProvidersTypes = createProvidersList(unhealthyProvidersTypesQueryResult);

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Resource Providers</DashboardCardTitle>
        <DashboardCardHelp>help for resource provider</DashboardCardHelp>
        {/* TODO: replace info text */}
      </DashboardCardHeader>
      <DashboardCardBody>
        <ResourceProviderItems
          allProviders={providersTypes}
          unhealthyProviders={unhealthyProvidersTypes}
          isLoading={!(providersTypesQueryResult && unhealthyProvidersTypesQueryResult)}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

type ResourceProvidersCardProps = DashboardItemProps;

type providerType = {
  [key: string]: number;
};

export const ResourceProvidersCard = withDashboardResources(ResourceProviders);
