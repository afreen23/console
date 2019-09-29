import * as React from 'react';
import * as _ from 'lodash';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/internal/components/dashboard/dashboard-card';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { EventKind } from '@console/internal/module/k8s';
import { FirehoseResource, FirehoseResult } from '@console/internal/components/utils';
import {
  EventModel,
  PersistentVolumeClaimModel,
  PersistentVolumeModel,
} from '@console/internal/models';
import {
  ActivityBody,
  RecentEventsBody,
  OngoingActivityBody,
} from '@console/internal/components/dashboard/activity-card/activity-body';
import * as plugins from '@console/internal/plugins';
import { uniqueResource } from '@console/internal/components/dashboards-page/overview-dashboard/utils';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { getNamespace } from '@console/shared';
import { CEPH_STORAGE_NAMESPACE } from '../../../constants/index';

const eventsResource: FirehoseResource = { isList: true, kind: EventModel.kind, prop: 'events' };

const ocsEventNamespaceKindFilter = (event: EventKind): boolean =>
  getNamespace(event) === CEPH_STORAGE_NAMESPACE ||
  _.get(event, 'involvedObject.kind') ===
    (PersistentVolumeClaimModel.kind || PersistentVolumeModel.kind);

const RecentEvent = withDashboardResources(
  ({ watchK8sResource, stopWatchK8sResource, resources }: DashboardItemProps) => {
    React.useEffect(() => {
      watchK8sResource(eventsResource);
      return () => {
        stopWatchK8sResource(eventsResource);
      };
    }, [watchK8sResource, stopWatchK8sResource]);
    return (
      <RecentEventsBody
        events={resources.events as FirehoseResult<EventKind[]>}
        filter={ocsEventNamespaceKindFilter}
      />
    );
  },
);

const OngoingActivity = withDashboardResources(
  ({
    watchK8sResource,
    stopWatchK8sResource,
    resources,
    watchPrometheus,
    stopWatchPrometheusQuery,
    prometheusResults,
  }: DashboardItemProps) => {
    React.useEffect(() => {
      const activities = plugins.registry.getDashboardsOverviewActivities();
      activities.forEach((a, index) => {
        watchK8sResource(uniqueResource(a.properties.k8sResource, index));
      });
      const prometheusActivities = plugins.registry.getDashboardsOverviewPrometheusActivities();
      prometheusActivities.forEach((a) => a.properties.queries.forEach(watchPrometheus));
      return () => {
        activities.forEach((a, index) => {
          stopWatchK8sResource(uniqueResource(a.properties.k8sResource, index));
        });
        prometheusActivities.forEach((a) => a.properties.queries.forEach(stopWatchPrometheusQuery));
      };
    }, [watchK8sResource, stopWatchK8sResource, watchPrometheus, stopWatchPrometheusQuery]);

    const activities = plugins.registry.getDashboardsOverviewActivities();
    const allActivities = _.flatten(
      activities.map((a, index) => {
        const k8sResources = _.get(
          resources,
          [uniqueResource(a.properties.k8sResource, index).prop, 'data'],
          [],
        ) as FirehoseResult['data'];
        return k8sResources
          .filter((r) => (a.properties.isActivity ? a.properties.isActivity(r) : true))
          .map((r) => ({
            resource: r,
            timestamp: a.properties.getTimestamp(r),
            loader: a.properties.loader,
          }));
      }),
    );

    const prometheusActivities = plugins.registry.getDashboardsOverviewPrometheusActivities();
    const allPrometheusActivities = prometheusActivities
      .filter((a) => {
        const queryResults = a.properties.queries.map(
          (q) => prometheusResults.getIn([q, 'data']) as PrometheusResponse,
        );
        return a.properties.isActivity(queryResults);
      })
      .map((a) => {
        const queryResults = a.properties.queries.map(
          (q) => prometheusResults.getIn([q, 'data']) as PrometheusResponse,
        );
        return {
          loader: a.properties.loader,
          results: queryResults,
        };
      });

    const resourcesLoaded = activities.every((a, index) =>
      _.get(resources, [uniqueResource(a.properties.k8sResource, index).prop, 'loaded']),
    );
    const queriesLoaded = prometheusActivities.every((a) =>
      a.properties.queries.every(
        (q) => prometheusResults.getIn([q, 'data']) || prometheusResults.getIn([q, 'loadError']),
      ),
    );
    return (
      <OngoingActivityBody
        loaded={resourcesLoaded && queriesLoaded}
        activities={allActivities}
        prometheusActivities={allPrometheusActivities}
      />
    );
  },
);

export const ActivityCard: React.FC<{}> = React.memo(() => (
  <DashboardCard>
    <DashboardCardHeader>
      <DashboardCardTitle>Activity</DashboardCardTitle>
    </DashboardCardHeader>
    <DashboardCardBody>
      <ActivityBody>
        <OngoingActivity />
        <RecentEvent />
      </ActivityBody>
    </DashboardCardBody>
  </DashboardCard>
));
