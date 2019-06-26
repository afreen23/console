import * as React from 'react';
import { ArrowCircleDownIcon } from '@patternfly/react-icons';
import { LoadingInline } from '@console/internal/components/utils';
import * as _ from 'lodash';

const ResourceProvidersItemStatus = ({ status }) => (
  <div className="co-resource-providers-card__row-status">
    <div className="co-resource-providers-card__row-status-item">
      <div>
        <ArrowCircleDownIcon />
      </div>
      <div className="co-resource-providers-card__row-status-item-text">{status}</div>
    </div>
  </div>
);

export const ResourceProvidersBody = ({ title, count, unhealthyProviders }) => (
  <div className="co-resource-providers-card__row">
    <div className="co-resource-providers-card__row-title">{`${count} ${title}`}</div>
    {!_.isNil(unhealthyProviders[title]) && unhealthyProviders[title] > 0 ? (
      <ResourceProvidersItemStatus status={unhealthyProviders[title]} />
    ) : null}
  </div>
);

export const ResourceProviderItems = ({ allProviders, unhealthyProviders, isLoading }) => {
  let render;
  if (isLoading) render = <LoadingInline />;
  else if (_.isNil(allProviders)) render = 'Unavailable';
  // error from prometheus
  else if (_.isEmpty(allProviders)) render = 'No data';
  // no resource providers present
  else {
    render = (
      <React.Fragment>
        {Object.keys(allProviders)
          .filter((provider) => allProviders[provider] > 0)
          .map((provider) => (
            <ResourceProvidersBody
              key={provider}
              title={provider}
              count={allProviders[provider]}
              unhealthyProviders={unhealthyProviders}
            />
          ))}
      </React.Fragment>
    );
  }
  return render;
};
