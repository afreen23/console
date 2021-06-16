import * as React from 'react';
import { match as RouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Wizard, WizardStep } from '@patternfly/react-core';
import { useK8sGet } from '@console/internal/components/utils/k8s-get-hook';
import { ListKind } from '@console/internal/module/k8s';
import { CreateStorageSystemFooter } from './footer';
import { CreateStorageSystemHeader } from './header';
import { BackingStorage, createSteps } from './create-storage-system-steps';
import { initialState, reducer, WizardReducer } from './reducer';
import { StepsId, StorageClusterIdentifier } from '../../constants/create-storage-system';
import { StorageSystemKind } from '../../types';
import { StorageSystemModel } from '../../models';

const CreateStorageSystem: React.FC<CreateStorageSystemProps> = ({ match }) => {
  const { t } = useTranslation();
  const [state, dispatch] = React.useReducer<WizardReducer>(reducer, initialState);
  const [ssList, ssLoaded, ssLoadError] = useK8sGet<ListKind<StorageSystemKind>>(
    StorageSystemModel,
  );

  const {
    params: { appName },
    url,
  } = match;

  let wizardSteps: WizardStep[] = [];

  if (ssLoaded && !ssLoadError) {
    const hasOCS = ssList?.items?.some((ss) => ss.spec.kind === StorageClusterIdentifier);
    wizardSteps = ssLoaded && !ssLoadError ? createSteps(t, state, hasOCS) : [];
  }

  const steps: WizardStep[] = [
    {
      id: StepsId.BackingStorage,
      name: t('ceph-storage-plugin~Backing storage'),
      component: (
        <BackingStorage
          state={state}
          dispatch={dispatch}
          storageSystems={ssList?.items || []}
          error={ssLoadError}
          loaded={ssLoaded}
        />
      ),
    },
    ...wizardSteps,
  ];

  return (
    <>
      <CreateStorageSystemHeader t={t} appName={appName} url={url} />
      <Wizard
        steps={steps}
        footer={
          <CreateStorageSystemFooter
            t={t}
            state={state}
            dispatch={dispatch}
            disableNext={!ssLoaded || ssLoadError}
          />
        }
        cancelButtonText={t('ceph-storage-plugin~Cancel')}
        nextButtonText={t('ceph-storage-plugin~Next')}
        backButtonText={t('ceph-storage-plugin~Back')}
      />
    </>
  );
};

type CreateStorageSystemProps = {
  match: RouteMatch<{ ns: string; appName: string }>;
};

export default CreateStorageSystem;
