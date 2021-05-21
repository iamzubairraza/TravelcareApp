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
import DatePicker from 'react-native-date-picker'
import moment from 'moment'

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

        this.lock = false

        const { params } = props.route
        let isModeEdit = false
        let offerName = ''
        let offerId = -1
        let shortDescription = ''
        let fullDescription = ''
        let offerEndDate = new Date()
        let offerEndDateForAPI = ''

        if (params) {
            if (params.isModeEdit) {
                isModeEdit = params.isModeEdit
                if (params.offer) {
                    const { offer } = params
                    offerId = offer.id
                    offerName = offer.title
                    shortDescription = offer.short_description
                    fullDescription = offer.full_description
                    console.log('offer.end_date', offer.end_date)
                    offerEndDate = new Date(moment(offer.end_date, "YYYY-MM-DD"))
                    offerEndDateForAPI = new Date(moment(offer.end_date, "YYYY-MM-DD"))
                }
            }
        }

        this.state = {
            loading: false,
            isModeEdit: isModeEdit,
            offerId: offerId,
            offerName: offerName,
            shortDescription: shortDescription,
            fullDescription: fullDescription,
            showSuccessModal: false,
            offerEndDate: offerEndDate,
            offerEndDateForAPI: offerEndDateForAPI,
            showDatePicker: false,
        }
    }

    componentDidMount() {
        this.keyboardOpenListener = Keyboard.addListener("keyboardDidShow", (payload) => {
            this.setState({ showDatePicker: false, offerEndDate: this.state.offerEndDateForAPI })
        })
    }

    componentWillUnmount() {
        if (this.keyboardOpenListener) this.keyboardOpenListener.remove()
    }

    verifyFields = () => {
        const {
            offerName,
            shortDescription,
            fullDescription,
            offerEndDateForAPI
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
        } else if (offerEndDateForAPI === '') {
            Alert.alert(null, 'Offer end date is required',
                [{ text: 'OK', onPress: () => { } }]
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
            isModeEdit,
            offerId,
            offerName,
            shortDescription,
            fullDescription,
            offerEndDateForAPI
        } = this.state

        if (this.lock) return
        else if (this.verifyFields()) {
            Keyboard.dismiss()
            this.lock = true
            let formData = new FormData();
            formData.append('offer_name', offerName)
            formData.append('short_description', shortDescription)
            formData.append('full_description', fullDescription)
            formData.append('end_date', moment(offerEndDateForAPI).format('YYYY-MM-DD'))
            this.setState({ loading: true })
            let URL = ''
            if (isModeEdit) {
                formData.append('offer_id', offerId)
                URL = API.UPDATE_OFFER
            } else {
                URL = API.CREATE_OFFER
            }
            requestPostWithToken(URL, formData).then((response) => {
                this.lock = false
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
                this.lock = false
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
            fullDescription,
            offerEndDate,
            offerEndDateForAPI,
            showDatePicker,
            isModeEdit
        } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    hearderText={isModeEdit ? "Edit Offer" : "New Offer"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    // bounces={false}
                    // keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 15, paddingTop: 20, paddingBottom: 50 }}>
                    <View style={{ flex: 1, overflow: 'visible', marginHorizontal: 15, zIndex: 2 }}>
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
                            maxLength={100}
                            onChangeText={(text) => {
                                this.setState({ shortDescription: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldDesctiption.focus()
                            }}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.datePickerInputContainer, styles.shadowElevation]}
                            onPress={() => {
                                this.setState({ showDatePicker: true })
                            }}>
                            <Text style={{ color: offerEndDateForAPI ? colors.black : colors.mediumGrey }}>{offerEndDateForAPI ? moment(offerEndDateForAPI).format('YYYY-MM-DD') : 'Select End Date'}</Text>
                        </TouchableOpacity>
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
                    <View style={{ marginHorizontal: 15 }}>
                        <Button
                            activityIndicatorProps={{ loading: loading }}
                            containerStyle={{ backgroundColor: colors.green, marginBottom: 70 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={isModeEdit ? 'Save' : 'Confirm'}
                            onPressButton={() => {
                                this.onConfirmPress()
                            }}
                        />
                    </View>
                    <KeyboardAccessoryView inputAccessoryViewID={inputAccessoryViewID} />
                </KeyboardAwareScrollView>
                {showDatePicker &&
                    <View style={[styles.datePickerContainer]}>
                        <View style={[{ backgroundColor: colors.lightGrey, width: '100%', borderRadius: 10, alignItems: 'center' }, styles.shadowElevation]}>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', height: 55, alignItems: 'center' }}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[{ flex: 1, marginRight: 5 }, styles.datePickerButton]}
                                    onPress={() => {
                                        this.setState({ showDatePicker: false, offerEndDate: offerEndDateForAPI })
                                    }}>
                                    <Text style={{ color: colors.red }}>{'Cancel'}</Text>
                                </TouchableOpacity>
                                <View style={{ height: 30, width: 1, backgroundColor: colors.mediumGrey }} />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[{ flex: 1, marginLeft: 5 }, styles.datePickerButton]}
                                    onPress={() => {
                                        this.setState({ showDatePicker: false, offerEndDateForAPI: offerEndDate })
                                    }}>
                                    <Text style={{ color: colors.primary }}>{'Confirm'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderBottomColor: colors.mediumGrey, borderBottomWidth: 1, width: '90%' }} />
                            <View style={{ width: '100%', alignItems: 'center', overflow: 'hidden' }}>
                                <DatePicker
                                    mode={'date'}
                                    date={offerEndDate}
                                    onDateChange={(date) => {
                                        console.log('date', date)
                                        this.setState({ offerEndDate: date })
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                }
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
    datePickerInputContainer: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        marginTop: 10,
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    datePickerContainer: {
        width: '100%',
        alignItems: 'center',
        borderRadius: 20,
        // backgroundColor: colors.lightGrey,
        paddingHorizontal: 30,
    },
    datePickerButton: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGrey,
        borderRadius: 10,
        paddingHorizontal: 15,
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
    }
});

