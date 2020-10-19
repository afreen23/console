import * as React from 'react';
import * as _ from 'lodash';
import { match as RouterMatch } from 'react-router';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { Alert, Button } from '@patternfly/react-core';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { history, LoadingBox } from '@console/internal/components/utils';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { fetchK8s } from '@console/internal/graphql/client';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { LOCAL_STORAGE_NAMESPACE } from '@console/local-storage-operator-plugin/src/constants';
import { LSOSubscriptionResource } from '../../../constants/resources';
import { AttachedDevicesClusterWizard } from './install-wizard/install-wizard';
import './attached-devices.scss';

export const CreateAttachedDevicesCluster: React.FC<CreateAttachedDevicesClusterProps> = ({
  match,
}) => {
  const [subscription, subscriptionLoaded, subscriptionLoadError] = useK8sWatchResource<
    K8sResourceKind
  >(LSOSubscriptionResource);
  const [csvData, setCsvData] = React.useState({});
  const [csvLoading, setCsvLoading] = React.useState(true);

  React.useEffect(() => {
    if (subscriptionLoadError || (!subscription && subscriptionLoaded)) {
      setCsvLoading(false);
    } else if (subscriptionLoaded) {
      fetchK8s(
        ClusterServiceVersionModel,
        subscription?.status?.currentCSV,
        LOCAL_STORAGE_NAMESPACE,
      )
        .then((data) => {
          setCsvData(data);
          setCsvLoading(false);
        })
        .catch(() => {
          setCsvLoading(false);
        });
    }
  }, [subscription, subscriptionLoadError, subscriptionLoaded]);

  const goToLSOInstallationPage = () => {
    history.push(
      '/operatorhub/all-namespaces?details-item=local-storage-operator-redhat-operators-openshift-marketplace',
    );
  };

  const isLoading =
    (!subscriptionLoaded && !subscriptionLoadError) || (csvLoading && _.isEmpty(csvData));

  let body: React.ReactNode;

  if (isLoading) {
    body = <LoadingBox />;
  } else if (subscriptionLoadError || _.isEmpty(subscription) || _.isEmpty(csvData)) {
    body = (
      <Alert
        className="co-alert"
        variant="info"
        title="Local Storage Operator Not Installed"
        isInline
      >
        <div>
          Before we can create a storage cluster, the local storage operator needs to be installed
          in the <strong>{LOCAL_STORAGE_NAMESPACE}</strong>. When installation is finished come back
          to OpenShift Container Storage to create a storage cluster.
          <div className="ceph-ocs-install__lso-alert__button">
            <Button type="button" variant="primary" onClick={goToLSOInstallationPage}>
              Install
            </Button>
          </div>
        </div>
      </Alert>
    );
  } else {
    body = <AttachedDevicesClusterWizard match={match} />;
  }
  return <div className="co-m-pane__body">{body}</div>;
};

type CreateAttachedDevicesClusterProps = {
  match: RouterMatch<{ appName: string; ns: string }>;
};
