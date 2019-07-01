import * as React from 'react';
import * as _ from 'lodash';
import { ArrowCircleDownIcon } from '@patternfly/react-icons';
import { LoadingInline, pluralize } from '@console/internal/components/utils';

const pluralizeWithKNotation = (i: number, singular: string, plural: string = `${singular}s`) =>
  `${i || 0}K ${i === 1 ? singular : plural}`;

const BucketsRow = ({ count, title, objectsCount }) => {
  let oc = Number(objectsCount);
  let substring = 'Unavailable';
  if (!_.isNil(objectsCount)) {
    oc = objectsCount / 1000;
    substring = pluralizeWithKNotation(oc, 'Object');
  }
  return (
    <div className="co-buckets-card__row-title">
      <div>{_.isNil(count) ? title : pluralize(Number(count), title)}</div>
      <div className="co-buckets-card__row-subtitle">{substring}</div>
    </div>
  );
};

const BucketsRowStatus = ({ status }) => (
  <div className="co-buckets-card__row-status-item">
    {_.isNil(status) ? (
      <span className="co-buckets-card__row-subtitle">Unavailable</span>
    ) : status > 0 ? (
      <React.Fragment>
        <div>
          <ArrowCircleDownIcon />
        </div>
        <div className="co-buckets-card__row-status-item-text">{status}</div>
      </React.Fragment>
    ) : null}
  </div>
);

export const BucketsItem = ({ title, bucketsCount, objects, unhealthy, isLoading }) =>
  isLoading ? (
    <LoadingInline />
  ) : (
    <div className="co-buckets-card__row">
      <BucketsRow count={bucketsCount} title={title} objectsCount={objects} />
      <BucketsRowStatus status={unhealthy} />
    </div>
  );
