import * as React from 'react';
import {
  pluralize,
  TextContent,
  Text,
  TextVariants,
  Card,
  CardBody,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { humanizeBinaryBytes, LoadingInline } from '@console/internal/components/utils';
import {
  GreenCheckCircleIcon,
  YellowExclamationTriangleIcon,
  BlueInfoCircleIcon,
  ErrorAlert,
} from '@console/shared';
import { TotalCapacityText, OSD_CAPACITY_SIZES } from '../../../../utils/osd-size-dropdown';
import { VALIDATIONS, Validation } from '../../../../utils/common-ocs-install-el';
import { getNodeInfo } from '../../../../utils/install';
import { InternalClusterState } from '../reducer';

const enum ReviewIconType {
  'OK' = 'OK',
  'WARNING' = 'WARNING',
  'INFO' = 'INFO',
}

const REVIEW_ICON_MAP = {
  [ReviewIconType.OK]: GreenCheckCircleIcon,
  [ReviewIconType.WARNING]: YellowExclamationTriangleIcon,
  [ReviewIconType.INFO]: BlueInfoCircleIcon,
};

const ReviewListTitle: React.FC<{ text: string }> = ({ text }) => (
  <dt>
    <TextContent className="ocs-install-wizard__text-content">
      <Text component={TextVariants.h3} className="ocs-install-wizard__h3 ">
        {text}
      </Text>
    </TextContent>
  </dt>
);

const ReviewListItem: React.FC<ReviewListItemProps> = ({ children, icon }) => {
  const Icon = REVIEW_ICON_MAP[icon];
  return (
    <dd className="ocs-install-wizard__dd">
      {icon ? (
        <Split>
          <SplitItem>
            <Icon className="ocs-install-wizard__icon" />
          </SplitItem>
          <SplitItem isFilled>{children}</SplitItem>
        </Split>
      ) : (
        children
      )}
    </dd>
  );
};

type ReviewListItemProps = {
  children?: React.ReactNode;
  icon?: ReviewIconType.OK | ReviewIconType.WARNING | ReviewIconType.INFO;
};

export const StepThree: React.FC<StepThreeProps> = ({ state, errorMessage, inProgress }) => {
  const { nodes, enableEncryption, capacity, enableMinimal } = state;
  const { cpu, memory, zone } = getNodeInfo(state.nodes);
  const { MINIMAL } = VALIDATIONS;

  return (
    <>
      <TextContent className="ocs-install-wizard__text-content">
        <Text component={TextVariants.h2}>Review storage cluster</Text>
      </TextContent>
      <dl>
        <ReviewListTitle text="Capacity and nodes" />
        <ReviewListItem>
          <TextContent>
            <Text>
              Requested Cluster Capacity: {OSD_CAPACITY_SIZES[capacity].title} (
              <TotalCapacityText capacity={capacity} />)
            </Text>
          </TextContent>
        </ReviewListItem>
        <ReviewListItem icon={ReviewIconType.OK}>
          <div>
            <p>{pluralize(nodes.length, 'node')} selected</p>
            {!!nodes.length && (
              <Card isCompact isFlat component="div" className="ocs-install-wizard__card">
                <CardBody isFilled className="ocs-install-wizard__card-body">
                  <TextContent>
                    {nodes.map((node) => (
                      <Text component={TextVariants.small}>{node.metadata.name}</Text>
                    ))}
                  </TextContent>
                </CardBody>
              </Card>
            )}
          </div>
        </ReviewListItem>
        <ReviewListItem icon={enableMinimal ? ReviewIconType.WARNING : ReviewIconType.OK}>
          <p>
            Total CPU and memory of {cpu} CPU and {humanizeBinaryBytes(memory).string}
          </p>
          {enableMinimal && (
            <Validation
              className="ocs-install-wizard__review-alert"
              variant={MINIMAL.variant}
              title={MINIMAL.text}
            />
          )}
        </ReviewListItem>
        <ReviewListItem icon={ReviewIconType.OK}>
          <p>{pluralize(zone, 'zone')}</p>
        </ReviewListItem>
        {/* Update the check from Configure when adding more items */}
        {enableEncryption && <ReviewListTitle text="Configure" />}
        {enableEncryption && (
          <ReviewListItem icon={ReviewIconType.OK}>
            <p>Enable Encryption</p>
          </ReviewListItem>
        )}
      </dl>
      {errorMessage && <ErrorAlert message={errorMessage} />}
      {inProgress && <LoadingInline />}
    </>
  );
};

type StepThreeProps = {
  errorMessage: string;
  inProgress: boolean;
  state: InternalClusterState;
};
