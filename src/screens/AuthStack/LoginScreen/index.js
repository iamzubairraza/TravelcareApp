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
import Preference from 'react-native-preference'

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import preferenceKeys from '../../../utils/preferenceKeys';

import {
    TRAVELER,
    COMPANY,
    ACTIVE,
} from '../../../utils/constants'

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            password: '',
            showPassword: true,
            rememberPassword: true,
            selectedLogin: TRAVELER
        }
    }

    componentDidMount() {

    }

    verifyFields = () => {
        const { email, password } = this.state

        let reg = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

        if (email === '') {
            alert('Email field is required')
            return false
        } else if (reg.test(email.trim()) === false) {
            alert('Email not valid')
            return false
        } else if (password === '') {
            alert('Password field is required')
            return false
        }

        return true
    }

    onLoginPress = () => {
        const { navigation } = this.props
        const { selectedLogin, email, password } = this.state

        if (this.verifyFields()) {
            Preference.set(preferenceKeys.HAS_SESSION, true)
            Preference.set(preferenceKeys.USER_TYPE, selectedLogin)
            Preference.set(preferenceKeys.CURRENT_USER, {
                email,
                password,
                name: 'Dummy Name',
                profileStatus: ACTIVE,
                userType: selectedLogin,
                phoneNumber: '1234567',
                selectedServices: [
                    { id: 1, name: 'Doctor', isChecked: false },
                ],
                selectedTypeOfOrganization: { id: 1, name: 'Hospital', isChecked: false },
                selectedCountryCode: {
                    callingCode: [
                        "45"
                    ],
                    flag: "flag-dk",
                    name: {
                        common: "Denmark",
                    }
                },
                profileImage: null
            })
            if (selectedLogin == COMPANY) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'TravelAgencyStack' }],
                });
            } else {
                // Alert.alert(null, 'Under Development')
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'TravelerStack' }],
                });
            }
        }
    }

    render() {
        const { loading, email, password, showPassword, rememberPassword, selectedLogin } = this.state
        const { navigation } = this.props

        return (
            <View style={styles.container}>
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
                    <InputField
                        fieldRef={ref => this.fieldEmail = ref}
                        value={email}
                        autoCapitalize={'none'}
                        placeholder={'Email Address'}
                        textContentType={'emailAddress'}
                        keyboardType={'email-address'}
                        autoCompleteType={'email'}
                        returnKeyType='next'
                        onChangeText={(text) => {
                            this.setState({ email: text })
                        }}
                        onSubmitEditing={() => {
                            this.fieldPassword.focus()
                        }}
                    />
                    <InputField
                        fieldRef={ref => this.fieldPassword = ref}
                        inputContainer={{ paddingRight: 10 }}
                        value={password}
                        placeholder={'Password'}
                        secureTextEntry={showPassword}
                        textContentType={'password'}
                        onChangeText={(text) => {
                            this.setState({ password: text })
                        }}
                        onSubmitEditing={() => {
                            Keyboard.dismiss()
                        }}
                        rightIcon={showPassword ? icons.eyeOpen : icons.eyeClose}
                        rightIconStyle={{ tintColor: '#A4A4A4' }}
                        onRightIconPress={() => {
                            this.setState({ showPassword: !showPassword })
                        }}
                    />
                    <Button
                        containerStyle={{ backgroundColor: colors.primary }}
                        buttonTextStyle={{ color: colors.white }}
                        buttonText={'Login ' + (selectedLogin == TRAVELER ? 'Traveler' : 'Company')}
                        onPressButton={() => {
                            this.onLoginPress()
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={[styles.checkCircle, { backgroundColor: rememberPassword ? colors.lightGreen : colors.mediumGrey }]}
                                onPress={() => {
                                    this.setState({ rememberPassword: !rememberPassword })
                                }}>
                                {rememberPassword &&
                                    <Image
                                        style={{ width: '100%', height: '100%', resizeMode: 'contain', tintColor: colors.white }}
                                        source={icons.check}
                                    />
                                }
                            </TouchableOpacity>
                            <Text>{'Remember Password'}</Text>
                        </View>
                        <Text
                            style={{ color: colors.red }}
                            onPress={() => {
                                navigation.navigate('ForgotPasswordScreen', { email })
                            }}>
                            {'Forget Password'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, }}>
                        <View style={styles.horizontalDivider} />
                        <Text style={{ marginHorizontal: 20, color: colors.black }}>{'OR'}</Text>
                        <View style={styles.horizontalDivider} />
                    </View>
                    <Button
                        containerStyle={{ backgroundColor: colors.transparent, borderColor: selectedLogin == TRAVELER ? colors.primary : colors.mediumGrey, borderWidth: 1, marginTop: 40, marginBottom: 0 }}
                        buttonTextStyle={{ color: colors.mediumGrey }}
                        buttonText={'Login Traveler'}
                        onPressButton={() => {
                            this.setState({ selectedLogin: TRAVELER })
                        }}
                    />
                    <Button
                        containerStyle={{ backgroundColor: colors.transparent, borderColor: selectedLogin == COMPANY ? colors.primary : colors.mediumGrey, borderWidth: 1, marginTop: 10, marginBottom: 0 }}
                        buttonTextStyle={{ color: colors.mediumGrey }}
                        buttonText={'Login Company'}
                        onPressButton={() => {
                            this.setState({ selectedLogin: COMPANY })
                        }}
                    />
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.mediumGrey }}>
                            {'Don\'t have an account?'}
                            <Text
                                style={{ color: colors.primary, fontWeight: 'bold' }}
                                onPress={() => {
                                    // Alert.alert(null, 'Under Development')
                                    navigation.navigate('SignUpScreen', { userType: selectedLogin, email })
                                }}>
                                {` Sign Up ${selectedLogin == TRAVELER ? 'Traveler' : 'Company'}`}
                            </Text>
                        </Text>
                    </View>
                </KeyboardAwareScrollView>
            </View>
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

