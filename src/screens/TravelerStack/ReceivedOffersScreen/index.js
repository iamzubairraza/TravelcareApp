import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    Alert,
    TouchableOpacity,
    StyleSheet, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import { Rating, AirbnbRating } from 'react-native-ratings';

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';

export default class ReceivedOfferDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mainHeading: "Received Offers",
            mainText: "7 offers by travel companies, in response to your active status since 06/30/2020",
            receivedOffersList: [
                {
                    offerName: 'Travel in group',
                    companyTitle: 'Booklt.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 3.5,
                    noOfReview: 8256,
                    endingDate: moment().add(72, 'hours'),
                    isClaimed: false,
                    isStateChangeToIdle: false,
                },
                {
                    offerName: 'Travel Promo',
                    companyTitle: 'HotelPlanner.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 4.5,
                    noOfReview: 1631,
                    endingDate: moment().add(48, 'hours'),
                    isClaimed: false,
                    isStateChangeToIdle: false,
                },
                {
                    offerName: 'Travel with Zicasso',
                    companyTitle: 'Zicasso',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 4.5,
                    noOfReview: 1631,
                    endingDate: moment().add(48, 'hours'),
                    isClaimed: false,
                    isStateChangeToIdle: false,
                },
            ]
        }
    }

    componentDidMount() {

    }

    updateStatusTo = (isClaim, index) => {
        let receivedOffersListTemp = this.state.receivedOffersList
        receivedOffersListTemp[index].isClaimed = isClaim
        if (isClaim == false) {
            receivedOffersListTemp[index].isStateChangeToIdle = isClaim
        }
        this.setState({ receivedOffersList: receivedOffersListTemp })
    }

    renderJobItem = (item, index) => {

        let expiresIn = moment(moment(item.endingDate).diff(moment()))
        expiresIn = moment.duration(expiresIn).asHours().toFixed(0)

        const { navigation } = this.props

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.jobItemStyle}
                onPress={() => {
                    navigation.navigate('ReceivedOfferDetailsScreen', { isClaim: !item.isClaimed, index, updateStatusTo: this.updateStatusTo })
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, color: colors.green, fontWeight: "bold" }}>{item.offerName}</Text>
                    </View>
                    <View style={{
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: 'center'
                    }}>
                        <Rating
                            readonly={true}
                            startingValue={item.ratting}
                            ratingCount={5}
                            imageSize={14}
                            style={{ paddingVertical: 0 }}
                        />
                        <Text style={{ fontSize: 11, color: colors.black, marginTop: 5 }}>{item.noOfReview + ' Reviews'}</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: colors.black }}>{item.companyTitle}</Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{item.description}</Text>
                </View>
                <View style={styles.horizontalDivider} />
                <View style={{ width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
                            <View style={[{ width: 15, height: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, item.isClaimed ? { backgroundColor: colors.green, padding: 2 } : {}]}>
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'contain',
                                        tintColor: item.isClaimed ? colors.white : colors.red,
                                    }}
                                    source={item.isClaimed ? icons.check : icons.clockIcon}
                                />
                            </View>
                            <Text style={{ fontSize: 11, color: colors.grey, marginLeft: 10 }}>{'Expires in: ' + expiresIn + ' hrs'}</Text>
                        </View>
                        <View style={{
                            width: 20,
                            height: 20,
                            backgroundColor: colors.transparentGrey,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: 'center'
                        }}>
                            <Image
                                style={{
                                    width: 10,
                                    height: 10,
                                    resizeMode: 'contain'
                                }}
                                source={icons.rightArrow}
                            />
                        </View>
                    </View>
                    {item.isClaimed &&
                        <View style={{}}>
                            <View style={{
                                marginTop: 10,
                                height: 50,
                                justifyContent: 'center',
                                backgroundColor: (colors.yellow + '30'),
                                borderRadius: 5,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: colors.yellow,
                                        paddingHorizontal: 20
                                    }}>
                                        {'Congratulations! for finding your favorite offer'}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20, flexDirection: 'row' }}>
                                {item.isStateChangeToIdle &&
                                    <View style={[{ width: 15, height: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green, padding: 2 }]}>
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                resizeMode: 'contain',
                                                tintColor: colors.white,
                                            }}
                                            source={icons.check}
                                        />
                                    </View>
                                }
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.mediumGrey,
                                    paddingHorizontal: 20
                                }}>
                                    {item.isStateChangeToIdle ?
                                        'Profile status changed to idle'
                                        :
                                        'Change profile status to Idle(Not Looking for more offers)?'
                                    }
                                </Text>
                            </View>
                            <Button
                                containerStyle={{ backgroundColor: item.isStateChangeToIdle ? colors.lightBlue : colors.green }}
                                buttonTextStyle={{ color: item.isStateChangeToIdle ? colors.primary : colors.white }}
                                buttonText={item.isStateChangeToIdle ? 'Settings' : 'Yes - Change to Idle'}
                                onPressButton={() => {
                                    if (item.isStateChangeToIdle == false) {
                                        let receivedOffersListTemp = this.state.receivedOffersList
                                        receivedOffersListTemp[index].isStateChangeToIdle = true
                                        this.setState({ receivedOffersList: receivedOffersListTemp })
                                    } else {
                                        navigation.navigate('ProfileSetting')
                                    }
                                }}
                            />
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { receivedOffersList } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <BackGround blueView={'30%'} whiteView={'80%'} />
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={{ height: 80 }}>
                    <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                    <Text style={styles.hearderBelowText}>{this.state.mainText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={receivedOffersList}
                        style={{ marginBottom: 0 }}
                        extraData={receivedOffersList}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderJobItem(item, index)
                        }}
                    />
                </View>
            </View>
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
        marginVertical: 10,
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
});

