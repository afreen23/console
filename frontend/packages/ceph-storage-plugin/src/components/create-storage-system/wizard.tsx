import * as React from 'react';
import { match as RouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Wizard,
  WizardFooter,
  WizardContextConsumer,
  WizardStep,
  Button,
} from '@patternfly/react-core';
import { BreadCrumbs, history, resourcePathFromModel } from '@console/internal/components/utils';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager/src';
import { BackingStorage } from './backing-storage-step/backing-storage';

const STEPS_ID = {
  BACKINGSTORAGE: 'backing-storage',
  REVIEWANDCREATE: 'review-and-create',
};

const CreateStorageSystem: React.FC<CreateStorageSystemProps> = ({ match }) => {
  const { t } = useTranslation();

  const {
    params: { appName, ns },
    url,
  } = match;

  const steps: WizardStep[] = [
    {
      id: STEPS_ID.BACKINGSTORAGE,
      name: t('ceph-storage-plugin~Backing Storage'),
      component: <BackingStorage t={t} />,
    },
  ];

  /**
   * This custom footer for wizard provides a control over the movement to next step.
   * Movement to next step is only done when a certain validations are met for the current step.
   */
  const CustomFooter: React.ReactNode = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack, onClose }) => {
          const nextButtonFactory = {
            [STEPS_ID.BACKINGSTORAGE]: {
              onNextClick: () => onNext(),
              isNextDisabled: false,
            },
          };
          const { id } = activeStep;

          return (
            <>
              <Button
                variant="primary"
                type="submit"
                isDisabled={nextButtonFactory[id].isNextDisabled}
                onClick={nextButtonFactory[id].onNextClick}
              >
                {id === STEPS_ID.REVIEWANDCREATE
                  ? t('ceph-storage-plugin~Create')
                  : t('ceph-storage-plugin~Next')}
              </Button>
              <Button
                variant="secondary"
                onClick={onBack}
                isDisabled={id === STEPS_ID.BACKINGSTORAGE}
              >
                {t('ceph-storage-plugin~Back')}
              </Button>
              <Button variant="link" onClick={onClose}>
                {t('ceph-storage-plugin~Cancel')}
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );

  return (
    <>
      <div className="co-create-operand__header">
        <div className="co-create-operand__header-buttons">
          <BreadCrumbs
            breadcrumbs={[
              {
                name: appName,
                path: url.replace('/~new', ''),
              },
              {
                name: t('ceph-storage-plugin~Create StorageCluster'),
                path: url,
              },
            ]}
          />
        </div>
        <h1 className="co-create-operand__header-text">
          {t('ceph-storage-plugin~Create StorageSystem')}
        </h1>
        <p className="help-block">
          {t(
            'ceph-storage-plugin~Storage System represents an OpenShift Data Foundation system and all the storage and compute resources required',
          )}
        </p>
      </div>
      <Wizard
        steps={steps}
        footer={CustomFooter}
        cancelButtonText={t('ceph-storage-plugin~Cancel')}
        nextButtonText={t('ceph-storage-plugin~Next')}
        backButtonText={t('ceph-storage-plugin~Back')}
        onClose={() => history.push(resourcePathFromModel(ClusterServiceVersionModel, appName, ns))}
      />
    </>
  );
};

type CreateStorageSystemProps = {
  match: RouteMatch<{ ns: string; appName: string }>;
};

export default CreateStorageSystem;
