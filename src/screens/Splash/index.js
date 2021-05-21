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
                <View style={[styles.container, { paddingHorizontal: 30, paddingTop: 50, paddingBottom: 20 }]}>
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
                    <Text style={[styles.buttonTextStyle, { marginBottom: 20 }]}>{'Terms of use. Cookie Policy\nPrivacy Policy'}</Text>
                    {/* <Text style={styles.poweredByTextStyle}>{'Powered by The App Guys'}</Text> */}
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
    poweredByTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 12,
        color: colors.black,
        textAlign: 'center'
    },
});

