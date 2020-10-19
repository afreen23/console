import * as React from 'react';
import {
  Grid,
  GridItem,
  Form,
  FormGroup,
  Text,
  TextVariants,
  TextContent,
} from '@patternfly/react-core';
import { FieldLevelHelp } from '@console/internal/components/utils';
import { StorageClassResourceKind, NodeKind, K8sResourceKind } from '@console/internal/module/k8s';
import { StorageClassDropdown } from '@console/internal/components/utils/storage-class-dropdown';
import { ListPage } from '@console/internal/components/factory';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { NodeModel } from '@console/internal/models';
import { getName } from '@console/shared';
import {
  storageClassTooltip,
  MINIMUM_NODES,
  OCS_DEVICE_SET_REPLICA,
} from '../../../../../constants';
import {
  getNodeInfo,
  shouldDeployAsMinimal,
  filterSCWithNoProv,
  getAssociatedNodes,
} from '../../../../../utils/install';
import {
  ValidationMessage,
  VALIDATIONS,
  Validation,
} from '../../../../../utils/common-ocs-install-el';
import { SelectNodesText, SelectNodesDetails } from '../../../wizard-steps/capacity-and-nodes';
import AttachedDevicesNodeTable from '../../node-table';
import { PVsAvailableCapacity } from '../../../pvs-available-capacity';
import { pvResource } from '../../../../../constants/resources';
import { getSCAvailablePVs } from '../../../../../selectors';
import { State, Action } from '../state';

const validate = (scName, enableMinimal, nodes): Validation[] => {
  const validations = [];
  if (enableMinimal) {
    validations.push(VALIDATIONS.MINIMAL);
  }
  if (!scName) {
    validations.push(VALIDATIONS.STORAGECLASS);
  }
  if (scName && nodes.length < MINIMUM_NODES) {
    validations.push(VALIDATIONS.MINIMUMNODES);
  }
  return validations;
};

export const StorageAndNodes: React.FC<StepOneProps> = ({
  state,
  dispatch,
  setIsNewSCToBeCreated,
}) => {
  const [filteredNodes, setFilteredNodes] = React.useState<string[]>([]);
  const [pvData, pvLoaded, pvLoadError] = useK8sWatchResource<K8sResourceKind[]>(pvResource);

  const { nodes, enableMinimal, storageClass } = state;
  const { cpu, memory, zones } = getNodeInfo(nodes);
  const scName: string = getName(storageClass);
  const nodesCount = nodes.length;
  const validations = validate(scName, enableMinimal, filteredNodes);

  const goToCreateSCUI = () => {
    setIsNewSCToBeCreated(true);
  };

  React.useEffect(() => {
    if ((pvLoadError || pvData.length === 0) && pvLoaded) {
      setFilteredNodes([]);
    } else if (pvLoaded) {
      const pvs = getSCAvailablePVs(pvData, scName);
      const scNodes = getAssociatedNodes(pvs);
      setFilteredNodes(scNodes);
    }
  }, [pvData, pvLoadError, pvLoaded, scName]);

  React.useEffect(() => {
    const isMinimal = shouldDeployAsMinimal(cpu, memory, nodesCount);
    dispatch({ type: 'setMinimal', value: isMinimal });
  }, [cpu, dispatch, memory, nodesCount]);

  return (
    <Form>
      <TextContent>
        <Text component={TextVariants.h3} className="ocs-install-wizard__h3">
          Capacity
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
                dispatch({ type: 'setStorageClass', value: sc })
              }
              filter={filterSCWithNoProv}
              hideClassName="ocs-install-wizard__storage-class-label"
            />
            <PVsAvailableCapacity
              replica={OCS_DEVICE_SET_REPLICA}
              data-test-id="ceph-ocs-install-pvs-available-capacity"
              storageClass={storageClass}
            />
          </GridItem>
          <GridItem span={7} />
        </Grid>
      </FormGroup>
      <TextContent>
        <Text id="select-nodes" component={TextVariants.h3} className="ocs-install-wizard__h3">
          Selected Nodes
        </Text>
      </TextContent>
      <Grid>
        <GridItem span={11}>
          <SelectNodesText text="Selected nodes are based on the selected storage class. The selected nodes will preferably in 3 different zones with a recommended requirement of  14 CPUs and 34 GiB per node." />
        </GridItem>
        <GridItem span={10} className="ocs-install-wizard__select-nodes">
          <ListPage
            kind={NodeModel.kind}
            showTitle={false}
            ListComponent={AttachedDevicesNodeTable}
            hideLabelFilter
            hideNameLabelFilters
            customData={{ filteredNodes }}
          />
          {!!nodesCount && (
            <SelectNodesDetails cpu={cpu} memory={memory} zones={zones.size} nodes={nodesCount} />
          )}
          {!!validations.length &&
            validations.map((validation) => <ValidationMessage validation={validation} />)}
        </GridItem>
      </Grid>
    </Form>
  );
};

type StepOneProps = {
  state: State;
  dispatch: React.Dispatch<Action>;
  setIsNewSCToBeCreated?: React.Dispatch<boolean>;
};
