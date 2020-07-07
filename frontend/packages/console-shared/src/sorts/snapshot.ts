import { convertToBaseValue } from '@console/internal/components/utils';
import { K8sResourceKind } from '@console/internal/module/k8s';

export const snapshotSize = (snapshot: K8sResourceKind): number => {
  const size = snapshot?.status?.restoreSize;
  return size ? convertToBaseValue(size) : 0;
};
