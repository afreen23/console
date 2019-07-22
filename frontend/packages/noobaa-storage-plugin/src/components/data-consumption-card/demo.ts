import {
  ACCOUNTS,
  BY_IOPS,
  BY_LOGICAL_USAGE,
  BY_PHYSICAL_VS_LOGICAL_USAGE,
  BY_EGRESS,
  PROVIDERS,
} from '../../constants';

// prettier-ignore
export const providersQueryDemoData = {
    "status": "success",
    "data": {
        "resultType": "vector",
        "result": [{
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "type": "AWS"
            },
            "value": [1562769986.504, "1"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "type": "Azure"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "type": "GCP"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "type": "S3_Compatible"
            },
            "value": [1562769986.504, "0"]
        }]
    }
};

// prettier-ignore
export const providerEgressQuery = {
    "status": "success",
    "data": {
        "resultType": "vector",
        "result": [{
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "type": "AWS"
            },
            "value": [1562769986.504, "1"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "type": "Azure"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "type": "GCP"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "type": "S3_Compatible"
            },
            "value": [1562769986.504, "0"]
        }]
    }
};
// prettier-ignore
export const providerPhyLogQuery = {
    "status": "success",
    "data": {
        "resultType": "vector",
        "result": [{
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "physical_size": 120,
                "logical_size": 100,
                "type": "AWS"
            },
            "value": [1562769986.504, "1"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "physical_size": 120,
                "logical_size": 100,
                "type": "Azure"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "physical_size": 120,
                "logical_size": 100,
                "type": "GCP"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "physical_size": 120,
                "logical_size": 100,
                "type": "S3_Compatible"
            },
            "value": [1562769986.504, "0"]
        }]
    }
};
// prettier-ignore
export const accountsQueryDemoData = {
    "status": "success",
    "data": {
        "resultType": "vector",
        "result": [{
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "account": "AWS"
            },
            "value": [1562769986.504, "1"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "account": "Azure"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "account": "GCP"
            },
            "value": [1562769986.504, "0"]
        }, {
            "metric": {
                "__name__": "NooBaa_cloud_types",
                "endpoint": "mgmt",
                "instance": "10.131.0.17:8080",
                "job": "noobaa-mgmt",
                "namespace": "default",
                "pod": "noobaa-server-0",
                "service": "noobaa-mgmt",
                "read_count": "120",
                "write_count": "100",
                "account": "S3_Compatible"
            },
            "value": [1562769986.504, "0"]
        }]
    }
};
// prettier-ignore
export const queryData = {
    [ACCOUNTS]: {
        [BY_IOPS]: accountsQueryDemoData,
        [BY_LOGICAL_USAGE]: accountsQueryDemoData,
    },
    [PROVIDERS]: {
        [BY_IOPS]: providersQueryDemoData,
        [BY_PHYSICAL_VS_LOGICAL_USAGE]: providerPhyLogQuery,
        [BY_EGRESS]: providerEgressQuery,
    },
};
