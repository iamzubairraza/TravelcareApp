import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import _ from 'lodash'

import colors from '../utils/colors';

export default InputField = (props) => {
    const {
        inputContainer,
        onParentPress,
        inputStyle,
        fieldRef,
        value,
        onChangeText,
        onSubmitEditing,
        onFocus,
        onKeyPress,
        leftIcon,
        rightIcon,
        rightText,
        leftIconStyle,
        rightIconStyle,
        onRightIconPress,
        hideShadowElevation,
        rightIconContainerStyle
    } = props

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                if (onParentPress && typeof onParentPress == 'function') onParentPress()
            }}
            style={[styles.inputContainer, inputContainer, hideShadowElevation ? {} : styles.shadowElevation]}>
            {leftIcon &&
                <Image
                    style={[styles.iconStyle, { marginRight: 5 }, leftIconStyle]}
                    source={leftIcon}
                />
            }
            <TextInput
                {...props}
                ref={ref => {
                    if (fieldRef && typeof fieldRef == 'function') fieldRef(ref)
                }}
                style={[styles.inputStyle, inputStyle]}
                value={value}
                placeholderTextColor={colors.mediumGrey}
                onChangeText={(text) => {
                    if (onChangeText && typeof onChangeText == 'function') onChangeText(text)
                }}
                onSubmitEditing={() => {
                    if (onSubmitEditing && typeof onSubmitEditing == 'function') onSubmitEditing()
                }}
                onFocus={(event: Event) => { if (onFocus && typeof onFocus == 'function') onFocus(event) }}
                onKeyPress={({ nativeEvent }) => { if (onKeyPress && typeof onKeyPress == 'function') onKeyPress(nativeEvent) }}
            />
            {rightIcon &&
                <TouchableOpacity
                    disabled={_.isNil(onRightIconPress)}
                    style={[{ padding: 10 }, rightIconContainerStyle]}
                    onPress={() => {
                        if (onRightIconPress) onRightIconPress()
                    }}>
                    {rightText ?
                        <Text style={{ color: colors.green }}>{rightText}</Text>
                        :
                        <Image
                            style={[styles.iconStyle, rightIconStyle]}
                            source={rightIcon}
                        />
                    }
                </TouchableOpacity>
            }
        </TouchableOpacity>
    )
}

const testInput = () => {
    return (
        <TextInput
            ref={ref => {
                if (fieldRef && typeof fieldRef == 'function') fieldRef(ref)
            }}
            style={[styles.inputStyle, inputStyle]}
            value={value}
            caretHidden={caretHidden ? caretHidden : false}
            autoCorrect={false}
            secureTextEntry={false}
            autoCapitalize={'none'}
            placeholder={''}
            textContentType={'telephoneNumber'}
            keyboardType={'phone-pad'}
            autoCompleteType={'tel'}
            returnKeyType={'done'}
            multiline={false}
            maxLength={500}
            numberOfLines={100}
            placeholderTextColor={colors.mediumGrey}
            onChangeText={(text) => {

            }}
            onSubmitEditing={() => {

            }}
            onFocus={(event: Event) => { }}
            onKeyPress={({ nativeEvent }) => { }}
        />
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        marginTop: 10,
        borderRadius: 10,
        paddingHorizontal: 15
    },
    inputStyle: {
        flex: 1,
    },
    shadowElevation: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 10.84,

        elevation: 5,
    },
    iconStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
})