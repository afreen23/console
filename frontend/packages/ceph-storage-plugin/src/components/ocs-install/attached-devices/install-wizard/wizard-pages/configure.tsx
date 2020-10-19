import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { EncryptionFormGroup } from '../../../wizard-steps/configure';
import { State, Action } from '../state';

export const Configure: React.FC<StepTwoProps> = ({ state, dispatch }) => {
  const { enableEncryption } = state;

  return (
    <Form>
      <EncryptionFormGroup
        isChecked={enableEncryption}
        onChange={(checked: boolean) => dispatch({ type: 'setEncryption', value: checked })}
      />
    </Form>
  );
};

type StepTwoProps = {
  state: State;
  dispatch: React.Dispatch<Action>;
};
