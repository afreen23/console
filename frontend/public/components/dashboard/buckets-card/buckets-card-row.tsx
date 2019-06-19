import * as React from 'react';
import { ArrowCircleDownIcon } from '@patternfly/react-icons';
import { LoadingInline } from '../../utils';

// import { BucketsItemStatus } from './providers-item-status';

const prefixedId = (idPrefix, id) => {
  return idPrefix && id ? `${idPrefix}-${id}` : null;
};

const BucketsRowTitle = ({count, title, objectsCount}) => (
  <div className="co-buckets-card__row-title">
    <div>{count != null ? `${count} ${title}` : title}</div>
    <div className="co-buckets-card__row-subtitle">{`${objectsCount} Objects`}</div>
  </div>
);

const BucketsItemStatus = ({error}) => (
  <div className="co-buckets-card__row-status">
    <div className="co-buckets-card__row-status-item">
      <ArrowCircleDownIcon />
      <span className="co-buckets-card__row-status-item-text">{error}</span>
    </div>
  </div>
);

export const BucketsRow = ({title, count, errorCount, objects}) => (
  <div id={prefixedId('buckets', title.toLowerCase())} className="co-buckets-card__row">
    <BucketsRowTitle count={count} title={title} objectsCount={objects} />
    {count != null ? <BucketsItemStatus error={errorCount} key="status" /> : <LoadingInline />}
  </div>
);
