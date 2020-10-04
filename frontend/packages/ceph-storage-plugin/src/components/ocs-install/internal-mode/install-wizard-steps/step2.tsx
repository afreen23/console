import * as React from 'react';
import { Form, FormGroup, Checkbox } from '@patternfly/react-core';
import { InternalClusterAction, InternalClusterState, ActionType } from '../reducer';

export const StepTwo: React.FC<StepTwoProps> = ({ state, dispatch }) => {
  return (
    <Form>
      <FormGroup fieldId="configure-encryption" label="Encryption" />
      <Checkbox
        id="configure-encryption"
        isChecked={state.enableEncryption}
        label="Enable Encryption"
        aria-label="Checkbox with description example"
        description="Data encryption for block and file storage. Object storage is always encrypted."
        onChange={(checked: boolean) =>
          dispatch({ type: ActionType.SET_ENABLE_ENCRYPTION, payload: checked })
        }
      />
    </Form>
  );
};

type StepTwoProps = {
  state: InternalClusterState;
  dispatch: React.Dispatch<InternalClusterAction>;
};
