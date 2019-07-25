export enum ObjectServiceQuery {
  NOOBAA_SYSTEM_NAME_QUERY = 'NOOBAA_SYSTEM_NAME_QUERY',
  BUCKETS_COUNT = 'BUCKETS_COUNT',
  BUCKET_OBJECTS_COUNT = 'BUCKET_OBJECTS_COUNT',
  BUCKET_CLAIMS_COUNT = 'BUCKET_CLAIMS_COUNT',
  BUCKET_CLAIMS_OBJECTS_COUNT = 'BUCKET_CLAIMS_OBJECTS_COUNT',
  UNHEALTHY_BUCKETS = 'UNHEALTHY_BUCKETS',
  UNHEALTHY_BUCKETS_CLAIMS = 'UNHEALTHY_BUCKETS_CLAIMS',
  PROVIDERS_TYPES = 'PROVIDERS_TYPES',
  UNHEALTHY_PROVIDERS_TYPES = 'UNHEALTHY_PROVIDERS_TYPES',
  POOLS_COUNT = 'POOLS_COUNT',
  UNHEALTHY_POOLS = 'UNHEALTHY_POOLS',
  ACCOUNTS_BY_IOPS = 'ACCOUNTS_BY_IOPS',
  ACCOUNTS_BY_LOGICAL_USAGE = 'ACCOUNTS_BY_LOGICAL_USAGE',
  PROVIDERS_BY_IOPS = 'PROVIDERS_BY_IOPS',
  PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE = 'PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE',
  PROVIDERS_BY_EGRESS = 'PROVIDERS_BY_EGRESS',
  REBUILD_PROGRESS_QUERY = 'REBUILD_PROGRESS_QUERY',
  REBUILD_TIME_QUERY = 'REBUILD_TIME_QUERY',
  PROJECT_QUERY = 'PROJECT_QUERY',
  BUCKET_CLASS_QUERY = 'BUCKET_CLASS_QUERY',
  EFFICIENCY_QUERY = 'EFFICIENCY_QUERY',
  SAVINGS_QUERY = 'SAVINGS_QUERY',
}

const objectServiceQueries = {
  [ObjectServiceQuery.NOOBAA_SYSTEM_NAME_QUERY]: 'NooBaa_system_info',
  [ObjectServiceQuery.BUCKETS_COUNT]: 'NooBaa_num_buckets',
  [ObjectServiceQuery.BUCKET_OBJECTS_COUNT]: 'NooBaa_num_objects',
  [ObjectServiceQuery.BUCKET_CLAIMS_COUNT]: 'NooBaa_num_buckets_claims',
  [ObjectServiceQuery.BUCKET_CLAIMS_OBJECTS_COUNT]: 'NooBaa_num_objects_buckets_claims',
  [ObjectServiceQuery.UNHEALTHY_BUCKETS]: 'NooBaa_num_unhealthy_buckets',
  [ObjectServiceQuery.UNHEALTHY_BUCKETS_CLAIMS]: 'NooBaa_num_unhealthy_bucket_claims',
  [ObjectServiceQuery.PROVIDERS_TYPES]: 'NooBaa_cloud_types',
  [ObjectServiceQuery.UNHEALTHY_PROVIDERS_TYPES]: 'NooBaa_unhealthy_cloud_types',
  [ObjectServiceQuery.POOLS_COUNT]: 'NooBaa_num_pools',
  [ObjectServiceQuery.UNHEALTHY_POOLS]: 'NooBaa_num_unhealthy_pools',
  [ObjectServiceQuery.ACCOUNTS_BY_IOPS]: 'NooBaa_accounts_io_usage',
  [ObjectServiceQuery.ACCOUNTS_BY_LOGICAL_USAGE]: 'NooBaa_accounts_io_usage',
  [ObjectServiceQuery.PROVIDERS_BY_IOPS]: 'NooBaa_providers_ops',
  [ObjectServiceQuery.PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE]: 'NooBaa_providers_physical_logical',
  [ObjectServiceQuery.PROVIDERS_BY_EGRESS]: 'NooBaa_providers_bandwidth',
  [ObjectServiceQuery.REBUILD_PROGRESS_QUERY]: 'NooBaa_rebuild_progress',
  [ObjectServiceQuery.REBUILD_TIME_QUERY]: 'NooBaa_rebuild_time',
  [ObjectServiceQuery.PROJECT_QUERY]: `sort(topk(6, NooBaa_projects_capacity_usage{project!='Others'}))`,
  [ObjectServiceQuery.BUCKET_CLASS_QUERY]: `sort(topk(6, NooBaa_bucket_class_capacity_usage{bucket_class!='Others'}))`,
  [ObjectServiceQuery.EFFICIENCY_QUERY]: 'NooBaa_reduction_ratio',
  [ObjectServiceQuery.SAVINGS_QUERY]: 'NooBaa_object_savings',
};

