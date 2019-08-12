import * as React from 'react';
import * as _ from 'lodash';
import { match } from 'react-router';
import {
    K8sResourceKind,
    K8sKind,
    k8sGet,
    K8sResourceKindReference,
  } from '@console/internal/module/k8s';
import { ClusterServiceVersionModel } from '@console/internal/models';
import { ClusterServiceVersionKind } from '@console/internal/components/operator-lifecycle-manager/index';
import { BreadCrumbs } from '@console/internal/components/utils/index';
import { OCSServiceModel } from '../../models';
import { CreateOCSServiceForm } from './create-form';
import { CreateOCSServiceYAML } from './create-yaml';
import './ocs-install.scss';

export const CreateOCSService: React.FC<CreacteOCSServiceProps> = (props) => {
  const [sample, setSample] = React.useState(null);
  const [method, setMethod] = React.useState<'yaml' | 'form'>('form');
  const [clusterServiceVersion, setClusterServiceVersion] = React.useState(null);

  React.useEffect(() => {
    k8sGet(ClusterServiceVersionModel, props.match.params.appName, props.match.params.ns).then(
      (clusterServiceVersionObj) => {
        try {
          setSample(
            JSON.parse(_.get(clusterServiceVersionObj.metadata.annotations, 'alm-examples'))[0],
          );
          setClusterServiceVersion(clusterServiceVersionObj);
        } catch (e) {
          setClusterServiceVersion(null);
          return;
        }
      },
    );
  }, [props.match.params.appName, props.match.params.ns]);

  return (
      <React.Fragment>
        <div className="co-create-operand__header">
          <div className="co-create-operand__header-buttons">
            {clusterServiceVersion !== null && (
              <BreadCrumbs
                breadcrumbs={[
                  {
                    name: clusterServiceVersion.spec.displayName,
                    path: window.location.pathname.replace('/~new', ''),
                  },
                  { name: `Create ${OCSServiceModel.label}`, path: window.location.pathname },
                ]}
              />
            )}
          </div>
        </div>
        <div className="ceph-yaml__link">{method === 'form' && <button className="btn btn-link" onClick={() => setMethod('yaml')}>Edit YAML</button>}</div>
        {(method === 'form' && (
          <CreateOCSServiceForm
            namespace={props.match.params.ns}
            operandModel={OCSServiceModel}
            sample={sample}
            clusterServiceVersion={clusterServiceVersion !== null && clusterServiceVersion.metadata}
          />
        )) ||
          (method === 'yaml' && <CreateOCSServiceYAML match={props.match} sample={sample} />)}
      </React.Fragment>
    );
};

type CreacteOCSServiceProps = {
    match: match<{ appName: string; ns: string; plural: K8sResourceKindReference }>;
    operandModel: K8sKind;
    sample?: K8sResourceKind;
    namespace: string;
    loadError?: any;
    clusterServiceVersion: ClusterServiceVersionKind;
};
