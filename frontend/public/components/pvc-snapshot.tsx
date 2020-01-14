import * as React from 'react';
import * as _ from 'lodash-es';
import * as classNames from 'classnames';

import { DetailsPage, ListPage, Table, TableData, TableRow } from './factory';
import {
    Kebab,
    ResourceKebab,
    ResourceLink,
} from './utils';

import { snapshotModal } from './modals/snapshot-modal';
import { sortable } from '@patternfly/react-table';

const { Restore } = Kebab.factory;
const snapshotMenuActions = [
    Restore
];

const snapshotTableColumnClasses = [
    classNames('col-lg-2', 'col-md-2', 'col-sm-4', 'col-xs-6'),
    classNames('col-lg-2', 'col-md-2', 'col-sm-4', 'col-xs-6'),
    classNames('col-lg-2', 'col-md-2', 'col-sm-4', 'hidden-xs'),
    classNames('col-lg-3', 'col-md-3', 'hidden-sm', 'hidden-xs'),
    classNames('col-lg-3', 'col-md-3', 'hidden-sm', 'hidden-xs'),
    Kebab.columnClass,
];

const SnapshotTableHeader = () => {
    return [
        {
            title: 'Name',
            sortField: 'metadata.name',
            transforms: [sortable],
            props: { className: snapshotTableColumnClasses[0] },
        },
        {
            title: 'Date',
            sortField: 'metadata.creationTimestamp',
            transforms: [sortable],
            props: { className: snapshotTableColumnClasses[5] },
        },
        // {
        //     title: 'Status',
        //     sortField: 'status.phase',
        //     transforms: [sortable],
        //     props: { className: snapshotTableColumnClasses[2] },
        // },
        {
            title: 'Size',
            sortField: 'status.capacity.storage',
            transforms: [sortable],
            props: { className: snapshotTableColumnClasses[4] },
        },
        {
            title: 'Labels',
            sortField: 'metadata.labels',
            transforms: [sortable],
            props: { className: snapshotTableColumnClasses[4] },
        },
        {
            title: '',
            props: { className: snapshotTableColumnClasses[5] },
        },
    ];
};
SnapshotTableHeader.displayName = 'SnapshotTableHeader';

const kind = 'VolumeSnapshot';

const SnapshotTableRow = ({ obj, index, key, style }) => {
    return (
        <TableRow id={obj.metadata.uid} index={index} trKey={key} style={style}>
            <TableData className={SnapshotTableHeader[0]}>
                <ResourceLink
                    kind={kind}
                    name={obj.name}
                    namespace={obj.namespace}
                    title={obj.name}
                />
            </TableData>
            <TableData className={SnapshotTableHeader[1]}>
                {obj.metadata.timestamp}
            </TableData>
            <TableData className={SnapshotTableHeader[2]}>
                {obj.status.ready ? 'Ready' : 'Not Ready'}
            </TableData>
            <TableData className={SnapshotTableHeader[3]}>
                {obj.status.size}
            </TableData>
            <TableData className={SnapshotTableHeader[4]}>
                {obj.labels}
            </TableData>
            <TableData className={SnapshotTableHeader[5]}>
                <ResourceKebab actions={snapshotMenuActions} kind={kind} resource={obj} />
            </TableData>
        </TableRow>
    );
};
SnapshotTableRow.displayName = 'SnapshotTableRow';

export const SnapshotList: React.FC = (props) => (
    <Table
        {...props}
        aria-label="Volume Snapshot"
        Header={SnapshotTableHeader}
        Row={SnapshotTableRow}
        virtualize
    />
);


export const SnapshotListDetailsPage = (props) => (
    <DetailsPage
        {...props}
        menuActions={snapshotMenuActions}
    />
);

export const SnapshotListPage = (props) => {
    return (
        <ListPage
            {...props}
            canCreate={true}
            kind="VolumeSnapshot"
            ListComponent={SnapshotList}
            showTitle={false}
            selector={props.pvcObj.name}
            createHandler={() => snapshotModal({ kind: props.pvcObj.kind, resource: props.pvcObj })}
        />

    );
};



