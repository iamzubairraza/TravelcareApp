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
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView'

import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

import {
    TRAVELER,
    COMPANY,
} from '../../../utils/constants'
import { API, requestPostWithToken } from '../../../utils/API';
import images from '../../../assets/images';

const { width, height } = Dimensions.get('screen');
const inputAccessoryViewID = 'NewOfferScreen'
export default class NewOfferScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            offerName: '',
            shortDescription: '',
            fullDescription: '',
            showSuccessModal: false
        }
    }

    componentDidMount() {

    }

    verifyFields = () => {
        const {
            offerName,
            shortDescription,
            fullDescription
        } = this.state

        if (offerName === '') {
            Alert.alert(null, 'Offer name is required',
                [{ text: 'OK', onPress: () => { this.fieldOfferName.focus() } }]
            )
            return false
        } else if (shortDescription === '') {
            Alert.alert(null, 'Short description is required',
                [{ text: 'OK', onPress: () => { this.fieldShortDescription.focus() } }]
            )
            return false
        } else if (fullDescription === '') {
            Alert.alert(null, 'Full description is required',
                [{ text: 'OK', onPress: () => { this.fieldDesctiption.focus() } }]
            )
            return false
        }

        return true
    }

    onConfirmPress = () => {
        const { navigation, route } = this.props
        const {
            offerName,
            shortDescription,
            fullDescription
        } = this.state

        if (this.verifyFields()) {
            Keyboard.dismiss()
            let formData = new FormData();
            formData.append('offer_name', offerName)
            formData.append('short_description', shortDescription)
            formData.append('full_description', fullDescription)
            this.setState({ loading: true })
            requestPostWithToken(API.CREATE_OFFER, formData).then((response) => {
                this.setState({ loading: false })
                console.log('onConfirmPress', 'requestPost-response', response);
                if (response.status == 200) {
                    const { updateOffers } = route.params
                    if (updateOffers && typeof updateOffers == 'function') updateOffers()
                    Alert.alert(null, response.message,
                        [{ text: 'OK', onPress: () => { navigation.goBack() } }]
                    )
                } else {
                    Alert.alert(null, response.message)
                }
            }).catch((error) => {
                this.setState({ loading: false })
                console.log('onConfirmPress', 'error', error)
                Alert.alert(null, 'Something went wrong')
            })
        }
    }

    render() {
        const {
            loading,
            offerName,
            shortDescription,
            fullDescription
        } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    hearderText={"New Offer"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    // bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}>
                    <View style={{ flex: 1 }}>
                        <InputField
                            fieldRef={ref => this.fieldOfferName = ref}
                            onParentPress={() => { if (this.fieldOfferName) this.fieldOfferName.focus() }}
                            value={offerName}
                            placeholder={'Offer name'}
                            textContentType={'name'}
                            returnKeyType='next'
                            onChangeText={(text) => {
                                this.setState({ offerName: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldShortDescription.focus()
                            }}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                        <InputField
                            fieldRef={ref => this.fieldShortDescription = ref}
                            onParentPress={() => { if (this.fieldShortDescription) this.fieldShortDescription.focus() }}
                            value={shortDescription}
                            placeholder={'Short description'}
                            returnKeyType='next'
                            onChangeText={(text) => {
                                this.setState({ shortDescription: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldDesctiption.focus()
                            }}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                        <InputField
                            fieldRef={ref => this.fieldDesctiption = ref}
                            onParentPress={() => { if (this.fieldDesctiption) this.fieldDesctiption.focus() }}
                            inputContainer={{ height: 250 }}
                            inputStyle={{ height: '90%' }}
                            value={fullDescription}
                            multiline={true}
                            placeholder={'Full description'}
                            onChangeText={(text) => {
                                this.setState({ fullDescription: text })
                            }}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                    </View>
                    <Button
                        activityIndicatorProps={{ loading: loading }}
                        containerStyle={{ backgroundColor: colors.green, marginBottom: 70 }}
                        buttonTextStyle={{ color: colors.white }}
                        buttonText={'Confirm'}
                        onPressButton={() => {
                            this.onConfirmPress()
                        }}
                    />
                    <KeyboardAccessoryView inputAccessoryViewID={inputAccessoryViewID} />
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
    horizontalDivider: {
        flex: 1,
        backgroundColor: colors.mediumGrey,
        height: 1
    },
});

