import * as React from 'react';
import {
  TextContent,
  Text,
  TextVariants,
  Card,
  CardBody,
  Split,
  SplitItem,
  AlertVariant,
} from '@patternfly/react-core';
import { LoadingInline } from '@console/internal/components/utils';
import {
  GreenCheckCircleIcon,
  YellowExclamationTriangleIcon,
  BlueInfoCircleIcon,
  ErrorAlert,
  RedExclamationCircleIcon,
} from '@console/shared';
import { ValidationMessage, Validation } from '../../../utils/common-ocs-install-el';
import { NodeKind } from '@console/internal/module/k8s';

const REVIEW_ICON_MAP = {
  [AlertVariant.success]: GreenCheckCircleIcon,
  [AlertVariant.warning]: YellowExclamationTriangleIcon,
  [AlertVariant.info]: BlueInfoCircleIcon,
  [AlertVariant.danger]: RedExclamationCircleIcon,
};

export const ReviewListTitle: React.FC<{ text: string }> = ({ text }) => (
  <dt>
    <TextContent className="ocs-install-wizard__text-content">
      <Text component={TextVariants.h3} className="ocs-install-wizard__h3 ">
        {text}
      </Text>
    </TextContent>
  </dt>
);

export const ReviewListBody: React.FC<ReviewListBodyProps> = ({
  children,
  validation,
  noValue = undefined,
}) => {
  const Icon = noValue
    ? REVIEW_ICON_MAP[AlertVariant.danger]
    : REVIEW_ICON_MAP[validation?.variant || AlertVariant.success];

  return (
    <dd className="ocs-install-wizard__dd">
      <Split>
        <SplitItem>
          <Icon className="ocs-install-wizard__icon" />
        </SplitItem>
        <SplitItem isFilled>
          {children}
          {validation?.variant && (
            <ValidationMessage
              className="ocs-install-wizard__review-list-item-alert"
              validation={validation}
            />
          )}
        </SplitItem>
      </Split>
    </dd>
  );
};

type ReviewListBodyProps = {
  children: React.ReactNode;
  noValue?: boolean;
  validation?: Validation;
};

export const RequestErrors: React.FC<{ errorMessage: string; inProgress: boolean }> = ({
  errorMessage,
  inProgress,
}) => {
  return (
    <>
      {errorMessage && <ErrorAlert message={errorMessage} />}
      {inProgress && <LoadingInline />}
    </>
  );
};

export const NodesCard: React.FC<{ nodes: NodeKind[] }> = ({ nodes }) =>
  !!nodes.length && (
    <Card isCompact isFlat component="div" className="ocs-install-wizard__card">
      <CardBody isFilled className="ocs-install-wizard__card-body">
        <TextContent>
          {nodes.map((node) => (
            <Text component={TextVariants.small}>{node.metadata.name}</Text>
          ))}
        </TextContent>
      </CardBody>
    </Card>
  );
