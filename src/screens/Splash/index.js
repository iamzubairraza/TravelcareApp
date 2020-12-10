import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference'

import Button from '../../components/Button'
import images from '../../assets/images'
import colors from '../../utils/colors';
import preferenceKeys from '../../utils/preferenceKeys';
import { TRAVELER, COMPANY } from '../../utils/constants';

export default class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        const hasSession = Preference.get(preferenceKeys.HAS_SESSION)
        if (hasSession) {
            const userType = Preference.get(preferenceKeys.USER_TYPE)
            if (userType == TRAVELER) navigation.navigate('TravelerStack')
            if (userType == COMPANY) navigation.navigate('TravelAgencyStack')
            else navigation.navigate('AuthStack')
        } //else navigation.navigate('AuthStack')
    }

    render() {
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={[colors.white, colors.primary]}
                    style={StyleSheet.absoluteFill}
                ></LinearGradient>
                <View style={[styles.container, { paddingHorizontal: 30, paddingVertical: 50 }]}>
                    <View style={{ flex: 1 }} />
                    <Image
                        style={{ position: 'absolute', width: 150, height: 150, resizeMode: 'contain' }}
                        source={images.logo}
                    />
                    <Button
                        buttonText={'Get Started'}
                        onPressButton={() => {
                            navigation.replace('AuthStack')
                        }}
                    />
                    <Text style={styles.buttonTextStyle}>{'Terms of use. Cookie Policy\nPrivacy Policy'}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: '100%'
    },
    buttonTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colors.white,
        textAlign: 'center'
    },
});
