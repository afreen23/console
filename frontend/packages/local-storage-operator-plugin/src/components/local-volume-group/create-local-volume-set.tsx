import * as React from 'react';
import { match as RouterMatch } from 'react-router';
import { resourcePathFromModel, BreadCrumbs } from '@console/internal/components/utils';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { LocalVolumeSetModel } from '../../models';
import { Form, FormGroup, TextInput, Radio } from '@patternfly/react-core';

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
        <FormGroup label="Volume Set Name" isRequired fieldId="volume-set-name">
          <TextInput
            isRequired
            type="text"
            id="volume-set-name" // @TODO: why this
            name="volume set name" // @TODO: why this
            aria-describedby="volume set name" // @TODO: why this
            value={volumeSetName}
            onChange={setVolumeSetName}
          />
        </FormGroup>
        <FormGroup label="Storage Class Name" fieldId="storage-class-name">
          <TextInput
            isRequired
            type="text"
            id="storage-class-name"
            name="storage class name"
            aria-describedby="storage class name"
            value={storageClass}
            onChange={setStorageClass}
          />
        </FormGroup>
      </Form>
      <p>Filter Volumes</p>
      <Radio
        isChecked={this.state.check1}
        name="radio-1"
        onChange={this.handleChange}
        label="Controlled radio"
        id="radio-controlled"
        value="All nodes"
        description="Selecting all nodes will search for available volume storage on all nodes."
      />
      <Radio
        isChecked={this.state.check1}
        name="radio-1"
        onChange={this.handleChange}
        label="Controlled radio"
        id="radio-controlled"
        value="Select nodes"
        description="Selecting nodes allow you to limit the search for available volumes to specific nodes."
      />
    </>
  );
};

type CreateLocalVolumeSetProps = {
  match: RouterMatch<{ appName: string; ns: string }>;
};

export default CreateLocalVolumeSet;
