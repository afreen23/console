import { PersistentVolumeClaimModel } from '@console/internal/models/index';
<<<<<<< HEAD:frontend/packages/ceph-storage-plugin/src/utils/resource-actions.ts
import { GetResourceActions } from '@console/plugin-sdk';
=======
import { GetKebabActions } from '@console/plugin-sdk';
<<<<<<< HEAD:frontend/packages/ceph-storage-plugin/src/utils/resource-actions.ts
>>>>>>> Migrate KebabActions extension:frontend/packages/ceph-storage-plugin/src/utils/kebab-actions.ts
=======
import { isCephProvisioner } from '@console/shared/src/utils/storage-utils';
>>>>>>> Added gating for ceph based PVCs:frontend/packages/ceph-storage-plugin/src/utils/kebab-actions.ts
import { ClonePVC } from './clone-workflow';
import { DeleteSnapshot } from './delete-snapshot-workflow';
import { RestorePVC } from './restore-pvc-workflow';
import { SnapshotPVC } from './snapshot-workflow';
import { VolumeSnapshotModel } from '../models';

<<<<<<< HEAD:frontend/packages/ceph-storage-plugin/src/utils/resource-actions.ts
<<<<<<< HEAD:frontend/packages/ceph-storage-plugin/src/utils/resource-actions.ts
export const getResourceActions: GetResourceActions = (resourceKind) => {
=======
export const getKebabActions: GetKebabActions = (resourceKind) => {
>>>>>>> Migrate KebabActions extension:frontend/packages/ceph-storage-plugin/src/utils/kebab-actions.ts
=======
export const getKebabActions: GetKebabActions = (resourceKind, resource) => {
>>>>>>> Added gating for ceph based PVCs:frontend/packages/ceph-storage-plugin/src/utils/kebab-actions.ts
  if (resourceKind?.kind === PersistentVolumeClaimModel.kind) {
    const provisioner: string =
      resource?.metadata?.annotations?.['volume.beta.kubernetes.io/storage-provisioner'];
    if (isCephProvisioner(provisioner)) return [SnapshotPVC, ClonePVC];
  }
  if (resourceKind?.kind === VolumeSnapshotModel.kind) {
    return [RestorePVC, DeleteSnapshot];
  }
  return [];
};
