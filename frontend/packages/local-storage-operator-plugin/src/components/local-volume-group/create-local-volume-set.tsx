import * as React from 'react';
import { match as RouterMatch } from 'react-router';
import { resourcePathFromModel, BreadCrumbs } from '@console/internal/components/utils';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { LocalVolumeSetModel } from '../../models';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';

const CreateLocalVolumeSet: React.FC<CreateLocalVolumeSetProps> = ({ match }) => {
  const [volumeSetName, setVolumeSetName] = React.useState(null);
  const [storageClass, setStorageClass] = React.useState(null);

  const { ns, appName } = match.params;
  const name = LocalVolumeSetModel.label;

  return (
    <>
      <div className="co-create-operand__header">
        <div className="co-create-operand__header-buttons">
          <BreadCrumbs
            breadcrumbs={[
              {
                name,
                path: resourcePathFromModel(ClusterServiceVersionModel, appName, ns),
              },
              { name: `Create ${name}`, path: '' },
            ]}
          />
        </div>
        <h1 className="co-create-operand__header-text">{`Create ${name}`}</h1>
        <p className="help-block">
          A {name} allows you to filter a set of storage volumes, group them and create a dedicated
          storage class to consume storage for them.
        </p>
      </div>
      <Form>
        <FormGroup
          label="Volume Set Name"
          fieldId="simple-form-name"
          helperText="Please provide your full name"
        >
          <TextInput
            isRequired
            type="text"
            id="simple-form-name"
            name="simple-form-name"
            aria-describedby="simple-form-name-helper"
            value={volumeSetName}
            onChange={setVolumeSetName}
          />
        </FormGroup>
        <FormGroup
          label="Storage Class Name"
          fieldId="simple-form-name"
          helperText="Please provide your full name"
        >
          <TextInput
            isRequired
            type="text"
            id="simple-form-name"
            name="simple-form-name"
            aria-describedby="simple-form-name-helper"
            value={storageClass}
            onChange={setStorageClass}
          />
        </FormGroup>
      </Form>
    </>
  );
};

type CreateLocalVolumeSetProps = {
  match: RouterMatch<{ appName: string; ns: string }>;
};

export default CreateLocalVolumeSet;
