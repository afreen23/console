import * as React from 'react';
import { TFunction } from 'i18next';
import { Form, FormGroup, FormSelect, FormSelectOption, Radio } from '@patternfly/react-core';
import { getName } from '@console/shared/src';
import { StorageClassDropdown } from '@console/internal/components/utils/storage-class-dropdown';
import { StorageClassResourceKind } from '@console/internal/module/k8s';
import { filterSCWithoutNoProv } from '../../../utils/install';
import './backing-storage.scss';

const RADIO = {
  EXISTING_SC: 'existing-storageClass',
  LOCAL_DEVICES_SC: 'local-devices-storageClass',
  EXTERNAL_SC: 'external-storageClass',
};

const RADIO_GROUP_NAME = 'backing-storage-current';

const StoragePlatformSelection: React.FC<{ t: TFunction }> = ({ t }) => {
  const options = [{ label: t('ceph-storage-plugin~Red Hat Ceph Storage'), value: 'rhcs' }];
  return (
    <FormGroup fieldId="storage-platform" label={t('ceph-storage-plugin~Storage Platform')}>
      <FormSelect
        id="storage-platform"
        value={t('ceph-storage-plugin~Red Hat Ceph Storage')}
        className="odf-backing-storage__selection--width"
      >
        {options.map((option) => (
          <FormSelectOption key={option.value} value={option.value} label={option.label} />
        ))}
      </FormSelect>
    </FormGroup>
  );
};

export const BackingStorage: React.FC<BackingStorageProps> = ({ t }) => {
  const [storageClass, setStorageClass] = React.useState<string>('');
  const [current, setCurrent] = React.useState<{}>('');

  const onRadioSelect = (_, event) => setCurrent(event.target.value);

  return (
    <Form>
      <Radio
        name={RADIO_GROUP_NAME}
        id={`bs-${RADIO.EXISTING_SC}`}
        value={RADIO.EXISTING_SC}
        isChecked={current === RADIO.EXISTING_SC}
        onChange={onRadioSelect}
        label={t('ceph-storage-plugin~Use an existing storage class')}
        description={t(
          'ceph-storage-plugin~Can be used on all platforms except BareMetal. OpenShift Data Foundation will use an infrastructure stoarge class provided by the hosting platform.',
        )}
        body={
          current === RADIO.EXISTING_SC && (
            <div className="odf-backing-storage__selection--width">
              <StorageClassDropdown
                onChange={(sc: StorageClassResourceKind) => setStorageClass(getName(sc))}
                noSelection
                selectedKey={storageClass}
                filter={filterSCWithoutNoProv}
                data-test="storage-class-dropdown"
              />
            </div>
          )
        }
      />
      <Radio
        name={RADIO_GROUP_NAME}
        id={`bs-${RADIO.LOCAL_DEVICES_SC}`}
        value={RADIO.LOCAL_DEVICES_SC}
        isChecked={current === RADIO.LOCAL_DEVICES_SC}
        onChange={onRadioSelect}
        label={t('ceph-storage-plugin~Create a new storage class using local devices')}
        description={t(
          'ceph-storage-plugin~Can be used on any platform having nodes with local devices. The infrastructure storage class is provided by Local Storage Operator on top of the local devices.',
        )}
      />
      <Radio
        name={RADIO_GROUP_NAME}
        id={`bs-${RADIO.EXTERNAL_SC}`}
        value={RADIO.EXTERNAL_SC}
        isChecked={current === RADIO.EXTERNAL_SC}
        onChange={onRadioSelect}
        label={t('ceph-storage-plugin~Create a new external storage class')}
        description={t(
          'ceph-storage-plugin~Can be used to connect an external storage platform to OpenShift Data Foundation.',
        )}
        body={current === RADIO.EXTERNAL_SC && <StoragePlatformSelection t={t} />}
      />
    </Form>
  );
};

type BackingStorageProps = {
  t: TFunction;
};
