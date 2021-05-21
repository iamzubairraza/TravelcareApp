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
import stripe from 'tipsi-stripe';
import Preference from 'react-native-preference'
// import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal';

import Button, { ButtonWithIcon } from '../../../components/Button'
import InputField from '../../../components/InputField'
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView'

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

const { width, height } = Dimensions.get('screen');

import {
    BASIC
} from '../../../utils/constants'
import { API, requestPostWithToken, PAYPAL_CLIENT_ID, STRIPE_TEST_KEY } from '../../../utils/API';
import preferenceKeys from '../../../utils/preferenceKeys';

const inputAccessoryViewID = 'PaymentInfoScreen'

export default class PaymentInfoScreen extends Component {
    constructor(props) {
        super(props);

        const { params } = props.route
        let selectedPeckage = {}
        let name = ''
        let cardNumber = ''
        let expiryDate = ''
        let cvv = ''
        let isRememberChecked = false
        let isModeEdit = false
        if (params) {
            if (params.selectedPeckage) selectedPeckage = params.selectedPeckage
            isModeEdit = params.isModeEdit == true
        }

        const cardDetails = Preference.get(preferenceKeys.CARD_DETAILS)
        if (cardDetails) {
            isRememberChecked = true
            name = cardDetails.name
            cardNumber = cardDetails.cardNumber
            expiryDate = cardDetails.expiryDate
            cvv = cardDetails.cvv
        }

        this.state = {
            loading: false,
            paymentLoading: false,
            selectedPeckage: selectedPeckage,
            isModeEdit: isModeEdit,
            name: name,
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            cvv: cvv,
            // name: 'ALI REHMAN',
            // cardNumber: '4242 4242 4242 4242',
            // expiryDate: '12/34',
            // cvv: '1234',
            isRememberChecked: isRememberChecked
        }
    }

    componentDidMount() {
        stripe.setOptions({
            publishableKey: STRIPE_TEST_KEY,
            //merchantId: 'MERCHANT_ID', // Optional
            androidPayMode: 'test'
        })
    }

    verifyFields() {
        const {
            name,
            cardNumber,
            expiryDate,
            cvv,
        } = this.state
        let cardNumberReg = /^[0-9]{4}\ [0-9]{4}\ [0-9]{4}\ [0-9]{1,4}$/
        let expiryDateReg = /^(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/
        let cvvReg = /^[0-9]{3,4}$/
        let cardNameReg = /^[a-zA-Z ]+$/;
        if (cardNumber === "") {
            Alert.alert(
                null, "Cradit card number is required",
                [{ text: "OK", onPress: () => { this.fieldCardNumber.focus() } }]
            )
            return false;
        } else if (cardNumberReg.test(cardNumber) === false) {
            Alert.alert(
                null, "Invalid Card Number Format",
                [{ text: "OK", onPress: () => { this.fieldCardNumber.focus() } }]
            )
            return false;
        } else if (name === "") {
            Alert.alert(
                null, "Name is required",
                [{ text: "OK", onPress: () => { this.fieldName.focus() } }]
            )
            return false;
        } else if (cardNameReg.test(name) === false) {
            Alert.alert(
                null, "Invalid Name Format",
                [{ text: "OK", onPress: () => { this.fieldName.focus() } }]
            )
            return false;
        } else if (expiryDate === "") {
            Alert.alert(
                null, "Expiry date is required",
                [{ text: "OK", onPress: () => { this.fieldExpiryDate.focus() } }]
            )
            return false;
        } else if (expiryDateReg.test(expiryDate) === false) {
            Alert.alert(
                null, "Invalid Date Format",
                [{ text: "OK", onPress: () => { this.fieldExpiryDate.focus() } }]
            )
            return false;
        } else if (cvv === "") {
            Alert.alert(
                null, "Security code is required",
                [{ text: "OK", onPress: () => { this.fieldCVC.focus() } }]
            )
            return false;
        } else if (cvvReg.test(cvv) === false) {
            Alert.alert(
                null, "Invalid security code Format",
                [{ text: "OK", onPress: () => { this.fieldCVC.focus() } }]
            )
            return false;
        } else
            return true;
    }

    onPayAndProceedPress = async () => {
        if (this.verifyFields()) {
            Keyboard.dismiss()
            const {
                name,
                cardNumber,
                expiryDate,
                cvv,
                isRememberChecked
            } = this.state

            const params = {
                name: name,
                number: cardNumber.split(' ').join(''),
                expMonth: parseInt(expiryDate.substring(0, 2)),
                expYear: parseInt(expiryDate.substring(3, 5)),
                cvc: cvv,
            }
            try {
                this.setState({ paymentLoading: true })
                const token = await stripe.createTokenWithCard(params);
                this.setState({ paymentLoading: false })
                console.log("onPayAndProceedPress", "StripeToken:", token.tokenId);
                if (token) {
                    if (isRememberChecked) {
                        Preference.set(preferenceKeys.CARD_DETAILS, { name, cardNumber, expiryDate, cvv })
                    } else {
                        Preference.set(preferenceKeys.CARD_DETAILS, null)
                    }
                    this.addPayment(token.tokenId)
                }
            } catch (error) {
                this.setState({ paymentLoading: false })
                console.log("onPayAndProceedPress", "error:", error);
                Alert.alert('Oops!', error + "")
            }
        }
    }

    addPayment = (token_id) => {
        const { selectedPeckage, isModeEdit } = this.state
        const { navigation } = this.props
        let formData = new FormData();
        formData.append('token', token_id)
        formData.append('plan_id', selectedPeckage.id)
        formData.append('payment_type', 2)
        this.setState({ paymentLoading: true })

        console.log('addPayment', JSON.stringify(formData))

        requestPostWithToken(API.ADD_SUBSCRIPTION, formData).then((response) => {
            this.setState({ paymentLoading: false })
            console.log('addPayment', 'response.status', response.status)
            if (response.status == 200) {
                Alert.alert(
                    null, "Subcription is successful!",
                    [{
                        text: "OK", onPress: () => {
                            if (isModeEdit) navigation.pop(3)
                            else navigation.reset({
                                index: 0,
                                routes: [{ name: "TravelAgencyStack" }],
                            });
                        }
                    }],
                    { cancelable: true }
                )
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ paymentLoading: false })
            console.log('addPayment', 'error', error)
            Alert.alert(null, error + "")
        })
    }

