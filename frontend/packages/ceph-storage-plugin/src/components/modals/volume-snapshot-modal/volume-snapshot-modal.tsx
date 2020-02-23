import './_volume-snapshot-modal.scss';

import * as React from 'react';

import {
  Dropdown,
  Firehose,
  FirehoseResourcesResult,
  HandlePromiseProps,
  withHandlePromise,
} from '@console/internal/components/utils';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import {
  K8sResourceKind,
  K8sResourceKindReference,
  k8sCreate,
  k8sPatch,
} from '@console/internal/module/k8s';
import {
  ModalBody,
  ModalComponentProps,
  ModalSubmitFooter,
  ModalTitle,
  createModalLauncher,
} from '@console/internal/components/factory';
import { SnapshotScheduleModel, VolumeSnapshotModel } from '../../../models';
import { getName, getNamespace } from '@console/shared';

import { PersistentVolumeClaimModel } from '@console/internal/models';

export type VolumeSnapshotModalProps = {
  pvcData?: FirehoseResourcesResult;
} & HandlePromiseProps &
  ModalComponentProps;

export const VolumeSnapshotModal = withHandlePromise((props: VolumeSnapshotModalProps) => {
  const { close, cancel, pvcData, errorMessage, inProgress, handlePromise } = props;
  const resource = pvcData.data as K8sResourceKind;
  const [snapshotCount, setSnapshotCount] = React.useState(3);
  const [snapshotName, setSnapshotName] = React.useState(
    `${getName(resource) || 'pvc'}-snapshot-1`,
  );
  const [scheduleLabel, setScheduleLabel] = React.useState('');
  const snapshotTypes = {
    SingleSnapshot: 'SingleSnapshot',
    CronJob: 'CronJob',
  };
  const selectedKey = snapshotTypes.SingleSnapshot;
  const [scheduleType, setScheduleType] = React.useState('');

  const setSchedulerHandler = (value) => {
    setScheduleType(snapshotTypes[value]);
  };

  const getCronElements = () => {
    const numberOfSnapshot = {
      '3': '3',
      '5': '5',
      '7': '7',
    };
    const initialCountKey = numberOfSnapshot['3'];
    const setSchedulerCountHandler = (value) => {
      setSnapshotCount(parseInt(value, 10));
    };
    return (
      <div>
        <FormGroup className="ceph-volume-snapshot-modal--input" fieldId="snapshot-modal__schedule">
          <label className="pf-c-form__label" htmlFor="snapshot-modal__schedule">
            <span className="pf-c-form__label-text">Label</span>
            <a
              className="ceph-volume-snapshot-modal--link"
              href="https://en.wikipedia.org/wiki/Cron#Overview"
            >
              Whats this?
            </a>
          </label>
          <TextInput
            isRequired
            type="text"
            name="snapshot-modal__schedule"
            aria-label="snapshot-modal__schedule"
            value={scheduleLabel}
            onChange={(value) => setScheduleLabel(value)}
            className="ceph-volume-snapshot-modal--label"
            placeholder="**5***"
          />
          <span className="help-block">* Scheduled for UTC+3</span>
        </FormGroup>
        <FormGroup
          className="ceph-volume-snapshot-modal--input"
          label="Keep"
          fieldId="snapshot-modal__count"
        >
          <div className="ceph-volume-snapshot-modal--input_keep">
            <Dropdown
              items={numberOfSnapshot}
              selectedKey={initialCountKey}
              onChange={(value) => setSchedulerCountHandler(value)}
              className="ceph-volume-snapshot-modal--count"
            />
            <span className="ceph-volume-snapshot-modal--span_keep">last snapshots</span>
          </div>
        </FormGroup>
        <span className="help-block">*Older snapshots will be deleted automatically</span>
      </div>
    );
  };

  const makeSchedule = (scheduleTemplate: K8sResourceKind) => {
    handlePromise(k8sCreate(SnapshotScheduleModel, scheduleTemplate))
      .then(close)
      .catch((error) => {
        throw error;
      });
  };
  const submit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const ns = getNamespace(resource);
    const pvcName = getName(resource);
    if (scheduleType === 'CronJob') {
      const pvcLabel = Math.random()
        .toString(36)
        .slice(2);
      const scheduleTemplate: K8sResourceKind = {
        apiVersion: `${SnapshotScheduleModel.apiGroup}/${SnapshotScheduleModel.apiVersion}`,
        kind: SnapshotScheduleModel.kind,
        metadata: {
          name: snapshotName,
          namespace: ns,
        },
        spec: {
          claimSelector: {
            matchLabels: {
              thislabel: `schedule-${pvcLabel}`,
            },
          },
          disabled: false,
          retention: {
            maxCount: snapshotCount,
          },
          schedule: scheduleLabel,
          snapshotTemplate: {
            snapshotClassName: 'csi-hostpath-snapclass',
            // TBF - https://github.com/backube/snapscheduler/issues/80
          },
        },
      };
      const patch = [
        {
          op: 'add',
          path: '/metadata/labels/thislabel',
          value: `schedule-${pvcLabel}`,
        },
      ];
      handlePromise(k8sPatch(PersistentVolumeClaimModel, resource, patch))
        .then(() => {
          makeSchedule(scheduleTemplate);
        })
        .catch((error) => {
          throw error;
        });
    }
    const snapshotTemplate: K8sResourceKind = {
      apiVersion: VolumeSnapshotModel.apiVersion,
      kind: VolumeSnapshotModel.kind,
      metadata: {
        name: snapshotName,
        namespace: ns,
      },
      spec: {
        source: {
          persistentVolumeClaimName: pvcName,
        },
      },
    };
    handlePromise(k8sCreate(VolumeSnapshotModel, snapshotTemplate))
      .then(close)
      .catch((error) => {
        throw error;
      });
  };

  return (
    <Form onSubmit={submit}>
      <div className="modal-content modal-content--no-inner-scroll">
        <ModalTitle>Create Snapshot</ModalTitle>
        <ModalBody>
          <p>Creating snapshot for {getName(resource)}</p>
          <FormGroup
            className="ceph-volume-snapshot-modal--input"
            label="Name"
            isRequired
            fieldId="snapshot-name"
          >
            <TextInput
              isRequired
              type="text"
              name="snapshot-name"
              aria-label="snapshot-name"
              value={snapshotName}
              onChange={setSnapshotName}
            />
          </FormGroup>
          <FormGroup
            className="ceph-volume-snapshot-modal--input"
            label="Schedule"
            fieldId="snapshot-modal__schedule-type"
          >
            <Dropdown
              dropDownClassName="dropdown--full-width"
              items={snapshotTypes}
              selectedKey={selectedKey}
              onChange={(value) => setSchedulerHandler(value)}
            />
            <div className="co-form-subsection">
              {scheduleType === 'CronJob' ? getCronElements() : null}
            </div>
          </FormGroup>
        </ModalBody>
        <ModalSubmitFooter
          inProgress={inProgress}
          errorMessage={errorMessage}
          submitText="Create"
          cancel={cancel}
        />
      </div>
    </Form>
  );
});

type VolumeSnapshotModalWithFireHoseProps = {
  name: string;
  namespace: string;
  kind: K8sResourceKindReference;
  pvcData?: FirehoseResourcesResult;
  resource?: K8sResourceKind;
} & ModalComponentProps;

const VolumeSnapshotModalWithFireHose: React.FC<VolumeSnapshotModalWithFireHoseProps> = (props) => (
  <Firehose
    resources={[
      {
        kind: props.kind || PersistentVolumeClaimModel.kind,
        prop: 'pvcData',
        namespace: props?.resource?.metadata?.namespace || props.namespace,
        isList: false,
        name: props?.resource?.metadata?.name || props.name,
      },
    ]}
  >
    <VolumeSnapshotModal {...props} />
  </Firehose>
);

export const volumeSnapshotModal = createModalLauncher(VolumeSnapshotModalWithFireHose);
