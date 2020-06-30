import { FirehoseResource } from '@console/internal/components/utils/index';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import { PersistentVolumeModel } from '@console/internal/models';
import { WatchK8sResource } from '@console/internal/components/utils/k8s-watch-hook';
import { CephClusterModel, CephBlockPoolModel } from '../models';

export const cephClusterResource: FirehoseResource = {
  kind: referenceForModel(CephClusterModel),
  namespaced: false,
  isList: true,
  prop: 'ceph',
};

export const pvResource: WatchK8sResource = {
  kind: PersistentVolumeModel.kind,
  namespaced: false,
  isList: true,
};

export const cephBlockPoolResource: FirehoseResource = {
  kind: referenceForModel(CephBlockPoolModel),
  namespaced: false,
  isList: true,
  prop: 'pool',
};
