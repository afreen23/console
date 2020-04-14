import * as _ from 'lodash';
import { NodeKind, Taint } from '@console/internal/module/k8s';
import { ocsTaint } from '../constants/ocs-install';
import { humanizeBinaryBytes, convertToBaseValue } from '@console/internal/components/utils';

export const hasTaints = (node: NodeKind) => {
  return !_.isEmpty(node.spec?.taints);
};

export const hasOCSTaint = (node: NodeKind) => {
<<<<<<< HEAD
  const taints: Taint[] = node.spec?.taints || [];
=======
  const taints: Taint[] = node.spec.taints || [];
>>>>>>> Refactored Node Selection Page for OCS Installation Flow
  return taints.some((taint: Taint) => _.isEqual(taint, ocsTaint));
};

export const getConvertedUnits = (value: string) => {
  return humanizeBinaryBytes(convertToBaseValue(value)).string ?? '-';
};
