import { ClonePVC } from './clone-workflow';
import { DeleteSnapshot } from './delete-snapshot-workflow';
import { K8sKind, K8sResourceKind } from '@console/internal/module/k8s';
import { KebabAction } from '@console/internal/components/utils';
import { PersistentVolumeClaimModel } from '@console/internal/models/index';
import { RestorePVC } from './restore-pvc-workflow';
import { SnapshotPVC } from './snapshot-workflow';
import { VolumeSnapshotModel } from '../models';
import { isCephStorageProvisioner } from '../selectors';

export const getKebabActionsForKind = (
  resourceKind: K8sKind,
  resource?: K8sResourceKind,
): KebabAction[] => {
  if (
    resourceKind?.kind === PersistentVolumeClaimModel.kind &&
    isCephStorageProvisioner(resource)
  ) {
    return [ClonePVC, SnapshotPVC];
  }
  if (resourceKind?.kind === VolumeSnapshotModel.kind) {
    return [RestorePVC, DeleteSnapshot];
  }
  return [];
};
