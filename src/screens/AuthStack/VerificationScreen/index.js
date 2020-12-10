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

export default class VerificationScreen extends Component {
    constructor(props) {
        super(props);

        const { params } = props.route
        let email = ''
        if (params) {
            if (params.email) email = params.email
        }

        this.state = {
            loading: false,
            codeDigOne: '',
            codeDigTwo: '',
            codeDigThree: '',
            codeDigFour: ''
        }
    }

    componentDidMount() {
        if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
    }

    verifyFields = () => {
        const { codeDigOne, codeDigTwo, codeDigThree, codeDigFour } = this.state
        let code = codeDigOne + codeDigTwo + codeDigThree + codeDigFour

        if (code.length < 4) {
            alert('Code is required')
            return false
        }

        return true
    }

    verifyPress = () => {
        const { navigation } = this.props

        if (this.verifyFields()) {
            Keyboard.dismiss()
            // Alert.alert(null, 'Under Development')
            navigation.navigate('SetupNewPasswordScreen')
        }
    }

    render() {
        const { loading, codeDigOne, codeDigTwo, codeDigThree, codeDigFour } = this.state
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => navigation.goBack()}
                    hearderText={"Verification"}
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
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                            <InputField
                                fieldRef={ref => this.fieldCodeDigOne = ref}
                                value={codeDigOne}
                                inputContainer={{ width: 55, paddingHorizontal: 0 }}
                                inputStyle={{ fontSize: 24, textAlign: 'center' }}
                                autoCapitalize={'none'}
                                placeholder={''}
                                caretHidden={true}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    this.setState({ codeDigOne: text })
                                }}
                                onFocus={(event) => {
                                    this.setState({ codeDigOne: '', codeDigTwo: '', codeDigThree: '', codeDigFour: '' })
                                }}
                                onKeyPress={(event) => {
                                    if (event.key == 'Backspace') {
                                        this.setState({ codeDigOne: '' })
                                    } else if (/^[0-9]/g.test(event.key)) {
                                        if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                                    }
                                }}
                            />
                            <InputField
                                fieldRef={ref => this.fieldCodeDigTwo = ref}
                                value={codeDigTwo}
                                inputContainer={{ width: 55, paddingHorizontal: 0 }}
                                inputStyle={{ fontSize: 24, textAlign: 'center' }}
                                autoCapitalize={'none'}
                                placeholder={''}
                                caretHidden={true}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    if (codeDigTwo != '') { this.setState({ codeDigTwo: '' }) }
                                    this.setState({ codeDigTwo: text })
                                }}
                                onFocus={() => {
                                    if (codeDigOne == '') if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
                                    this.setState({ codeDigFour: '', codeDigTwo: '', codeDigThree: '', codeDigFour: '' })
                                }}
                                onKeyPress={(event) => {
                                    if (event.key == 'Backspace') {
                                        this.setState({ codeDigTwo: '' })
                                        if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
                                    } else if (/^[0-9]/g.test(event.key)) {
                                        if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                                    }
                                }}
                            />
                            <InputField
                                fieldRef={ref => this.fieldCodeDigThree = ref}
                                value={codeDigThree}
                                inputContainer={{ width: 55, paddingHorizontal: 0 }}
                                inputStyle={{ fontSize: 24, textAlign: 'center' }}
                                autoCapitalize={'none'}
                                placeholder={''}
                                caretHidden={true}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    if (codeDigThree != '') { this.setState({ codeDigThree: '' }) }
                                    this.setState({ codeDigThree: text })
                                }}
                                onFocus={() => {
                                    if (codeDigTwo == '') if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                                    this.setState({ codeDigThree: '', codeDigFour: '' })
                                }}
                                onKeyPress={(event) => {
                                    if (event.key == 'Backspace') {
                                        this.setState({ codeDigThree: '' })
                                        if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                                    } else if (/^[0-9]/g.test(event.key)) {
                                        if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus()
                                    }
                                }}
                            />
                            <InputField
                                fieldRef={ref => this.fieldCodeDigFour = ref}
                                value={codeDigFour}
                                inputContainer={{ width: 55, paddingHorizontal: 0 }}
                                inputStyle={{ fontSize: 24, textAlign: 'center' }}
                                autoCapitalize={'none'}
                                placeholder={''}
                                caretHidden={true}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    if (codeDigFour != '') { this.setState({ codeDigFour: '' }) }
                                    this.setState({ codeDigFour: text })
                                }}
                                onFocus={() => {
                                    if (codeDigThree == '') if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                                    this.setState({ codeDigFour: '' })
                                }}
                                onKeyPress={(event) => {
                                    if (event.key == 'Backspace') {
                                        this.setState({ codeDigFour: '' })
                                        if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                                    } else if (/^[0-9]/g.test(event.key)) {
                                        Keyboard.dismiss()
                                    }
                                }}
                            />
                        </View>
                        <View style={{ width: '75%', alignSelf: 'center', marginTop: 30 }}>
                            <Text style={{ color: colors.mediumGrey, textAlign: 'center' }}>
                                {'Enter the verification code we sent to your email address'}
                            </Text>
                            <Text
                                style={{ color: colors.lightGreen, textAlign: 'center', marginTop: 20 }}
                                onPress={() => navigation.goBack()}>
                                {'Send verification code to another email?'}
                            </Text>
                        </View>
                    </View>
                    <Button
                        containerStyle={{ backgroundColor: colors.primary }}
                        buttonTextStyle={{ color: colors.white }}
                        buttonText={'Verify'}
                        onPressButton={() => {
                            this.verifyPress()
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

