import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import Header from '../../../components/Header'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);

        const { params } = props.route
        let email = ''
        if (params) {
            if (params.email) email = params.email
        }

        this.state = {
            loading: false,
            email: email,
        }
    }

    componentDidMount() {

    }

    verifyFields = () => {
        const { email } = this.state

        let reg = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

        if (email === '') {
            alert('Email field is required')
            return false
        } else if (reg.test(email.trim()) === false) {
            alert('Email not valid')
            return false
        }

        return true
    }

    sendVerificationMailPress = () => {
        const { navigation } = this.props

        if (this.verifyFields()) {
            Keyboard.dismiss()
            navigation.navigate('VerificationScreen')
        }
    }

    render() {
        const { loading, email } = this.state
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => navigation.goBack()}
                    hearderText={"Forgot Password"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 30, paddingVertical: 50 }}>
                    <Image
                        style={{ alignSelf: 'center', width: 150, height: 150, resizeMode: 'contain', marginVertical: 20 }}
                        source={images.logo}
                    />
                    <View style={{ flex: 1 }}>
                        <InputField
                            fieldRef={ref => this.fieldEmail = ref}
                            value={email}
                            autoCapitalize={'none'}
                            placeholder={'Email Address'}
                            textContentType={'emailAddress'}
                            keyboardType={'email-address'}
                            autoCompleteType={'email'}
                            onChangeText={(text) => {
                                this.setState({ email: text })
                            }}
                        />
                        <View style={{ width: '70%', alignSelf: 'center', marginTop: 30 }}>
                            <Text style={{ color: colors.mediumGrey, textAlign: 'center' }}>
                                {'Enter the email address associated with you account'}
                            </Text>
                        </View>
                    </View>
                    <Button
                        containerStyle={{ backgroundColor: colors.primary }}
                        buttonTextStyle={{ color: colors.white }}
                        buttonText={'Send Verification Mail'}
                        onPressButton={() => {
                            this.sendVerificationMailPress()
                        }}
                    />
                </KeyboardAwareScrollView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
        backgroundColor: colors.background,
    },
    buttonTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colors.white,
        textAlign: 'center'
    },
    checkCircle: {
        width: 15,
        height: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7.5,
        marginRight: 5,
        padding: 2.5
    },
    horizontalDivider: {
        flex: 1,
        backgroundColor: colors.mediumGrey,
        height: 1
    },
});

