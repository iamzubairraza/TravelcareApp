import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    ScrollView,
    StyleSheet, FlatList,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import _ from 'lodash'

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import { API, requestGetWithToken, requestPostWithToken } from '../../../utils/API';

import Button from '../../../components/Button'
import Header from '../../../components/Header';
import BackGround from '../../../components/HomeBackGround';
import InputField from '../../../components/InputField'
import Loader from '../../../components/Loader';

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default class ReceivedOffersScreen extends Component {
    constructor(props) {
        super(props);

        const { params } = props.route
        let offer = {}
        let companyName = ""
        if (params) {
            if (params.offer) offer = params.offer
            if (params.companyName) companyName = params.companyName
        }

        this.state = {
            loading: false,
            showLess: true,
            offer: offer,
            companyName: companyName,
            showMoreVisibleButton: false,
            titleText: 'Offer Received'
        }
    }

    componentDidMount() {
        this.getTravelerOfferDetails()
    }

    getTravelerOfferDetails = () => {
        const { offer, companyName } = this.state
        this.setState({ loading: true })
        // console.log('getTravelerOfferDetails', '${offer?.id}', offer?.offers?.id);
        let id = -1
        if (offer?.offer_id) id = offer?.offer_id
        else id = offer.id
        requestGetWithToken(`${API.GET_TRAVELER_OFFER_DETAILS}/${id}`).then((response) => {
            this.setState({ loading: false })
            console.log('getTravelerOfferDetails', 'requestPost-response', response.data);
            if (response.status == 200) {
                if (response.data?.offers) {
                    this.setState({ offer: response.data })
                } else {
                    this.setState({ titleText: 'Receive Offer', offer: { offer_id: id, status: "0", offers: { ...response.data, company_name: companyName } } })
                }
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getTravelerOfferDetails', 'error', error)
            Alert.alert(null, 'Something went wrong')
        })
    }

    onClaimOrCancelOffer = (isClaimed) => {
        const { navigation, route } = this.props
        const { offer } = this.state
        let formData = new FormData();
        let URL = ""
        if (isClaimed) {
            URL = API.TRAVELER_CANCEL_OFFER_CLAIM
            formData.append('id', offer?.id)
        } else {
            formData.append('offer_id', offer?.offer_id)
            URL = API.TRAVELER_CLAIM_OFFER
        }
        this.setState({ loading: true })
        requestPostWithToken(URL, formData).then((response) => {
            this.setState({ loading: false })
            console.log('onClaimOrCancelOffer', 'requestPost-response', response);
            if (response.status == 200) {
                Alert.alert(null, response.message,
                    [{
                        text: 'OK', onPress: () => {
                            const { updateOffers } = route.params
                            if (updateOffers && typeof updateOffers == 'function') updateOffers()
                            navigation.goBack()
                        }
                    }]
                )
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('onClaimOrCancelOffer', 'error', error)
            Alert.alert(null, 'Something went wrong')
        })
    }

    render() {
        const { loading, showLess, offer, showMoreVisibleButton, titleText } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.black }}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{ flexGrow: 1 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            style={{ width: 150, height: 150, resizeMode: 'contain' }}
                            source={images.claim}
                        />
                        <Text style={{ color: colors.black, fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>{titleText}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 30 }}>
                        <View
                            style={{ flex: 1, height: showLess ? !showMoreVisibleButton ? 'auto' : 300 : 'auto', overflow: showLess ? 'hidden' : 'visible' }}
                            onLayout={(event) => {
                                const textViewHeight = event.nativeEvent.layout.height
                                if (textViewHeight >= 300) {
                                    this.setState({ showMoreVisibleButton: true })
                                }
                            }}>
                            <Text style={{ color: colors.green, fontSize: 20, fontWeight: 'bold' }}>{offer?.offers?.title}</Text>
                            <Text style={{ fontSize: 14, color: colors.black, marginTop: 10 }}>{offer?.offers?.company_name}</Text>
                            <Text style={{ fontSize: 12, color: colors.mediumGrey, marginTop: 5 }}>{offer?.offers?.short_description}</Text>
                            <Text style={{ fontSize: 14, color: colors.black, marginTop: 15 }}>{'Offer Full Description'}</Text>
                            <Text style={{ fontSize: 12, color: colors.mediumGrey, marginTop: 10 }}>{offer?.offers?.full_description}</Text>
                            {showMoreVisibleButton &&
                                <LinearGradient
                                    colors={[colors.transparent, '#f2f2f2']}
                                    style={{ width: '100%', position: 'absolute', bottom: showLess ? 0 : -40, zIndex: 99 }}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}
                                        onPress={() => this.setState({ showLess: !showLess })}>
                                        <Text style={{ fontSize: 14, color: colors.primary }}>{showLess ? 'See More' : 'See Less'}</Text>
                                        <Image
                                            style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: colors.primary, marginLeft: 5, transform: showLess ? [{ rotate: '90deg' }] : [{ rotate: '270deg' }] }}
                                            source={icons.rightArrow}
                                        />
                                    </TouchableOpacity>
                                </LinearGradient>
                            }
                        </View>
                        <View style={{
                            marginTop: 40,
                            height: 50,
                            justifyContent: 'center',
                            backgroundColor: colors.lightBlue,
                            borderRadius: 5,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.primary,
                                    paddingHorizontal: 20
                                }}>{'Payment proceedings whilst on-site meeting.'}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {

                                }}>
                                <Image
                                    style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: colors.primary, marginHorizontal: 15 }}
                                    source={icons.dotsMenu}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.horizontalDivider, { width: SCREEN_WIDTH, alignSelf: 'center' }]} />
                        <Button
                            containerStyle={{ backgroundColor: offer?.status == 1 ? colors.red : colors.green, marginBottom: 70 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={offer?.status == 1 ? 'Cancel Claim' : 'Claim'}
                            onPressButton={() => {
                                this.onClaimOrCancelOffer(offer?.status == 1)
                            }}
                        />
                    </View>
                </ScrollView>
                <Loader loading={loading} />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.transparentGrey,
        // alignItems: 'center'
    },
    jobItemStyle: {
        backgroundColor: "white",
        alignItems: 'center',
        // flexDirection: 'row',
        borderRadius: 20,
        padding: 20,
        paddingBottom: 15,
        marginBottom: 15,
        marginHorizontal: 15,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    horizontalDivider: {
        width: '100%',
        marginVertical: 30,
        marginBottom: 20,
        backgroundColor: colors.mediumGrey,
        height: 1
    },
    hearderText: {
        width: '100%',
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
        marginLeft: 40
    },
    hearderBelowText: {
        width: '80%',
        fontSize: 12,
        color: colors.white,
        marginLeft: 40,
        marginTop: 5,
    },
    shadowElevation: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    }
});

