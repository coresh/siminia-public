import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '../CreateAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import RewardPointShowing from 'src/simi/BaseComponents/RewardPoint/components/PointShowing'
import defaultClasses from './createAccountPage.module.css';

const CreateAccountPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { createAccountProps } = useCreateAccountPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'createAccountPage.title',
                    defaultMessage: 'Create an Account'
                })}
            </StoreTitle>
            <h1 className={classes.header}>
                <FormattedMessage
                    id="createAccountPage.header"
                    defaultMessage="Create an Account"
                />
            </h1>
            <RewardPointShowing type="registration" />
            <div className={classes.contentContainer}>
                <CreateAccount {...createAccountProps} classes={{
                    cancelButton: classes.cancelButton,
                    submitButton: classes.submitButton
                }} />
            </div>
            
        </div>
    );
};

CreateAccountPage.defaultProps = {
    signedInRedirectUrl: '/order-history',
    signInPageUrl: '/sign-in'
};

CreateAccountPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default CreateAccountPage;
