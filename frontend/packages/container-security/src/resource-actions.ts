import { K8sKind, PodKind } from '@console/internal/module/k8s';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import { KebabOption } from '@console/internal/components/utils/kebab';
import { PodModel } from '@console/internal/models';
<<<<<<< HEAD:frontend/packages/container-security/src/resource-actions.ts
import { GetResourceActions } from '@console/plugin-sdk';
=======
import { GetKebabActions } from '@console/plugin-sdk';
>>>>>>> Migrate KebabActions extension:frontend/packages/container-security/src/kebab-actions.ts
import { ImageManifestVulnModel } from './models';

const listPathFor = (namespace: string, imageID: string) =>
  [
    '/k8s',
    namespace === '' ? 'all-namespaces' : `ns/${namespace}`,
    referenceForModel(ImageManifestVulnModel),
    `?name=sha256.${imageID.split('sha256:')[1]}`,
  ].join('/');

const ViewImageVulnerabilities = (model: K8sKind, obj: PodKind): KebabOption => {
  const ready = (obj.status?.containerStatuses || []).length > 0;

  return {
    label: 'View Image Vulnerabilities',
    hidden: !ready,
    href: ready ? listPathFor(obj.metadata.namespace, obj.status.containerStatuses[0].imageID) : '',
    accessReview: {
      group: ImageManifestVulnModel.apiGroup,
      resource: ImageManifestVulnModel.plural,
      namespace: obj.metadata.namespace,
      verb: 'list',
    },
  };
};

<<<<<<< HEAD:frontend/packages/container-security/src/resource-actions.ts
export const getResourceActions: GetResourceActions = (model) => {
=======
export const getKebabActions: GetKebabActions = (model) => {
>>>>>>> Migrate KebabActions extension:frontend/packages/container-security/src/kebab-actions.ts
  return model && (referenceForModel(model) === referenceForModel(PodModel) || model.kind === 'Pod')
    ? [ViewImageVulnerabilities]
    : [];
};
