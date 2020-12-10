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

export default PlanCard = (props) => {
    const {
        containerStyle,
        onPressButton,
        buttonTextStyle,
        isChecked,
        buttonTitleText,
        buttonDesctiptionText,
        peckageText,
    } = props

    return (
        <TouchableOpacity
            disabled={isChecked}
            activeOpacity={0.7}
            style={[styles.container, { borderColor: isChecked ? colors.green : colors.lightBlue }, containerStyle]}
            onPress={() => {
                if (onPressButton && typeof onPressButton == 'function') {
                    onPressButton()
                }
            }}>
            <View style={[styles.checkCircle, { backgroundColor: isChecked ? colors.green : colors.lightBlue }]}>
                {isChecked &&
                    <Image
                        style={{ width: '100%', height: '100%', resizeMode: 'contain', tintColor: colors.white }}
                        source={icons.check}
                    />
                }
            </View>
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <Text style={[styles.buttonTextStyle, { color: isChecked ? colors.green : colors.black }, buttonTextStyle]}>
                    {buttonTitleText}
                </Text>
                <Text style={[{ color: colors.mediumGrey }]}>
                    {buttonDesctiptionText}
                </Text>
            </View>
            <View>
                <Text style={[styles.buttonTextStyle, { color: isChecked ? colors.green : colors.black }]}>
                    {peckageText}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 70,
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 5,
        borderWidth: 2,
        borderColor: colors.lightBlue,
        paddingHorizontal: 20,
    },
    buttonTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.black,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightBlue,
        padding: 5
    }
})