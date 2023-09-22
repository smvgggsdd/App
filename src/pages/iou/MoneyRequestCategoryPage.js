import React from 'react';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import {withOnyx} from 'react-native-onyx';
import compose from '../../libs/compose';
import ROUTES from '../../ROUTES';
import Navigation from '../../libs/Navigation/Navigation';
import useLocalize from '../../hooks/useLocalize';
import ScreenWrapper from '../../components/ScreenWrapper';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import CategoryPicker from '../../components/CategoryPicker';
import ONYXKEYS from '../../ONYXKEYS';
import reportPropTypes from '../reportPropTypes';
import * as IOU from '../../libs/actions/IOU';
import {iouPropTypes, iouDefaultProps} from './propTypes';

const propTypes = {
    /** Navigation route context info provided by react navigation */
    route: PropTypes.shape({
        /** Route specific parameters used on this screen via route :iouType/new/category/:reportID? */
        params: PropTypes.shape({
            /** The type of IOU report, i.e. bill, request, send */
            iouType: PropTypes.string,

            /** The report ID of the IOU */
            reportID: PropTypes.string,
        }),
    }).isRequired,

    /* Onyx Props */
    /** The report currently being used */
    report: reportPropTypes,

    /** Holds data related to Money Request view state, rather than the underlying Money Request data. */
    iou: iouPropTypes,
};

const defaultProps = {
    report: {},
    iou: iouDefaultProps,
};

function MoneyRequestCategoryPage({route, report, iou}) {
    const {translate} = useLocalize();

    const reportID = lodashGet(route, 'params.reportID', '');
    const iouType = lodashGet(route, 'params.iouType', '');

    const navigateBack = () => {
        Navigation.goBack(ROUTES.getMoneyRequestConfirmationRoute(iouType, reportID));
    };

    const updateCategory = (category) => {
        if (category.searchText === iou.category) {
            IOU.resetMoneyRequestCategory();
        } else {
            IOU.setMoneyRequestCategory(category.searchText);
        }

        Navigation.goBack(ROUTES.getMoneyRequestConfirmationRoute(iouType, reportID));
    };

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
            testID={MoneyRequestCategoryPage.displayName}
        >
            <HeaderWithBackButton
                title={translate('common.category')}
                onBackButtonPress={navigateBack}
            />

            <CategoryPicker
                selectedCategory={iou.category}
                policyID={report.policyID}
                onSubmit={updateCategory}
            />
        </ScreenWrapper>
    );
}

MoneyRequestCategoryPage.displayName = 'MoneyRequestCategoryPage';
MoneyRequestCategoryPage.propTypes = propTypes;
MoneyRequestCategoryPage.defaultProps = defaultProps;

export default compose(
    withOnyx({
        iou: {
            key: ONYXKEYS.IOU,
        },
    }),
    // This is a temporary hack to forward forward iou value to next getter.
    // There is a problem that with one withOnyx it does not forward value from first to second.
    // eslint-disable-next-line rulesdir/no-multiple-onyx-in-file
    withOnyx({
        report: {
            key: ({route, iou}) => {
                let reportID = lodashGet(route, 'params.reportID', '');
                if (!reportID) {
                    // When the money request creation flow is initialized on Global Create, the reportID is not passed as a navigation parameter.
                    // Get the report id from the participants list on the IOU object stored in Onyx.
                    reportID = lodashGet(iou, 'participants.0.reportID', '');
                }
                return `${ONYXKEYS.COLLECTION.REPORT}${reportID}`;
            },
        },
    }),
)(MoneyRequestCategoryPage);
