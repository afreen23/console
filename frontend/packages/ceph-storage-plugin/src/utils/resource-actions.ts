import { PersistentVolumeClaimModel } from '@console/internal/models/index';
<<<<<<< HEAD:frontend/packages/ceph-storage-plugin/src/utils/resource-actions.ts
import { GetResourceActions } from '@console/plugin-sdk';
=======
import { GetKebabActions } from '@console/plugin-sdk';
>>>>>>> Migrate KebabActions extension:frontend/packages/ceph-storage-plugin/src/utils/kebab-actions.ts
import { ClonePVC } from './clone-workflow';
import { DeleteSnapshot } from './delete-snapshot-workflow';
import { RestorePVC } from './restore-pvc-workflow';
import { SnapshotPVC } from './snapshot-workflow';
import { VolumeSnapshotModel } from '../models';

<<<<<<< HEAD:frontend/packages/ceph-storage-plugin/src/utils/resource-actions.ts
export const getResourceActions: GetResourceActions = (resourceKind) => {
=======
export const getKebabActions: GetKebabActions = (resourceKind) => {
>>>>>>> Migrate KebabActions extension:frontend/packages/ceph-storage-plugin/src/utils/kebab-actions.ts
  if (resourceKind?.kind === PersistentVolumeClaimModel.kind) {
    return [SnapshotPVC, ClonePVC];
  }
  if (resourceKind?.kind === VolumeSnapshotModel.kind) {
    return [RestorePVC, DeleteSnapshot];
  }
  return [];
};
