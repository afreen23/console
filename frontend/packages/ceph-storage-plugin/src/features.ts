import { k8sGet, K8sResourceKind } from '@console/internal/module/k8s';
import { setFlag, handleError } from '@console/internal/actions/features';
import { ActionFeatureFlagDetector } from '@console/plugin-sdk';
import { SubscriptionModel } from '@console/operator-lifecycle-manager';
import { OCSServiceModel } from './models';

export const OCS_INDEPENDENT_FLAG = 'OCS_INDEPENDENT';

const isIndependent = (data: K8sResourceKind): boolean => !!data.spec?.external;

export const detectIndependentMode: ActionFeatureFlagDetector = (dispatch) =>
  k8sGet(OCSServiceModel, 'ocs-storagecluster', 'openshift-storage').then(
    (obj: K8sResourceKind) => dispatch(setFlag(OCS_INDEPENDENT_FLAG, isIndependent(obj))),
    (err) => {
      err?.response?.status === 404
        ? dispatch(setFlag(OCS_INDEPENDENT_FLAG, false))
        : handleError(err, OCS_INDEPENDENT_FLAG, dispatch, detectIndependentMode);
    },
  );

export const OCS_VERSION_4_2_FLAG = 'OCS_VERSION_4_2';

export const isOCS42Version = (subscription: K8sResourceKind): boolean => {
  const version = subscription?.status?.currentCSV;
  debugger;
  return version.includes('ocs-operator.v4.2');
};

export const detectOCSVersion43: ActionFeatureFlagDetector = (dispatch) =>
  k8sGet(SubscriptionModel, 'ocs-subscription', 'openshift-storage').then(
    (obj: K8sResourceKind) => dispatch(setFlag(OCS_VERSION_4_2_FLAG, isOCS42Version(obj))),
    (err) => {
      err?.response?.status === 404
        ? dispatch(setFlag(OCS_VERSION_4_2_FLAG, false))
        : handleError(err, OCS_VERSION_4_2_FLAG, dispatch, isOCS42Version);
    },
  );
