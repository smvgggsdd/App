import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import styles from '@styles/styles';
import * as StyleUtils from '@styles/StyleUtils';
import CONST from '@src/CONST';
import PressableWithoutFeedback from './Pressable/PressableWithoutFeedback';
import Text from './Text';

const propTypes = {
    /** Is Success type */
    success: PropTypes.bool,

    /** Is Error type */
    error: PropTypes.bool,

    /** Whether badge is clickable */
    pressable: PropTypes.bool,

    /** Text to display in the Badge */
    text: PropTypes.string.isRequired,

    /** Text to display in the Badge */
    environment: PropTypes.string,

    /** Styles for Badge */
    // eslint-disable-next-line react/forbid-prop-types
    badgeStyles: PropTypes.arrayOf(PropTypes.object),

    /** Styles for Badge Text */
    // eslint-disable-next-line react/forbid-prop-types
    textStyles: PropTypes.arrayOf(PropTypes.object),

    /** Callback to be called on onPress */
    onPress: PropTypes.func,
};

const defaultProps = {
    success: false,
    error: false,
    pressable: false,
    badgeStyles: [],
    textStyles: [],
    onPress: undefined,
    environment: CONST.ENVIRONMENT.DEV,
};

function Badge(props) {
    const textStyles = props.success || props.error ? styles.textWhite : undefined;
    const Wrapper = props.pressable ? PressableWithoutFeedback : View;
    const wrapperStyles = ({pressed}) => [
        styles.badge,
        styles.ml2,
        StyleUtils.getBadgeColorStyle(props.success, props.error, pressed, props.environment === CONST.ENVIRONMENT.ADHOC),
        ...props.badgeStyles,
    ];

    return (
        <Wrapper
            style={props.pressable ? wrapperStyles : wrapperStyles(false)}
            onPress={props.onPress}
            role={props.pressable ? CONST.ACCESSIBILITY_ROLE.BUTTON : CONST.ACCESSIBILITY_ROLE.TEXT}
            accessibilityLabel={props.pressable ? props.text : undefined}
            aria-label={!props.pressable ? props.text : undefined}
        >
            <Text
                style={[styles.badgeText, textStyles, ...props.textStyles]}
                numberOfLines={1}
            >
                {props.text}
            </Text>
        </Wrapper>
    );
}

Badge.displayName = 'Badge';
Badge.propTypes = propTypes;
Badge.defaultProps = defaultProps;
export default Badge;
