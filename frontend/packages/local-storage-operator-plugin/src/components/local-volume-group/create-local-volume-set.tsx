import * as React from 'react';
import { match as RouterMatch } from 'react-router';
import { resourcePathFromModel, BreadCrumbs } from '@console/internal/components/utils';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { LocalVolumeSetModel } from '../../models';
import {
  Form,
  FormGroup,
  TextInput,
  Radio,
  Expandable,
  TextInputTypes,
} from '@patternfly/react-core';

const CreateLocalVolumeSet: React.FC<CreateLocalVolumeSetProps> = ({ match }) => {
  const [volumeSetName, setVolumeSetName] = React.useState('');
  const [storageClass, setStorageClass] = React.useState('');
  const [showNodesSelection, setShowNodesSelection] = React.useState(false);
  const [volumeType, setVolumeType] = React.useState('');
  const [maxVolumeLimit, setMaxVolumeLimit] = React.useState('');

  const { ns, appName } = match.params;
  const name = LocalVolumeSetModel.label;

  const handleSelection = () => {
    setShowNodesSelection(!showNodesSelection);
  };

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
      <Form className="co-m-pane__body co-m-pane__form">
        <FormGroup label="Volume Set Name" isRequired fieldId="create-lvs-volume-set-name">
          <TextInput
            type={TextInputTypes.text}
            id="create-lvs-volume-set-name"
            value={volumeSetName}
            onChange={setVolumeSetName}
            isRequired
          />
        </FormGroup>
        <FormGroup label="Storage Class Name" fieldId="create-lvs-storage-class-name">
          <TextInput
            type={TextInputTypes.text}
            id="create-lvs-storage-class-name"
            value={storageClass}
            onChange={setStorageClass}
          />
        </FormGroup>
        <p>Filter Volumes</p>
        <FormGroup label="Node Selector" fieldId="create-lvs-radio-group-node-selector">
          <div id="create-lvs-radio-group-node-selector">
            <Radio
              label="All nodes"
              name="nodes-selection"
              id="create-lvs-radio-all-nodes"
              value="allNodes"
              onChange={handleSelection}
              description="Selecting all nodes will search for available volume storage on all nodes."
              defaultChecked
            />
            <Radio
              label="Select nodes"
              name="nodes-selection"
              id="create-lvs-radio-select-nodes"
              value="selectedNodes"
              onChange={handleSelection}
              description="Selecting nodes allow you to limit the search for available volumes to specific nodes."
            />
          </div>
          {showNodesSelection && <div>I am shown</div>}
        </FormGroup>
        <FormGroup label="Volume Type" fieldId="create-lvs-volume-type">
          <TextInput
            isRequired
            type={TextInputTypes.text}
            id="create-lvs-volume-type"
            value={volumeType}
            onChange={setVolumeType}
          />
        </FormGroup>
        <Expandable toggleText="Advanced">
          <p>Volume Mode</p>
          {/* Add dropdown blokc/file */}
          <p>Volume Size</p>
          {/* two inputs min and max and units dropdown */}
          <FormGroup
            label="Max Volume Limit"
            fieldId="create-lvs-max-volume-limit"
            helperText="Volume limit will set the max number of PVs to create on a node. If the field is empty we will create PVs for all available volumes on the matching nodes."
          >
            <TextInput
              type={TextInputTypes.number}
              id="create-lvs-max-volume-limit"
              value={maxVolumeLimit}
              onChange={setMaxVolumeLimit}
            />
          </FormGroup>
        </Expandable>
      </Form>
    </>
  );
};

type CreateLocalVolumeSetProps = {
  match: RouterMatch<{ appName: string; ns: string }>;
};

export default CreateLocalVolumeSet;
