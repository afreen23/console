import * as React from 'react';
import { ArrowCircleDownIcon } from '@patternfly/react-icons';
import { LoadingInline } from '../../utils';

// import { ResourceProvidersItemStatus } from './providers-item-status';

const prefixedId = (idPrefix, id) => {
  return idPrefix && id ? `${idPrefix}-${id}` : null;
};

const ResourceProvidersRowTitle = ({count, title}) => (
  <div className="co-resource-providers-card__row-title">{count != null ? `${count} ${title}` : title}</div>
);

const ResourceProvidersItemStatus = ({error}) => (
  <div className="co-resource-providers-card__row-status">
    <div className="co-resource-providers-card__row-status-item">
      <ArrowCircleDownIcon />
      <span className="co-resource-providers-card__row-status-item-text">{error}</span>
    </div>
  </div>
);

export const ResourceProvidersRow = ({title, count, errorCount}) => (
  <div id={prefixedId('provider', title.toLowerCase())} className="co-resource-providers-card__row">
    <ResourceProvidersRowTitle count={count} title={title} />
    {count != null ? <ResourceProvidersItemStatus error={errorCount} key="status" /> : <LoadingInline />}
  </div>
);
