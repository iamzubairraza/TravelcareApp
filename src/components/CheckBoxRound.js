import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import colors from '../utils/colors';

export default CheckBoxRound = (props) => {
    const {
        disabled,
        disableFunc,
        mainContainer,
        iconContainer,
        innerViewStyle,
        isChecked,
        labelStyle,
        disableLable,
        label,
        onPress,
    } = props

    return (
        <View style={[{ flexDirection: 'row' }, mainContainer]}>
            <TouchableOpacity
                disabled={disabled || (disableFunc && isChecked)}
                style={[styles.container, styles.shadowElevation, { backgroundColor: isChecked ? colors.green : colors.mediumGrey }, iconContainer]}
                onPress={() => {
                    if (onPress && typeof onPress == 'function') onPress()
                }}>
                <View style={[styles.innerView, innerViewStyle]} />
            </TouchableOpacity>
            {label && <Text style={[styles.label, labelStyle, { color: disableLable ? isChecked ? colors.black : colors.mediumGrey : colors.black }]}>{label}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 5,
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
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
    innerView: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white
    },
    label: {
        marginLeft: 5,
    }
})