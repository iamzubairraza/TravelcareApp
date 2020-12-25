import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
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

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default class ReceivedOffersScreen extends Component {
    constructor(props) {
        super(props);

        const { params } = props.route
        let index = -1
        let isClaim = true
        if (params) {
            if (!_.isNil(params.index)) index = params.index
            if (!_.isNil(params.isClaim)) isClaim = params.isClaim
        }

        this.state = {
            loading: false,
            offerName: 'Travel Promo',
            companyTitle: 'HotelPlanner.com',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            showLess: true,
            isClaim: isClaim,
            index: index
        }
    }

    componentDidMount() {

    }

    render() {
        const { offerName, companyTitle, description, showLess, isClaim, index } = this.state
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
                            style={{ width: 150, height: 150, resizeMode: 'cover' }}
                            source={images.logo}
                        />
                        <Text style={{ color: colors.black, fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>{'Offer Received'}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 30 }}>
                        <View style={{ flex: 1, height: showLess ? 300 : 'auto', overflow: showLess ? 'hidden' : 'visible' }}>
                            <Text style={{ color: colors.green, fontSize: 20, fontWeight: 'bold' }}>{offerName}</Text>
                            <Text style={{ fontSize: 14, color: colors.black, marginTop: 10 }}>{companyTitle}</Text>
                            <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{description}</Text>
                            <Text style={{ fontSize: 14, color: colors.black, marginTop: 15 }}>{'Offer Full Description'}</Text>
                            <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 10 }}>{description}</Text>
                            <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 10 }}>{description}</Text>
                            <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 10 }}>{description}</Text>
                            <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 10 }}>{description}</Text>
                            <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 10 }}>{description}</Text>
                            <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 10 }}>{description}</Text>
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
                            containerStyle={{ backgroundColor: isClaim ? colors.green : colors.red, marginBottom: 70 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={isClaim ? 'Claim' : 'Cancel Claim'}
                            onPressButton={() => {
                                const { params } = this.props.route
                                if (params) {
                                    const { updateStatusTo } = params
                                    if (updateStatusTo && typeof updateStatusTo == 'function') {
                                        updateStatusTo(isClaim, index)
                                    }
                                }
                                navigation.goBack()
                            }}
                        />
                    </View>
                </ScrollView>
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

