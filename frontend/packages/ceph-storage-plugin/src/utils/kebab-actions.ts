import { ClonePVC } from './clone-workflow';
import { DeleteSnapshot } from './delete-snapshot-workflow';
import { K8sKind, K8sResourceKind } from '@console/internal/module/k8s';
import { KebabAction } from '@console/internal/components/utils';
import { PersistentVolumeClaimModel } from '@console/internal/models/index';
import { RestorePVC } from './restore-pvc-workflow';
import { SnapshotPVC } from './snapshot-workflow';
import { VolumeSnapshotModel } from '../models';
import { isCephStorageProvisioner } from '../selectors';

export const getKebabActionsForKind = (resource: K8sKind | K8sResourceKind): KebabAction[] => {
  if (resource?.kind === PersistentVolumeClaimModel.kind && isCephStorageProvisioner(resource)) {
    return [SnapshotPVC, ClonePVC];
  }
  if (resource?.kind === VolumeSnapshotModel.kind) {
    return [RestorePVC, DeleteSnapshot];
  }
  return [];
};
