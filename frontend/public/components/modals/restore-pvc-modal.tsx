import * as React from 'react';
import * as _ from 'lodash';

import {
    Dropdown,
    ResourceIcon,
    withHandlePromise,
} from '@console/internal/components/utils/index';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import { K8sKind, K8sResourceKind, k8sCreate } from '@console/internal/module/k8s';
import {
    ModalBody,
    ModalComponentProps,
    ModalSubmitFooter,
    ModalTitle,
    createModalLauncher,
} from '@console/internal/components/factory';

export const RestorePVCModal = withHandlePromise((props: RestorePVCModalProps) => {
    const { resource, close, cancel } = props;
    const [buttonDisabled, setButton] = React.useState(false);
    const [inProgress, setProgress] = React.useState(false);
    const [errorMessage, setError] = React.useState('');
    const [restorePVCName, setPVCName] = React.useState(`${_.get(resource, 'metadata.name')}-restore`);

    const onValueChange = (value: string) => {
        setPVCName(value);
    };

    const submit = (event: React.FormEvent<EventTarget>) => {
        event.preventDefault();
        setProgress(true);
        // const snapshotTemplate: K8sResourceKind = {
        //     apiVersion: 'snapshot.storage.k8s.io/v1alpha1',
        //     kind: 'VolumeSnapshot',
        //     metadata: {
        //         name: `${snapshotName}`,
        //         namespace: `${_.get(props.resource, 'metadata.namespace')}`,
        //     },
        //     spec: {
        //         snapshotClassName: 'csi-hostpath-snapclass', // to be checked
        //         source: {
        //             name: `${_.get(props.resource, 'metadata.name')}`,
        //             kind: 'PersistentVolumeClaim'
        //         }
        //     },
        // };
        // props
        //     .handlePromise(k8sCreate(VolumeSnapshotModel, snapshotTemplate))
        //     .then(() => {
        //         setProgress(false);
        //         close();

        //     })
        //     .catch((error) => {
        //         setError(error.message);
        //         setProgress(false);
        //         setButton(true);
        //         throw error;
        //     });
    };

    return (
        <Form onSubmit={submit}>
            <div className="modal-content modal-content--no-inner-scroll">
                <ModalTitle>Retore</ModalTitle>
                <ModalBody>
                    <p>After restore action is finished, a new PVC will be created </p>
                    <FormGroup label="Name" isRequired fieldId="restore-pvc-modal__name">
                        <TextInput
                            isRequired
                            type="text"
                            id="restore-pvc-modal__name"
                            name="restore-pvc-modal__name"
                            value={restorePVCName}
                            onChange={onValueChange}
                        />
                    </FormGroup>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <p>Date</p>
                                    <p>
                                        sfsafasf
                                    </p>
                                </div>
                                <div>
                                    <p>Status</p>
                                    <p>
                                        Ready
                                    </p>
                                </div>
                                <div>
                                    <p>Size</p>
                                    <p>
                                        65 GiB
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Namespace</p>
                                    <p>
                                        <ResourceIcon kind="Namespace" />
                                        default
                                    </p>
                                </div>
                                <div>
                                    <p>API Version</p>
                                    <p>
                                        fsfss
                                    </p>
                                </div>
                                <div>
                                    <p>Persistent Volume</p>
                                    <ResourceIcon kind="PersistentVolume" />

                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalSubmitFooter
                    inProgress={inProgress}
                    errorMessage={errorMessage}
                    submitText="Restore"
                    cancel={cancel}
                    submitDisabled={buttonDisabled}
                />
            </div>
        </Form>
    );
});

export type RestorePVCModalProps = {
    resource?: K8sResourceKind;
    kind?: K8sKind;
    handlePromise?: <T>(promise: Promise<T>) => Promise<T>;
    cancel?: () => void;
    close?: () => void;
};

type Props = RestorePVCModalProps & ModalComponentProps;


export const restorePVCModal = createModalLauncher<Props>(RestorePVCModal);
