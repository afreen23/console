import * as React from 'react';
import { match } from 'react-router';
import { k8sGet, TemplateKind, k8sCreate } from '@console/internal/module/k8s';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { BreadCrumbs } from '@console/internal/components/utils';
import { Radio, Title, Button } from '@patternfly/react-core';
import { checkForIndependentSupport } from '../independent-mode/utils';
import { OCSServiceModel } from '../../models';
import InstallExternalCluster from '../independent-mode/install';
import { CreateOCSServiceForm } from './create-form';
import './install-page.scss';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { TemplateModel, JobModel } from '@console/internal/models';

enum MODES {
  CONVERGED = 'Converged',
  INDEPENDENT = 'Independent',
}

const templateResource = {
  kind: TemplateModel.kind,
  name: 'ocs-osd-removal',
  namespace: 'openshift-storage',
};

// eslint-disable-next-line no-shadow
const InstallCluster: React.FC<InstallClusterProps> = ({ match }) => {
  const {
    params: { ns, appName },
    url,
  } = match;

  const [isIndependent, setIsIndependent] = React.useState(false);
  const [mode, setMode] = React.useState(MODES.CONVERGED);
  const [clusterServiceVersion, setClusterServiceVersion] = React.useState(null);
  const [data, loaded, loadError] = useK8sWatchResource<TemplateKind>(templateResource);

  console.log(data);

  const templateTrigger = () => {
    const objects = data?.objects;
    k8sCreate(JobModel.kind, objects);
  };

  const handleModeChange = (_checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setMode(value as MODES);
  };

  React.useEffect(() => {
    k8sGet(ClusterServiceVersionModel, appName, ns)
      .then((clusterServiceVersionObj) => {
        setIsIndependent(checkForIndependentSupport(clusterServiceVersionObj));
        try {
          setClusterServiceVersion(clusterServiceVersionObj);
        } catch (e) {
          setClusterServiceVersion(null);
        }
      })
      .catch(() => setClusterServiceVersion(null));
  }, [appName, ns]);

  return (
    <>
      <div className="co-create-operand__header">
        <div className="co-create-operand__header-buttons">
          {clusterServiceVersion !== null && (
            <BreadCrumbs
              breadcrumbs={[
                {
                  name: clusterServiceVersion.spec.displayName,
                  path: url.replace('/~new', ''),
                },
                { name: `Create ${OCSServiceModel.label}`, path: url },
              ]}
            />
          )}
        </div>
        <h1 className="co-create-operand__header-text">Create Storage Cluster</h1>
        <p className="help-block">
          OCS runs as a cloud-native service for optimal integration with applications in need of
          storage, and handles the scenes such as provisioning and management.
        </p>
      </div>

      <div className="co-m-pane__body co-m-pane__form">
        {isIndependent && (
          <div className="ceph-install__select-mode">
            <Title headingLevel="h5" size="lg" className="ceph-install-select-mode__title">
              Select Mode
            </Title>
            <div className="ceph-install-select-mode">
              <Radio
                value={MODES.CONVERGED}
                isChecked={mode === MODES.CONVERGED}
                onChange={handleModeChange}
                id="radio-1"
                label="Converged"
                name="converged-mode"
              />
            </div>
            <div className="ceph-install-select-mode">
              <Radio
                value={MODES.INDEPENDENT}
                isChecked={mode === MODES.INDEPENDENT}
                onChange={handleModeChange}
                id="radio-2"
                label="Independent - For external storage"
                name="independent-mode"
              />
            </div>
          </div>
        )}
        {(isIndependent === false || mode === MODES.CONVERGED) && (
          <CreateOCSServiceForm match={match} />
        )}
        {mode === MODES.INDEPENDENT && <InstallExternalCluster match={match} />}
        <Button onSubmit={templateTrigger}>Trigger Template</Button>
      </div>
    </>
  );
};

export default InstallCluster;

type InstallClusterProps = {
  match: match<{ ns: string; appName: string }>;
};
