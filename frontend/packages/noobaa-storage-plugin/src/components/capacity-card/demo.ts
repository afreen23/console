import {
    ACCOUNTS,
    BY_IOPS,
    BY_LOGICAL_USAGE,
    BY_PHYSICAL_VS_LOGICAL_USAGE,
    BY_EGRESS,
    PROVIDERS,
  } from '../../constants';
  
  // prettier-ignore
  export const bucketsDemoData = {
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
                  "bucket_class": "policy1",
                  "write_count": "100",
                  "type": "AWS"
              },
              "value": [1562769986.504, "132187468732"]
          }, {
              "metric": {
                  "__name__": "NooBaa_cloud_types",
                  "endpoint": "mgmt",
                  "instance": "10.131.0.17:8080",
                  "job": "noobaa-mgmt",
                  "namespace": "default",
                  "pod": "noobaa-server-0",
                  "service": "noobaa-mgmt",
                  "bucket_class": "policy2",
                  "write_count": "100",
                  "type": "Azure"
              },
              "value": [1562769986.504, "32173866576"]
          }, 
      }
  };

  // prettier-ignore
  export const projectsDemoData = {
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
                  "project": "Project 1",
                  "write_count": "100",
                  "account": "AWS"
              },
              "value": [1562769986.504, "524365752"]
          }, {
              "metric": {
                  "__name__": "NooBaa_cloud_types",
                  "endpoint": "mgmt",
                  "instance": "10.131.0.17:8080",
                  "job": "noobaa-mgmt",
                  "namespace": "default",
                  "pod": "noobaa-server-0",
                  "service": "noobaa-mgmt",
                  "project": "Project 2",
                  "write_count": "100",
                  "account": "Azure"
              },
              "value": [1562769986.504, "2381638712"]
          }, 
      }
  };

  export const demodata = {
    Projects: projectsDemoData,
    'Bucket Class': bucketsDemoData,
  };