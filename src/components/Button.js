import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from 'react-native';
import icons from '../assets/icons';
import colors from '../utils/colors';

export default Button = (props) => {

    const {
        containerStyle,
        activityIndicatorProps,
        onPressButton,
        buttonTextStyle,
        buttonText
    } = props

    const {
        loading,
        size,
        color,
        style
    } = activityIndicatorProps ? activityIndicatorProps : {}

    return (
        <TouchableOpacity
            disabled={loading}
            activeOpacity={0.7}
            style={[styles.container, containerStyle]}
            onPress={() => {
                if (onPressButton && typeof onPressButton) {
                    onPressButton()
                }
            }}>
            <View style={{ flex: 1, }}>

            </View>
            <Text style={[styles.buttonTextStyle, buttonTextStyle]}>
                {buttonText}
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                {loading &&
                    <ActivityIndicator
                        animating={loading}
                        size={size ? size : 'small'}
                        color={color ? color : colors.white}
                        style={[{ marginLeft: 5 }, style ? style : {}]}
                    />
                }
            </View>
        </TouchableOpacity>
    )
}

export const ButtonWithIcon = (props) => {

    const {
        containerStyle,
        activityIndicatorProps,
        onPressButton,
        leftIcon,
        buttonTextStyle,
        buttonText
    } = props

    const {
        loading,
        size,
        color,
        style
    } = activityIndicatorProps ? activityIndicatorProps : {}

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.container, containerStyle, { justifyContent: 'flex-start' }]}
            onPress={() => {
                if (onPressButton && typeof onPressButton) {
                    onPressButton()
                }
            }}>
            {leftIcon &&
                <View style={[{ width: 30, height: 30, marginRight: 5, alignItems: 'center', justifyContent: 'center' }, props.leftIconStyle]}>
                    <Image
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        source={leftIcon}
                    />
                </View>
            }
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={[styles.buttonTextStyle, buttonTextStyle]}>
                    {buttonText}
                </Text>
                {loading &&
                    <ActivityIndicator
                        animating={loading}
                        size={size ? size : 'small'}
                        color={color ? color : colors.primary}
                        style={[{ marginLeft: 5 }, style ? style : {}]}
                    />
                }
            </View>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    style={{ width: 10, height: 10, resizeMode: 'contain' }}
                    source={icons.rightArrow}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 55,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonTextStyle: {
        fontSize: 16,
        // fontWeight: 'bold',
        color: colors.primary,
    },
})