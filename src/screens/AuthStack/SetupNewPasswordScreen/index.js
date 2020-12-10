import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    StatusBar,
    StyleSheet,
    Keyboard,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

const { height } = Dimensions.get('screen');

export default class SetupNewPasswordScreen extends Component {
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
            password: '',
            isHiddenPassword: true,
            confirmPassword: '',
            isHiddenConfirmPassword: true,
            showOptionModal: false
        }
    }

    componentDidMount() {

    }

    verifyFields = () => {
        const { password, confirmPassword } = this.state

        if (password === '') {
            alert('New password field is required')
            return false
        } else if (password.length < 6) {
            alert('Password must contain 6 characters')
            return false
        } else if (confirmPassword !== password) {
            alert('Confirm password not matched with new password.')
            return false
        }

        return true
    }

    onSetAsNewPasswordPress = () => {
        const { navigation } = this.props

        if (this.verifyFields()) {
            this.setState({ showOptionModal: true })
            setTimeout(() => {
                this.setState({ showOptionModal: false }, () => {
                    setTimeout(() => {
                        navigation.pop(3)
                    }, 100);
                })
            }, 4000);
        }
    }

    renderOptionModel = () => {
        return (
            <Modal
                animationType="slide"
                presentationStyle="overFullScreen"
                transparent={true}
                visible={this.state.showOptionModal}>
                <View style={styles.modalContainerStyle}>
                    <StatusBar barStyle='dark-content' backgroundColor='#00000060' />
                    <View style={styles.modalStyle}>
                        <View style={styles.modalCheckIcon}>
                            <Image
                                style={{ width: '100%', height: '100%', resizeMode: 'contain', tintColor: colors.white }}
                                source={icons.check}
                            />
                        </View>
                        <Image
                            style={{ alignSelf: 'center', width: 150, height: 150, resizeMode: 'contain', marginVertical: 10 }}
                            source={images.logo}
                        />
                        <Text style={styles.modalSuccessText}>{'New password is successfully set'}</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        const {
            loading,
            email,
            password,
            isHiddenPassword,
            confirmPassword,
            isHiddenConfirmPassword,
        } = this.state
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => navigation.goBack()}
                    hearderText={"Setup New Password"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}>
                    <Image
                        style={{ alignSelf: 'center', width: 150, height: 150, resizeMode: 'contain', marginVertical: 20 }}
                        source={images.logo}
                    />
                    <InputField
                        fieldRef={ref => this.fieldPassword = ref}
                        inputContainer={{ paddingRight: 10 }}
                        value={password}
                        placeholder={'Enter New Password'}
                        secureTextEntry={isHiddenPassword}
                        returnKeyType='next'
                        onChangeText={(text) => {
                            this.setState({ password: text })
                        }}
                        onSubmitEditing={() => {
                            this.fieldConfrimPassword.focus()
                        }}
                        rightIcon={isHiddenPassword ? icons.eyeOpen : icons.eyeClose}
                        rightIconStyle={{ tintColor: '#A4A4A4' }}
                        onRightIconPress={() => {
                            this.setState({ isHiddenPassword: !isHiddenPassword })
                        }}
                    />
                    <InputField
                        fieldRef={ref => this.fieldConfrimPassword = ref}
                        inputContainer={{ paddingRight: 10 }}
                        value={confirmPassword}
                        placeholder={'Confirm New Password'}
                        secureTextEntry={isHiddenConfirmPassword}
                        onChangeText={(text) => {
                            this.setState({ confirmPassword: text })
                        }}
                        onSubmitEditing={() => {
                            Keyboard.dismiss()
                        }}
                        rightIcon={isHiddenConfirmPassword ? icons.eyeOpen : icons.eyeClose}
                        rightIconStyle={{ tintColor: '#A4A4A4' }}
                        onRightIconPress={() => {
                            this.setState({ isHiddenConfirmPassword: !isHiddenConfirmPassword })
                        }}
                    />
                    <View style={{ flex: 1 }} />
                    <Button
                        containerStyle={{ backgroundColor: colors.primary }}
                        buttonTextStyle={{ color: colors.white }}
                        buttonText={'Set as New Password'}
                        onPressButton={() => {
                            this.onSetAsNewPasswordPress()
                        }}
                    />
                </KeyboardAwareScrollView>
                {this.renderOptionModel()}
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
    countryPickerContainer: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        marginTop: 10,
        borderRadius: 10,
        paddingHorizontal: 10
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
    profileImageContainerStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 152,
        height: 152,
        padding: 8,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: colors.grey,
        marginBottom: 20
    },
    modalContainerStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        backgroundColor: '#00000060',
        paddingHorizontal: 30,
    },
    modalStyle: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingBottom: 30
    },
    modalCheckIcon: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderColor: colors.white,
        borderWidth: 5,
        backgroundColor: colors.primary,
        padding: 5,
        marginTop: -50
    },
    modalSuccessText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'center'
    },
});

