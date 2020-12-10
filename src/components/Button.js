import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import icons from '../assets/icons';
import colors from '../utils/colors';

export default Button = (props) => {

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.container, props.containerStyle]}
            onPress={() => {
                if (props.onPressButton && typeof props.onPressButton) {
                    props.onPressButton()
                }
            }}>
            <Text style={[styles.buttonTextStyle, props.buttonTextStyle]}>
                {props.buttonText}
            </Text>
        </TouchableOpacity>
    )
}

export const ButtonWithIcon = (props) => {

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.container, props.containerStyle, { justifyContent: 'flex-start' }]}
            onPress={() => {
                if (props.onPressButton && typeof props.onPressButton) {
                    props.onPressButton()
                }
            }}>
            {props.leftIcon &&
                <View style={[{ width: 30, height: 30, marginRight: 5, alignItems: 'center', justifyContent: 'center' }, props.leftIconStyle]}>
                    <Image
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        source={props.leftIcon}
                    />
                </View>
            }
            <View style={{ flex: 1 }}>
                <Text style={[styles.buttonTextStyle, props.buttonTextStyle]}>
                    {props.buttonText}
                </Text>
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