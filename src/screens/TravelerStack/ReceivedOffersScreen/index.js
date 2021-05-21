import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
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
import BackGround from '../../../components/HomeBackGround';
import Loader from '../../../components/Loader';

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import { API, requestGetWithToken, requestPostWithToken } from '../../../utils/API';
import preferenceKeys from '../../../utils/preferenceKeys';

export default class ReceivedOfferDetailsScreen extends Component {
    constructor(props) {
        super(props);
        const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
        this.state = {
            loading: false,
            currentUser: currentUser,
            mainHeading: "Received Offers",
            mainText: " offers by travel companies, in response to your active status since ",
            receivedOffersList: [],
            activeDate: moment().format('DD/MM/YYYY')
        }
    }

    componentDidMount() {
        this.getTravelerReceivedOffers()
    }

    getTravelerReceivedOffers = () => {
        this.setState({ loading: true })
        requestGetWithToken(API.GET_TRAVELER_RECEIVED_OFFERS).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('getTravelerReceivedOffers', 'response', response)
                if (response.data) {
                    this.setState({ receivedOffersList: response.data?.received_offers, activeDate: moment(response.data?.active_date, 'YYYY-MM-DD').format('DD/MM/YYYY') })
                }
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getTravelerReceivedOffers', 'error', error)
        })
    }

    changeTravelerProfileStatus = () => {
        this.setState({ loading: true })
        let formData = new FormData();
        formData.append('profile_status', "3")
        requestPostWithToken(API.CHANGE_TRAVELER_PROFILE_STATUS, formData).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('changeTravelerProfileStatus', 'response', response)
                Alert.alert(null, response.message,
                    [{
                        text: 'OK', onPress: () => {
                            this.getProfile()
                        }
                    }],
                    { cancelable: false }
                )
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getTravelerReceivedOffers', 'error', error)
        })
    }

    getProfile = () => {
        // this.setState({ loading: true })
        requestGetWithToken(API.GET_PROFILE).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('getProfile', 'response', response)
                this.setState({ currentUser: response.data }, () => {
                    Preference.set(preferenceKeys.CURRENT_USER, response.data)
                })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getProfile', 'error', error)
        })
    }

    renderJobItem = (item, index, isIdle) => {
        const { navigation } = this.props
        const expiresIn = moment(item.offers.end_date).endOf('hours').fromNow()

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.jobItemStyle}
                onPress={() => {
                    navigation.navigate('ReceivedOfferDetailsScreen', { offer: item, updateOffers: this.getTravelerReceivedOffers })
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, color: colors.green, fontWeight: "bold" }}>{item.offers?.title}</Text>
                    </View>
                    <View style={{
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: 'center'
                    }}>
                        <Rating
                            readonly={true}
                            startingValue={item.rating ? item.rating : 0}
                            ratingCount={5}
                            imageSize={14}
                            style={{ paddingVertical: 0 }}
                        />
                        <Text style={{ fontSize: 11, color: colors.black, marginTop: 5 }}>
                            {(item.reviews ? item.reviews : 0) + ' Reviews'}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '100%' }}>
                    <Text style={{ fontSize: 14, color: colors.black }}>{item.offers?.company_name}</Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{item.offers?.short_description}</Text>
                </View>
                <View style={styles.horizontalDivider} />
                <View style={{ width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
                            <View style={[{ width: 15, height: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, item.status == 1 ? { backgroundColor: colors.green, padding: 2 } : {}]}>
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'contain',
                                        tintColor: item.status == 1 ? colors.white : colors.red,
                                    }}
                                    source={item.status == 1 ? icons.check : icons.clockIcon}
                                />
                            </View>
                            <Text style={{ fontSize: 11, color: colors.grey, marginLeft: 10 }}>{'Expires: ' + expiresIn}</Text>
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
                    {item.status == 1 &&
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
                                {isIdle &&
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
                                    {isIdle ?
                                        'Profile status changed to idle'
                                        :
                                        'Change profile status to Idle(Not Looking for more offers)?'
                                    }
                                </Text>
                            </View>
                            <Button
                                containerStyle={{ backgroundColor: isIdle ? colors.lightBlue : colors.green }}
                                buttonTextStyle={{ color: isIdle ? colors.primary : colors.white }}
                                buttonText={isIdle ? 'Settings' : 'Yes - Change to Idle'}
                                onPressButton={() => {
                                    if (isIdle) {
                                        navigation.navigate('ProfileSetting', {
                                            isModeEdit: true,
                                            onBackPress: () => {
                                                this.getProfile()
                                            }
                                        })
                                    } else {
                                        this.changeTravelerProfileStatus()
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
        const { navigation } = this.props
        const { loading, receivedOffersList, mainText, activeDate, currentUser } = this.state
        const { profile_status } = currentUser
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
                <View style={{ minHeight: 80, paddingHorizontal: 40 }}>
                    <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                    <Text style={styles.hearderBelowText}>{`${receivedOffersList.length}${mainText}${activeDate}`}</Text>
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
                            return this.renderJobItem(item, index, profile_status == 3)
                        }}
                    />
                </View>
                <Loader loading={loading} />
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
    },
    hearderBelowText: {
        width: '80%',
        fontSize: 12,
        color: colors.white,
        marginTop: 5,
    },
});

