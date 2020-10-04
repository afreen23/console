import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { InternalClusterAction, InternalClusterState, ActionType } from '../reducer';
import { EncryptionFormGroup } from '../../wizard-steps/configure';

export const StepTwo: React.FC<StepTwoProps> = ({ state, dispatch }) => {
  const { enableEncryption } = state;

  const toggleEncryption = (checked: boolean) =>
    dispatch({ type: ActionType.SET_ENABLE_ENCRYPTION, payload: checked });

  return (
    <Form>
      <EncryptionFormGroup isChecked={enableEncryption} onChange={toggleEncryption} />
    </Form>
  );
};

type StepTwoProps = {
  state: InternalClusterState;
  dispatch: React.Dispatch<InternalClusterAction>;
};
