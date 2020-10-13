import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { InternalClusterAction, InternalClusterState, ActionType } from '../reducer';
import { EncryptionSection } from 'packages/ceph-storage-plugin/src/components/storage-cluster-install/ocs-install';

export const StepTwo: React.FC<StepTwoProps> = ({ state, dispatch }) => {
  const handleEncryption = (checked: boolean) =>
    dispatch({ type: ActionType.SET_ENABLE_ENCRYPTION, payload: checked });

  return (
    <Form>
      <EncryptionSection isChecked={state.enableEncryption} onChange={handleEncryption} />
    </Form>
  );
};

type StepTwoProps = {
  state: InternalClusterState;
  dispatch: React.Dispatch<InternalClusterAction>;
};