    // onPayPalPress = async () => {
    //     const { selectedPeckage } = this.state
    //     const amount = selectedPeckage.amount?.replace('$', '').replace('/mo', '')
    //     console.log('onPayPalPress', 'amount', amount)

    //     let token = 'sandbox_9dbg82cq_dcpspy2brwdjr3qn'
    //     // const { deviceData } = await requestDeviceData(token);

    //     try {
    //         const {
    //             nonce,
    //             payerId,
    //             email,
    //             firstName,
    //             lastName,
    //             phone
    //         } = await requestOneTimePayment(
    //             token,
    //             {
    //                 amount: amount, // required
    //                 // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
    //                 currency: 'GBP',
    //                 // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
    //                 localeCode: 'en_GB',
    //                 shippingAddressRequired: false,
    //                 userAction: 'commit', // display 'Pay Now' on the PayPal review page
    //                 // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
    //                 intent: 'authorize',
    //             }
    //         );
    //         console.log('onPayPalPress-requestOneTimePayment', 'nonce', nonce)
    //     } catch (error) {
    //         console.log('onPayPalPress-requestOneTimePayment', 'error', error)
    //     }
    // }

    render() {
        const {
            loading,
            selectedPeckage,
            name,
            cardNumber,
            expiryDate,
            cvv,
            isRememberChecked,
            paymentLoading
        } = this.state
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => navigation.goBack()}
                    hearderText={"Plans & Payments"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    extraHeight={160}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', width: '80%', alignSelf: 'center', justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', width: 80 }}>
                                <View style={[styles.stepStype, {}]}>
                                    <Text style={{ color: colors.white, fontWeight: '600' }}>{'1'}</Text>
                                </View>
                                <Text style={{ marginTop: 10 }}>{'Select Plan'}</Text>
                            </View>
                            <View style={{ position: 'absolute', width: (width * 0.80) - (120), height: 1, backgroundColor: colors.primary, marginTop: 15, zIndex: -1 }} />
                            <View style={{ flex: 1 }} />
                            <View style={{ alignItems: 'center', width: 90 }}>
                                <View style={[styles.stepStype, {}]}>
                                    <Text style={{ color: colors.white, fontWeight: '600' }}>{'2'}</Text>
                                </View>
                                <Text style={{ marginTop: 10 }}>{'Payment Info'}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingVertical: 20, marginTop: 20 }}>
                            <Text style={{ fontSize: 23, fontWeight: '600' }}>{'Payment Infromation'}</Text>
                            {/* <Text style={{ color: colors.mediumGrey }}>{'Select a payment method or add one below:'}</Text> */}

                            {/* <ButtonWithIcon
                                leftIcon={icons.payPal}
                                containerStyle={{ backgroundColor: colors.lightGrey, paddingHorizontal: 20 }}
                                buttonTextStyle={{ color: colors.black, fontSize: 14, fontWeight: '600' }}
                                buttonText={'Link PayPal account'}
                                onPressButton={() => {
                                    this.onPayPalPress()
                                    // navigation.pop(2)
                                    // Alert.alert(null, 'Under Development')
                                }}
                            /> */}

                            <Text style={{ fontWeight: '600', marginTop: 20 }}>{'Add Credit Card'}</Text>
                            <InputField
                                fieldRef={ref => this.fieldCardNumber = ref}
                                onParentPress={() => { if (this.fieldCardNumber) this.fieldCardNumber.focus() }}
                                value={cardNumber}
                                leftIcon={icons.card}
                                leftIconStyle={{ tintColor: colors.primary }}
                                placeholder={'Card number'}
                                keyboardType={'number-pad'}
                                maxLength={19}
                                returnKeyType='next'
                                onChangeText={(text) => {
                                    if (/^[0-9 ]*$/.test(text)) {
                                        if (cardNumber.length == 4 && text.length == 5) {
                                            if (text.substr(4, 1) != ' ') {
                                                text = cardNumber + ' ' + text.substr(4, text.length - 1)
                                            }
                                            this.setState({ cardNumber: text })
                                        }
                                        if (cardNumber.length == 9 && text.length == 10) {
                                            if (text.substr(9, 1) != ' ') {
                                                text = cardNumber + ' ' + text.substr(9, text.length - 1)
                                            }
                                            this.setState({ cardNumber: text })
                                        }
                                        if (cardNumber.length == 14 && text.length == 15) {
                                            if (text.substr(14, 1) != ' ') {
                                                text = cardNumber + ' ' + text.substr(14, text.length - 1)
                                            }
                                            this.setState({ cardNumber: text })
                                        }
                                        if (cardNumber.length < text.length && (text.length == 4 || text.length == 9 || text.length == 14)) {
                                            text += ' '
                                            this.setState({ cardNumber: text })
                                        } else {
                                            this.setState({ cardNumber: text })
                                        }
                                    }
                                }}
                                onSubmitEditing={() => {
                                    this.fieldName.focus()
                                }}
                                inputAccessoryViewID={inputAccessoryViewID}
                            />
                            <InputField
                                fieldRef={ref => this.fieldName = ref}
                                onParentPress={() => { if (this.fieldName) this.fieldName.focus() }}
                                value={name}
                                leftIcon={icons.user}
                                leftIconStyle={{ tintColor: colors.primary }}
                                autoCapitalize={'characters'}
                                placeholder={'Name on card'}
                                returnKeyType='next'
                                onChangeText={(text) => {
                                    this.setState({ name: text.toUpperCase() })
                                }}
                                onSubmitEditing={() => {
                                    this.fieldExpiryDate.focus()
                                }}
                                inputAccessoryViewID={inputAccessoryViewID}
                            />
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <InputField
                                    fieldRef={ref => this.fieldExpiryDate = ref}
                                    onParentPress={() => { if (this.fieldExpiryDate) this.fieldExpiryDate.focus() }}
                                    leftIcon={icons.calendar}
                                    leftIconStyle={{ tintColor: colors.primary }}
                                    inputContainer={{ flex: 1, marginRight: 5 }}
                                    value={expiryDate}
                                    placeholder={'Expiry date'}
                                    keyboardType={'number-pad'}
                                    returnKeyType='next'
                                    maxLength={5}
                                    onChangeText={(text) => {
                                        if (/^[0-9\/]*$/.test(text)) {
                                            if (expiryDate.length == 2 && text.length == 3) {
                                                text = expiryDate + '/' + text.substr(2, 1)
                                                this.setState({ expiryDate: text })
                                            } else if (expiryDate.length < text.length && text.length == 2) {
                                                text += '/';
                                                this.setState({ expiryDate: text })
                                            } else { this.setState({ expiryDate: text }) }
                                        }
                                    }}
                                    onSubmitEditing={() => {
                                        this.fieldCVC.focus()
                                    }}
                                    inputAccessoryViewID={inputAccessoryViewID}
                                />
                                <InputField
                                    fieldRef={ref => this.fieldCVC = ref}
                                    onParentPress={() => { if (this.fieldCVC) this.fieldCVC.focus() }}
                                    inputContainer={{ flex: 1, marginLeft: 5, paddingRight: 5 }}
                                    value={cvv}
                                    leftIcon={icons.lock}
                                    leftIconStyle={{ tintColor: colors.primary }}
                                    placeholder={'Security code'}
                                    keyboardType={'number-pad'}
                                    blurOnSubmit={true}
                                    maxLength={4}
                                    onChangeText={(text) => {
                                        if (/^[0-9]*$/.test(text)) {
                                            this.setState({ cvv: text })
                                        }
                                    }}
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    inputAccessoryViewID={inputAccessoryViewID}
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginHorizontal: 10 }}
                                onPress={() => {
                                    this.setState({ isRememberChecked: !isRememberChecked })
                                }}>
                                <View style={[styles.checkCircle, { backgroundColor: isRememberChecked ? colors.green : colors.mediumGrey }]}>
                                    {isRememberChecked &&
                                        <Image
                                            style={{ width: '100%', height: '100%', resizeMode: 'contain', tintColor: colors.white }}
                                            source={icons.check}
                                        />
                                    }
                                </View>
                                <Text style={{ marginLeft: 10, color: isRememberChecked ? colors.green : colors.mediumGrey }}>{'Remember this card'}</Text>
                            </TouchableOpacity>
                            <Button
                                activityIndicatorProps={{ loading: paymentLoading }}
                                containerStyle={{ backgroundColor: colors.green, marginTop: 30 }}
                                buttonTextStyle={{ color: colors.white }}
                                buttonText={'Pay & Proceed'}
                                onPressButton={() => {
                                    this.onPayAndProceedPress()
                                }}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <KeyboardAccessoryView inputAccessoryViewID={inputAccessoryViewID} />
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
    stepStype: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary
    },
    checkCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightBlue,
        padding: 5,
    }
});

