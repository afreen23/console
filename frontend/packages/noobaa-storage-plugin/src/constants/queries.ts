export enum ObjectServiceDashboardQuery {
  ACCOUNTS_BY_IOPS = 'ACCOUNTS_BY_IOPS',
  ACCOUNTS_BY_LOGICAL_USAGE = 'ACCOUNTS_BY_LOGICAL_USAGE',
  PROVIDERS_BY_IOPS = 'PROVIDERS_BY_IOPS',
  PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE = 'PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE',
  PROVIDERS_BY_EGRESS = 'PROVIDERS_BY_EGRESS',
}

const enum MetricType {
  READ = 'read',
  WRITE = 'write',
  TOTAL_READ = 'total_read',
  TOTAL_WRITE = 'total_write',
  PHYSICAL_USAGE = 'physical_usage',
  LOGICAL_USAGE = 'logical_usage',
  TOTAL_PHYSICAL_USAGE = 'total_physical_usage',
  TOTAL_LOGICAL_USAGE = 'total_logical_usage',
  EGRESS = 'egress',
}

export const DATA_CONSUMPTION_QUERIES = {
  [ObjectServiceDashboardQuery.ACCOUNTS_BY_IOPS]: {
    [MetricType.READ]: 'sort(topk(6,NooBaa_accounts_usage_read_count)))',
    [MetricType.WRITE]: 'sort(topk(6,NooBaa_accounts_usage_write_count))',
    [MetricType.TOTAL_READ]: 'sum(NooBaa_accounts_usage_read_count)',
    [MetricType.TOTAL_WRITE]: 'sum(NooBaa_accounts_usage_write_count)',
  },
  [ObjectServiceDashboardQuery.ACCOUNTS_BY_LOGICAL_USAGE]: {
    [MetricType.LOGICAL_USAGE]: 'sort(topk(6,NooBaa_accounts_usage_logical))',
    [MetricType.TOTAL_LOGICAL_USAGE]: 'sum(NooBaa_accounts_usage_logical)',
  },
  [ObjectServiceDashboardQuery.PROVIDERS_BY_IOPS]: {
    [MetricType.READ]: 'sort(topk(6,NooBaa_providers_ops_read_num))',
    [MetricType.WRITE]: 'sort(topk(6,NooBaa_providers_ops_write_num))',
    [MetricType.TOTAL_READ]: 'sum(NooBaa_providers_ops_read_num)',
    [MetricType.TOTAL_WRITE]: 'sum(NooBaa_providers_ops_write_num)',
  },
  [ObjectServiceDashboardQuery.PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE]: {
    [MetricType.PHYSICAL_USAGE]: 'sort(topk(6,NooBaa_providers_physical_size))',
    [MetricType.LOGICAL_USAGE]: 'sort(topk(6,NooBaa_providers_logical_size))',
    [MetricType.TOTAL_PHYSICAL_USAGE]: 'sum(NooBaa_providers_physical_size)',
    [MetricType.TOTAL_LOGICAL_USAGE]: 'sum(NooBaa_providers_logical_size)',
  },
  [ObjectServiceDashboardQuery.PROVIDERS_BY_EGRESS]: {
    [MetricType.EGRESS]:
      'NooBaa_providers_bandwidth_read_size + NooBaa_providers_bandwidth_write_size',
  },
};
