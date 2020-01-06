import { K8sResourceKindReference } from '@console/internal/module/k8s';
import { Extension } from './extension';

namespace ExtensionProperties {
  export interface OCSKebabActions {
    /** the kind this action is for */
    kind: K8sResourceKindReference;
    /** label of action */
    label: string;
    /** API group of the resource */
    apiGroup: string;
    /** action callback */
    callback: (kind: K8sResourceKindReference, obj: any) => () => any;
  }
}

export interface OCSKebabActions extends Extension<ExtensionProperties.OCSKebabActions> {
  type: 'OCSKebabActions';
}

export const isOCSKebabActions = (e: Extension): e is OCSKebabActions =>
  e.type === 'OCSKebabActions';
