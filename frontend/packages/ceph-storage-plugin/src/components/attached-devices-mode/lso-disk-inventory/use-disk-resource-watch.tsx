import * as React from 'react';
// import * as _ from 'lodash';
import { usePrometheusPoll } from '@console/internal/components/graphs/prometheus-poll-hook';
import { PrometheusEndpoint } from '@console/internal/components/graphs/helpers';
import {
  osdDiskInfoMetric,
  DATA_RESILIENCY_QUERY,
  StorageDashboardQuery,
} from '@console/ceph-storage-plugin/src/constants/queries';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { TemplateInstanceModel } from '@console/internal/models';
import { CEPH_STORAGE_NAMESPACE, OSD_REMOVAL_TEMPLATE } from '../../../constants';
import { TemplateInstanceKind } from '@console/internal/module/k8s';
import { ActionType, OCSState, initialState, reducer } from './state-reducer';
import { PrometheusResult } from '@console/internal/components/graphs';

export const useOCStateWatch = (watch: boolean, nodeName: string) => {
  const [ocsState, dispatch] = React.useReducer(reducer, initialState);
  const [diskresponse] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    query: osdDiskInfoMetric({ nodeName }),
  });
  const [resiliencyResponse] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    query: DATA_RESILIENCY_QUERY[StorageDashboardQuery.RESILIENCY_PROGRESS],
  });

  const { diskOsdMap, replacingDisk } = ocsState;
  const templateName = `${OSD_REMOVAL_TEMPLATE}-${diskOsdMap[replacingDisk]?.osdName}`;

  const [templateData, templateLoaded, templateLoadError] = useK8sWatchResource<
    TemplateInstanceKind
  >({
    kind: TemplateInstanceModel.kind,
    name: templateName,
    namespace: CEPH_STORAGE_NAMESPACE,
  });

  if (watch) {
    const diskResults: PrometheusResult[] = diskresponse?.data?.result || [];
    const resiliencyResults: string = resiliencyResponse?.data.result?.[0]?.value[1];

    const isRebalancing: boolean = resiliencyResults !== '1';
    const newDiskOsdMap: OCSState['diskOsdMap'] = diskResults.reduce((map, { metric }) => {
      map[metric.device] = {
        osd: metric.ceph_daemon,
        status: ocsState.diskOsdMap[metric.device],
      };
      return map;
    }, {});

    dispatch({ type: ActionType.SET_IS_REBALANCED, payload: isRebalancing });
    dispatch({ type: ActionType.SET_DISK_OSD_MAP, payload: newDiskOsdMap });

    if (ocsState.replacingDisk && templateLoaded && !templateLoadError) {
      const status = templateData.status.conditions?.[0].type;
      switch (status) {
        case 'Not Ready':
          dispatch({
            type: ActionType.SET_OCS_DISK_STATUS,
            payload: { diskName: ocsState.replacingDisk, status: 'Preparing to replace' },
          });
          break;
        case 'Ready':
          dispatch({
            type: ActionType.SET_OCS_DISK_STATUS,
            payload: { diskName: ocsState.replacingDisk, status: 'Replacement Ready' },
          });
          dispatch({ type: ActionType.SET_IS_REPLACED_DISK, payload: '' });
          break;
        default:
          return '';
      }
    }
  }
  return [ocsState, dispatch];
};
