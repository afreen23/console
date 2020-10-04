import * as React from 'react';
import * as _ from 'lodash';
import {
  Grid,
  GridItem,
  Form,
  FormGroup,
  Text,
  TextVariants,
  TextContent,
  Label,
} from '@patternfly/react-core';
import { FieldLevelHelp, pluralize, humanizeBinaryBytes } from '@console/internal/components/utils';
import { StorageClassResourceKind, NodeKind } from '@console/internal/module/k8s';
import { StorageClassDropdown } from '@console/internal/components/utils/storage-class-dropdown';
import { cephStorageProvisioners, objectStorageProvisioners } from '@console/shared';
import { ListPage } from '@console/internal/components/factory';
import { NodeModel } from '@console/internal/models';
import { storageClassTooltip, requestedCapacityTooltip } from '../../../../constants';
import { OSDSizeDropdown, TotalCapacityText } from '../../../../utils/osd-size-dropdown';
import { InternalClusterState, InternalClusterAction, ActionType } from '../reducer';
import { getNodeInfo, shouldDeployAsMinimal } from '../../../../utils/install';
import { Validation, VALIDATIONS } from '../../../../utils/common-ocs-install-el';
import InternalNodeTable from '../../node-list';

const ocsProvisioners = [...cephStorageProvisioners, ...objectStorageProvisioners];

const isNotOcsSC = (sc: StorageClassResourceKind) =>
  !ocsProvisioners.some((provisioner: string) => _.endsWith(sc?.provisioner, provisioner));

const SelectNodesText: React.FC<{}> = () => (
  <TextContent>
    <Text>
      Select at least 3 nodes, preferably in 3 different zones. It is recommended to start with at
      least 14 CPUs and 34 GiB per node.
    </Text>
    <Text>
      The selected nodes will be labeled with &nbsp;
      <Label color="blue">cluster.ocs.openshift.io/openshift-storage=&quot;&quot;</Label>
      &nbsp;(unless they are already labeled). 3 of the selected nodes will be used for initial
      deployment. The remaining nodes will be used by OpenShift as scheduling targets for OCS
      scaling.
    </Text>
  </TextContent>
);

export const StepOne: React.FC<StepOneProps> = ({ state, dispatch }) => {
  const { nodes: selectedNodes, capacity: selectedCapacity, enableMinimal } = state;
  const { cpu, memory, zone } = getNodeInfo(selectedNodes);
  const nodesCount = selectedNodes.length;
  const { MINIMAL } = VALIDATIONS;

  React.useEffect(() => {
    const isMinimal = shouldDeployAsMinimal(cpu, memory, nodesCount);
    dispatch({ type: ActionType.SET_ENABLE_MINIMAL, payload: isMinimal });
  }, [cpu, dispatch, memory, nodesCount]);

  return (
    <Form>
      <TextContent>
        <Text component={TextVariants.h3} className="ocs-install-wizard__h3">
          Select Capacity
        </Text>
      </TextContent>
      <FormGroup
        fieldId="storage-class-dropdown"
        label="Storage Class"
        labelIcon={<FieldLevelHelp>{storageClassTooltip}</FieldLevelHelp>}
      >
        <Grid hasGutter>
          <GridItem span={5}>
            <StorageClassDropdown
              id="storage-class-dropdown"
              onChange={(sc: StorageClassResourceKind) =>
                dispatch({ type: ActionType.SET_STORAGE_CLASS, payload: sc })
              }
              filter={isNotOcsSC}
              hideClassName="ocs-install-wizard__storage-class-label"
            />
          </GridItem>
          <GridItem span={7} />
        </Grid>
      </FormGroup>
      <FormGroup
        fieldId="requested-capacity-dropdown"
        label="Requested Capacity"
        labelIcon={<FieldLevelHelp>{requestedCapacityTooltip}</FieldLevelHelp>}
      >
        <Grid hasGutter>
          <GridItem span={5}>
            <OSDSizeDropdown
              id="requested-capacity-dropdown"
              selectedKey={selectedCapacity}
              onChange={(capacity: string) =>
                dispatch({ type: ActionType.SET_CAPACITY, payload: capacity })
              }
            />
          </GridItem>
          <GridItem span={7}>
            <TotalCapacityText capacity={selectedCapacity} />
          </GridItem>
        </Grid>
      </FormGroup>
      <TextContent>
        <Text id="select-nodes" component={TextVariants.h3} className="ocs-install-wizard__h3">
          Select Nodes
        </Text>
      </TextContent>
      <Grid>
        <GridItem span={11} className="ocs-install-wizard__select-nodes">
          <SelectNodesText />
          <ListPage
            kind={NodeModel.kind}
            showTitle={false}
            ListComponent={InternalNodeTable}
            nameFilterPlaceholder="Search by node name..."
            labelFilterPlaceholder="Search by node label..."
            customData={{
              onRowSelected: (nodes: NodeKind[]) =>
                dispatch({ type: ActionType.SET_NODES, payload: [...nodes] }),
            }}
          />
          {!!nodesCount && (
            <TextContent>
              <Text data-test-id="nodes-selected">
                {pluralize(nodesCount, 'node')} selected ({cpu} CPU and{' '}
                {humanizeBinaryBytes(memory).string} on &nbsp;
                {pluralize(zone, 'zone')})
              </Text>
            </TextContent>
          )}
          {enableMinimal && (
            <Validation title={MINIMAL.title} variant={MINIMAL.variant}>
              {MINIMAL.text}
            </Validation>
          )}
        </GridItem>
      </Grid>
    </Form>
  );
};

type StepOneProps = {
  state: InternalClusterState;
  dispatch: React.Dispatch<InternalClusterAction>;
};
