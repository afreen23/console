import * as React from 'react';
import { match } from 'react-router';
// import { WizardBody, Wizard } from '@patternfly/react-core';
import { resourcePathFromModel, BreadCrumbs } from '@console/internal/components/utils';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { k8sGet } from '@console/internal/module/k8s';

const CreateLocalVolumeGroup: React.FC<CreateLocalVolumeGroupProps> = ({ match }) => {

    const { ns, appName } = match.params;
    const [clusterServiceVersion, setClusterServiceVersion] = React.useState(null);

    React.useEffect(() => {
        k8sGet(ClusterServiceVersionModel, appName, ns)
            .then((clusterServiceVersionObj) => {
                setClusterServiceVersion(clusterServiceVersionObj);
            })
            .catch(() => setClusterServiceVersion(null));
    }, [appName, ns]);

    return <div className="co-create-operand__header">
        <div className="co-create-operand__header-buttons">
            <BreadCrumbs
                breadcrumbs={[
                    {
                        name: clusterServiceVersion.spec.displayName,
                        path: resourcePathFromModel(
                            ClusterServiceVersionModel,
                            clusterServiceVersion.metadata.name,
                            clusterServiceVersion.metadata.namespace,
                        ),
                    },
                    { name: `Create ${appName}`, path: window.location.pathname },
                ]}
            />
        </div>
        <h1 className="co-create-operand__header-text">{`Create ${appName}`}</h1>
        <p className="help-block">
            Create by manually entering YAML or JSON definitions, or by dragging and dropping a file
            into the editor.
    </p>
    </div>;
};

type CreateLocalVolumeGroupProps = {
    match: match<{ appName: string; ns: string; }>;
};

export default CreateLocalVolumeGroup;
