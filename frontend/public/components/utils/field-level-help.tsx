import * as React from 'react';
import { Button, Popover, PopoverProps } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';

export const FieldLevelHelp: React.FC<FieldLevelHelpProps> = React.memo(
  ({ children, popoverHasAutoWidth }) => {
    const { t } = useTranslation();
    if (React.Children.count(children) === 0) {
      return null;
    }
    return (
      <Popover
        aria-label={t('public~Help')}
        bodyContent={children}
        hasAutoWidth={popoverHasAutoWidth}
      >
        <Button
          aria-label={t('public~Help')}
          variant="link"
          isInline
          className="co-field-level-help"
        >
          <OutlinedQuestionCircleIcon className="co-field-level-help__icon" />
        </Button>
      </Popover>
    );
  },
);

type FieldLevelHelpProps = {
  children: React.ReactNode;
  popoverHasAutoWidth?: PopoverProps['hasAutoWidth'];
};
