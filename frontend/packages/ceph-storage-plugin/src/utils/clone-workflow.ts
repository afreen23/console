import { KebabOption } from '@console/internal/components/utils';
import { K8sResourceKind, K8sKind } from '@console/internal/module/k8s';

export const ClonePVC = (kind: K8sKind, resource: K8sResourceKind): KebabOption => {
  return {
    label: 'Clone',
    callback: () => {
      const clusterObject = { resource };
      import(
        '../components/modals/clone-pvc-modal/clone-pvc-modal' /* webpackChunkName: "ceph-storage-clone-pvc-modal" */
      )
        .then((m) => m.default(clusterObject))
        .catch((e) => {
          throw e;
        });
    },
    accessReview: {
      group: kind.apiGroup,
      resource: kind.plural,
      name: resource.metadata.name,
      namespace: resource.metadata.namespace,
      verb: 'create',
    },
  };
};
