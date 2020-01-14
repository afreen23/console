import * as React from 'react';
import * as _ from 'lodash';

import {
    Dropdown,
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

import { VolumeSnapshotModel } from '../../models';

export const SnapshotModal = withHandlePromise((props: SnapshotModalProps) => {
    const { close, cancel } = props;
    const [buttonDisabled, setButton] = React.useState(false);
    const [inProgress, setProgress] = React.useState(false);
    const [errorMessage, setError] = React.useState('');
    const [snapshotName, setName] = React.useState(`${_.get(props.resource, 'metadata.name') + '-snapshot 1'}`);
    const snapshotTypes = {
        single: 'Single Snapshot'
    };

    // const [selectedVersion, setSnapshotType] = React.useState(snapshotTypes.single)

    // const handleTypeChange = (obj) => {
    //     setSnapshotType(obj.value);
    // }
    const onValueChange = (value: string) => {
        setName(value);
    };

    const submit = (event: React.FormEvent<EventTarget>) => {
        event.preventDefault();
        setProgress(true);
        const snapshotTemplate: K8sResourceKind = {
            apiVersion: 'snapshot.storage.k8s.io/v1alpha1',
            kind: 'VolumeSnapshot',
            metadata: {
                name: `${snapshotName}`,
                namespace: `${_.get(props.resource, 'metadata.namespace')}`,
            },
            spec: {
                snapshotClassName: 'csi-hostpath-snapclass', // to be checked
                source: {
                    name: `${_.get(props.resource, 'metadata.name')}`,
                    kind: 'PersistentVolumeClaim'
                }
            },
        };
        props
            .handlePromise(k8sCreate(VolumeSnapshotModel, snapshotTemplate))
            .then(() => {
                setProgress(false);
                close();

            })
            .catch((error) => {
                setError(error.message);
                setProgress(false);
                setButton(true);
                throw error;
            });
    };

    return (
        <Form onSubmit={submit}>
            <div className="modal-content modal-content--no-inner-scroll">
                <ModalTitle>Create Snapshot</ModalTitle>
                <ModalBody>
                    <FormGroup label="Name" isRequired fieldId="snapshot-modal__name">
                        <TextInput
                            isRequired
                            type="text"
                            id="snapshot-modal__name"
                            name="snapshot-modal__name"
                            value={snapshotName}
                            onChange={onValueChange}
                        />
                    </FormGroup>

                    <div className="form-group">
                        <label>Schedule</label>
                        <Dropdown
                            className="co-input__dropdown-width"
                            items={snapshotTypes}
                            //onChange={handleTypeChange}
                            selectedKey={snapshotTypes.single}
                        />
                    </div>
                </ModalBody>
                <ModalSubmitFooter
                    inProgress={inProgress}
                    errorMessage={errorMessage}
                    submitText="Create"
                    cancel={cancel}
                    submitDisabled={buttonDisabled}
                />
            </div>
        </Form>
    );
});

export type SnapshotModalProps = {
    resource?: K8sResourceKind;
    kind?: K8sKind;
    handlePromise?: <T>(promise: Promise<T>) => Promise<T>;
    cancel?: () => void;
    close?: () => void;
};

type Props = SnapshotModalProps & ModalComponentProps;


export const snapshotModal = createModalLauncher<Props>(SnapshotModal);