export const DetailsCardQueries = {
  [ObjectServiceQuery.NOOBAA_SYSTEM_NAME_QUERY]:
    objectServiceQueries[ObjectServiceQuery.NOOBAA_SYSTEM_NAME_QUERY],
};

export const BucketsCardQueries = {
  [ObjectServiceQuery.BUCKETS_COUNT]: objectServiceQueries[ObjectServiceQuery.BUCKETS_COUNT],
  [ObjectServiceQuery.BUCKET_OBJECTS_COUNT]:
    objectServiceQueries[ObjectServiceQuery.BUCKET_OBJECTS_COUNT],
  [ObjectServiceQuery.BUCKET_CLAIMS_COUNT]:
    objectServiceQueries[ObjectServiceQuery.BUCKET_CLAIMS_COUNT],
  [ObjectServiceQuery.BUCKET_CLAIMS_OBJECTS_COUNT]:
    objectServiceQueries[ObjectServiceQuery.BUCKET_CLAIMS_OBJECTS_COUNT],
  [ObjectServiceQuery.UNHEALTHY_BUCKETS]:
    objectServiceQueries[ObjectServiceQuery.UNHEALTHY_BUCKETS],
  [ObjectServiceQuery.UNHEALTHY_BUCKETS_CLAIMS]:
    objectServiceQueries[ObjectServiceQuery.UNHEALTHY_BUCKETS_CLAIMS],
};

export const ResourceProviderQueries = {
  [ObjectServiceQuery.PROVIDERS_TYPES]: objectServiceQueries[ObjectServiceQuery.PROVIDERS_TYPES],
  [ObjectServiceQuery.UNHEALTHY_PROVIDERS_TYPES]:
    objectServiceQueries[ObjectServiceQuery.UNHEALTHY_PROVIDERS_TYPES],
};

export const HealthCardQueries = {
  [ObjectServiceQuery.UNHEALTHY_BUCKETS]:
    objectServiceQueries[ObjectServiceQuery.UNHEALTHY_BUCKETS],
  [ObjectServiceQuery.BUCKETS_COUNT]: objectServiceQueries[ObjectServiceQuery.BUCKETS_COUNT],
  [ObjectServiceQuery.POOLS_COUNT]: objectServiceQueries[ObjectServiceQuery.POOLS_COUNT],
  [ObjectServiceQuery.UNHEALTHY_POOLS]: objectServiceQueries[ObjectServiceQuery.UNHEALTHY_POOLS],
};

export const DataConsumptionQueries = {
  [ObjectServiceQuery.ACCOUNTS_BY_IOPS]: objectServiceQueries[ObjectServiceQuery.ACCOUNTS_BY_IOPS],
  [ObjectServiceQuery.ACCOUNTS_BY_LOGICAL_USAGE]:
    objectServiceQueries[ObjectServiceQuery.ACCOUNTS_BY_LOGICAL_USAGE],
  [ObjectServiceQuery.PROVIDERS_BY_IOPS]:
    objectServiceQueries[ObjectServiceQuery.PROVIDERS_BY_IOPS],
  [ObjectServiceQuery.PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE]:
    objectServiceQueries[ObjectServiceQuery.PROVIDERS_BY_PHYSICAL_VS_LOGICAL_USAGE],
  [ObjectServiceQuery.PROVIDERS_BY_EGRESS]:
    objectServiceQueries[ObjectServiceQuery.PROVIDERS_BY_EGRESS],
};

export const DataResiliencyQueries = {
  [ObjectServiceQuery.REBUILD_PROGRESS_QUERY]:
    objectServiceQueries[ObjectServiceQuery.REBUILD_PROGRESS_QUERY],
  [ObjectServiceQuery.REBUILD_TIME_QUERY]:
    objectServiceQueries[ObjectServiceQuery.REBUILD_TIME_QUERY],
};

export const CapacityUsageQueries = {
  [ObjectServiceQuery.PROJECT_QUERY]: objectServiceQueries[ObjectServiceQuery.PROJECT_QUERY],
  [ObjectServiceQuery.BUCKET_CLASS_QUERY]:
    objectServiceQueries[ObjectServiceQuery.BUCKET_CLASS_QUERY],
};

export const ObjectDataReductionQueries = {
  [ObjectServiceQuery.EFFICIENCY_QUERY]: objectServiceQueries[ObjectServiceQuery.EFFICIENCY_QUERY],
  [ObjectServiceQuery.SAVINGS_QUERY]: objectServiceQueries[ObjectServiceQuery.SAVINGS_QUERY],
};
