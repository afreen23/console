import * as React from 'react';
import { match as RouterMatch } from 'react-router';
import { resourcePathFromModel, BreadCrumbs, Dropdown } from '@console/internal/components/utils';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { LocalVolumeSetModel } from '../../models';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  TextInput,
  Radio,
  Expandable,
  TextInputTypes,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import './create-local-volume-set.scss';

const volumeTypeOptions = Object.freeze({
  'SSD/NVMe': 'SSD / NVMe',
  HDD: 'HDD',
});
const volumeModeOptions = Object.freeze({
  Block: 'Block',
  Filesystem: 'Filesystem',
});
const volumeSizeUnitOptions = Object.freeze({
  TiB: 'TiB',
  GiB: 'GiB', // @TODO: check what unit backend expects
});

// @TODO: Should min and max be require field in advanced section ?

const CreateLocalVolumeSet: React.FC<CreateLocalVolumeSetProps> = ({ match }) => {
  const [volumeSetName, setVolumeSetName] = React.useState('');
  const [storageClassName, setStorageClassName] = React.useState('');
  const [showNodesSelection, setShowNodesSelection] = React.useState(false);
  const [volumeType, setVolumeType] = React.useState(volumeTypeOptions['SSD/NVMe']);
  const [volumeMode, setVolumeMode] = React.useState(volumeModeOptions.Block);
  const [minVolumeSize, setMinVolumeSize] = React.useState('0');
  const [maxVolumeSize, setMaxVolumeSize] = React.useState('');
  const [volumeSizeUnit, setVolumeSizeUnit] = React.useState(volumeSizeUnitOptions.TiB);
  const [maxVolumeLimit, setMaxVolumeLimit] = React.useState('');

  const { ns, appName } = match.params;
  const modelName = LocalVolumeSetModel.label;

  const toggleShowNodesSelection = () => {
    setShowNodesSelection(!showNodesSelection);
  };

  return (
    <>
      <div className="co-create-operand__header">
        <div className="co-create-operand__header-buttons">
          <BreadCrumbs
            breadcrumbs={[
              {
                name: 'Local Storage',
                path: resourcePathFromModel(ClusterServiceVersionModel, appName, ns),
              },
              { name: `Create ${modelName}`, path: '' },
            ]}
          />
        </div>
        <h1 className="co-create-operand__header-text">{`Create ${modelName}`}</h1>
        <p className="help-block">
          A {modelName} allows you to filter a set of storage volumes, group them and create a
          dedicated storage class to consume storage for them.
        </p>
      </div>
      <Form className="co-m-pane__body co-m-pane__form">
        <FormGroup label="Volume Set Name" isRequired fieldId="create-lvs--volume-set-name">
          <TextInput
            type={TextInputTypes.text}
            id="create-lvs--volume-set-name"
            value={volumeSetName}
            onChange={setVolumeSetName}
            isRequired
          />
        </FormGroup>
        <FormGroup label="Storage Class Name" fieldId="create-lvs--storage-class-name">
          <TextInput
            type={TextInputTypes.text}
            id="create-lvs--storage-class-name"
            value={storageClassName}
            onChange={setStorageClassName}
          />
        </FormGroup>
        <Text component={TextVariants.h3} className="lso-create-lvs__filter-volumes-text--margin">
          Filter Volumes
        </Text>
        <FormGroup label="Node Selector" fieldId="create-lvs--radio-group-node-selector">
          <div id="create-lvs--radio-group-node-selector">
            <Radio
              label="All nodes"
              name="nodes-selection"
              id="create-lvs--radio-all-nodes"
              value="allNodes"
              onChange={toggleShowNodesSelection}
              description="Selecting all nodes will search for available volume storage on all nodes."
              defaultChecked
              className="lso-create-lvs__all-nodes-radio--padding"
            />
            <Radio
              label="Select nodes"
              name="nodes-selection"
              id="create-lvs--radio-select-nodes"
              value="selectedNodes"
              onChange={toggleShowNodesSelection}
              description="Selecting nodes allow you to limit the search for available volumes to specific nodes."
            />
          </div>
        </FormGroup>
        {showNodesSelection && <div>I am shown</div>}
        <FormGroup label="Volume Type" fieldId="create-lvs--volume-type-dropdown">
          <Dropdown
            id="create-lvs--volume-type-dropdown"
            dropDownClassName="dropdown--full-width"
            items={volumeTypeOptions}
            title={volumeType}
            selectedKey={volumeType}
            onChange={setVolumeType}
          />
        </FormGroup>
        <Expandable toggleText="Advanced">
          <FormGroup label="Volume Mode" fieldId="create--lso-volume-mode-dropdown">
            <Dropdown
              id="create-lso--volume-mode-dropdown"
              dropDownClassName="dropdown--full-width"
              items={volumeModeOptions}
              title={volumeMode}
              selectedKey={volumeMode}
              onChange={setVolumeMode}
            />
          </FormGroup>
          <FormGroup
            label="Volume Size"
            fieldId="create-lvs--volume-size"
            className="lso-create-lvs__volume-size-form-group--margin"
          >
            <div
              id="create-lvs--volume-size"
              className="lso-create-lvs__volume-size-form-group--flex-box"
            >
              <FormGroup
                label="Min"
                fieldId="create-lvs--min-volume-size"
                className="lso-create-lvs__volume-size-form-group-max-min-input"
              >
                <TextInput
                  type={TextInputTypes.number}
                  id="create-lvs--min-volume-size"
                  value={minVolumeSize}
                  onChange={setMinVolumeSize}
                />
              </FormGroup>
              <div>-</div>
              <FormGroup
                label="Max"
                fieldId="create-lvs--max-volume-size"
                className="lso-create-lvs__volume-size-form-group-max-min-input"
              >
                <TextInput
                  type={TextInputTypes.number}
                  id="create-lvs--max-volume-size"
                  value={maxVolumeSize}
                  onChange={setMaxVolumeSize}
                />
              </FormGroup>
              <Dropdown
                id="create-lvs--volume-size-unit-dropdown"
                items={volumeSizeUnitOptions}
                title={volumeSizeUnit}
                selectedKey={volumeSizeUnit}
                onChange={setVolumeSizeUnit}
              />
            </div>
          </FormGroup>

          <FormGroup label="Max Volume Limit" fieldId="create-lvs--max-volume-limit">
            <p className="help-block lso-create-lvs__max-volume-limit-help-text--margin">
              Volume limit will set the maximum number of PVs to create on a node. If the field is
              empty, will create PVs for all available volumes on the matching nodes.
            </p>
            <TextInput
              type={TextInputTypes.number}
              id="create-lvs--max-volume-limit"
              value={maxVolumeLimit}
              onChange={setMaxVolumeLimit}
            />
          </FormGroup>
        </Expandable>
        <ActionGroup>
          <Button>Create</Button>
          <Button variant="secondary">Cancel</Button>
        </ActionGroup>
      </Form>
    </>
  );
};

type CreateLocalVolumeSetProps = {
  match: RouterMatch<{ appName: string; ns: string }>;
};

export default CreateLocalVolumeSet;
