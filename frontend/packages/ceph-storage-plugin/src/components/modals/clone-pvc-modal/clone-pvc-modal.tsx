import * as React from 'react';
import * as _ from 'lodash';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import {
  convertToBaseValue,
  humanizeBinaryBytes,
  ResourceIcon,
  withHandlePromise,
} from '@console/internal/components/utils/index';
import {
  createModalLauncher,
  ModalBody,
  ModalSubmitFooter,
  ModalTitle,
} from '@console/internal/components/factory';
import { k8sCreate, K8sResourceKind } from '@console/internal/module/k8s';
import { PersistentVolumeClaimModel } from '@console/internal/models/index';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import { HandlePromiseProps } from '@console/internal/components/utils/promise-component';
import { PrometheusRulesResponse } from '@console/internal/components/monitoring';
import { getPVCUsedCapacityQuery } from '../../../constants/queries';

import './_clone-pvc-modal.scss';

const accessModeRadios = {
  ReadWriteOnce: 'Single User (RWO)',
  ReadWriteMany: 'Shared Access (RWX)',
  ReadOnlyMany: 'Read Only (ROX)',
};

export const ClonePVCModal = withHandlePromise((props: ClonePVCModalProps) => {
  const {
    close,
    cancel,
    resource,
    watchPrometheus,
    stopWatchPrometheusQuery,
    prometheusResults,
    handlePromise,
  } = props;
  const pvcName: string = _.get(resource, 'metadata.name');
  const [buttonDisabled, setButton] = React.useState(false);
  const [inProgress, setProgress] = React.useState(false);
  const [errorMessage, setError] = React.useState('');
  const [clonePVCName, setClonePVCName] = React.useState(`${pvcName}-clone`);

  const query: string = getPVCUsedCapacityQuery(pvcName);

  React.useEffect(() => {
    watchPrometheus(query);
    return () => stopWatchPrometheusQuery(query);
  }, [watchPrometheus, stopWatchPrometheusQuery, query]);

  const results = prometheusResults.getIn([query, 'data']) as PrometheusRulesResponse;
  const pvcUsedCapacity: string = _.get(results, 'data.result[0].value[1]');
  const queriesLoadError = prometheusResults.getIn([query, 'loadError']);

  const submit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    setProgress(true);

    const pvcCloneObj = {
      apiVersion: 'v1',
      kind: PersistentVolumeClaimModel.kind,
      metadata: {
        name: clonePVCName,
        namespace: _.get(resource, 'metadata.namespace'),
      },
      spec: {
        storageClassName: _.get(resource, 'spec.storageClassName'),
        dataSource: {
          name: pvcName,
          kind: 'PersistentVolumeClaim',
          apiGroup: '',
        },
        accessModes: _.get(resource, 'spec.accessModes'),
        resources: {
          requests: {
            storage: _.get(resource, 'spec.resources.requests.storage'),
          },
        },
      },
    };

    handlePromise(k8sCreate(PersistentVolumeClaimModel, pvcCloneObj))
      .then(() => {
        setProgress(false);
        close();
      })
      .catch((error) => {
        setError(error);
        setProgress(false);
        setButton(true);
        throw error;
      });
  };

  const updateClonePVCName = (value: string) => {
    setClonePVCName(value);
  };

  return (
    <Form onSubmit={submit}>
      <div className="modal-content modal-content--no-inner-scroll">
        <ModalTitle>Clone</ModalTitle>
        <ModalBody>
          <FormGroup
            label="Name"
            isRequired
            fieldId="clone-pvc-modal__name"
            className="co-required"
          >
            <TextInput
              isRequired
              type="text"
              id="clone-pvc-modal__name"
              name="clone-pvc-modal__name"
              value={clonePVCName}
              onChange={updateClonePVCName}
            />
          </FormGroup>
          <div className="clone-pvc-modal__details-section">
            <p className="text-muted clone-pvc-modal__pvc-details">PVC Details</p>
            <div className="clone-pvc-modal__details">
              <div>
                <div>
                  <p className="clone-pvc-modal__pvc-details">Namespace</p>
                  <p>
                    <ResourceIcon kind="Namespace" />
                    {resource.metadata.namespace}
                  </p>
                </div>
                <div>
                  <p className="clone-pvc-modal__pvc-details">Storage Class</p>
                  <p>
                    <ResourceIcon kind="StorageClass" />
                    {resource.spec.storageClassName}
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <p className="clone-pvc-modal__pvc-details">Requested Capacity</p>
                  <p>
                    {
                      humanizeBinaryBytes(
                        convertToBaseValue(resource.spec.resources.requests.storage),
                      ).string
                    }
                  </p>
                </div>
                <div>
                  <p className="clone-pvc-modal__pvc-details">Used Capacity</p>
                  <p>{!queriesLoadError && humanizeBinaryBytes(pvcUsedCapacity).string}</p>
                </div>
              </div>
              <div>
                <div>
                  <p className="clone-pvc-modal__pvc-details">Access Mode</p>
                  <p>{accessModeRadios[resource.spec.accessModes]}</p>
                </div>
                <div>
                  <p className="clone-pvc-modal__pvc-details">Volume Mode</p>
                  <p>{resource.spec.volumeMode}</p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalSubmitFooter
          inProgress={inProgress}
          errorMessage={errorMessage}
          submitText="Clone"
          cancel={cancel}
          submitDisabled={buttonDisabled}
        />
      </div>
    </Form>
  );
});

export type ClonePVCModalProps = {
  kind?: any;
  cancel?: () => void;
  close?: () => void;
  resource?: K8sResourceKind;
} & DashboardItemProps &
  HandlePromiseProps;

export default createModalLauncher(withDashboardResources(ClonePVCModal));
