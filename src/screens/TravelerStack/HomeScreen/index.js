import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';
import preferenceKeys from '../../../utils/preferenceKeys';
import { API, requestGetWithToken } from '../../../utils/API';
import Loader from '../../../components/Loader';
import { ACTIVE_TEXT, IDLE, IDLE_TEXT, THINKING, THINKING_TEXT, TRAVELER } from '../../../utils/constants';

export default class MyJobsScreen extends Component {
    constructor(props) {
        super(props);
        const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
        this.state = {
            loading: false,
            currentUser: currentUser
        }
    }

    componentDidMount() {
        this.getProfile()
        const { navigation } = this.props
        this.onFocusListener = navigation.addListener('focus', () => {
            this.getProfile()
        });
    }

    componentWillUnmount() {
        this.onFocusListener = null
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

    render() {
        const { currentUser, loading } = this.state
        const { profile_status } = currentUser
        const { navigation } = this.props
        let profileStatusColor = colors.green
        let profileStatusTitleText = 'Active'
        let profileStatusText = ACTIVE_TEXT

        if (profile_status == THINKING) {
            profileStatusColor = colors.yellow
            profileStatusTitleText = 'Thinking'
            profileStatusText = THINKING_TEXT
        } else if (profile_status == IDLE) {
            profileStatusColor = colors.red
            profileStatusTitleText = 'Idle'
            profileStatusText = IDLE_TEXT
        }
        return (
            <View style={styles.container}>
                <BackGround blueView={'25%'} whiteView={'75%'} />
                <Header
                    onLeftAction={() => {
                        navigation.toggleDrawer()
                    }}
                    leftButtonContainerStyle={{ padding: 0, paddingLeft: 20 }}
                    leftIcon={currentUser?.image ? { uri: currentUser?.image } : images.dummyProfile}
                    leftButtonIconStyle={[styles.userProfileContainer]}
                    centerComponent={
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: currentUser?.name.length > 15 ? 18 : 20, color: colors.white, fontWeight: 'bold' }}>{`Hi ${currentUser?.name},`}</Text>
                            <Text style={{ fontSize: 14, color: colors.white }}>{'What would you like to do today?'}</Text>
                        </View>
                    }
                />
                <View style={styles.containerBoxMain}>
                    <View style={styles.containerBox}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{ width: "100%", justifyContent: 'center' }}
                            onPress={() => {
                                navigation.navigate('ProfileSetting', { isModeEdit: true, userType: TRAVELER })
                            }}>
                            <Text style={{ fontSize: 12, color: colors.grey }}>{'Your status'}</Text>
                            <Text style={{ fontSize: 20, color: profileStatusColor, fontWeight: 'bold' }}>{profileStatusTitleText}</Text>
                            <View style={{
                                width: 20,
                                height: 20,
                                position: 'absolute',
                                right: 0,
                                top: 15,
                                backgroundColor: colors.grey,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: 'center'
                            }}>
                                <Image source={require('../../../assets/icons/right_arrow.png')} style={{
                                    width: 10,
                                    height: 10,
                                    resizeMode: 'contain'
                                }} />
                            </View>
                            <View style={{ marginTop: 10, height: 40, justifyContent: 'center', backgroundColor: (profileStatusColor + '30'), borderRadius: 5 }}>
                                <Text style={{ fontSize: 12, color: profileStatusColor, paddingHorizontal: 20 }}>
                                    {profileStatusText}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.horizontalDivider} />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{ width: "100%", justifyContent: 'center' }}
                            onPress={() => {
                                navigation.navigate('ReceivedOffersScreen')
                            }}>
                            <Text style={{ fontSize: 12, color: colors.grey }}>{'Received Offers'}</Text>
                            <Text style={{ fontSize: 20, color: colors.green, fontWeight: 'bold' }}>
                                {currentUser.received_offer_count < 10 ? `0${currentUser.received_offer_count}` : currentUser.received_offer_count}
                            </Text>
                            <View style={{
                                width: 20,
                                height: 20,
                                position: 'absolute',
                                right: 0,
                                top: 15,
                                backgroundColor: colors.grey,
                                borderRadius: 10,
                                alignItems: "center",
                                justifyContent: 'center'
                            }}>
                                <Image source={icons.rightArrow} style={{
                                    width: 10,
                                    height: 10,
                                    resizeMode: 'contain'
                                }} />
                            </View>
                            <View style={{
                                marginTop: 10,
                                height: 40,
                                justifyContent: 'center',
                                backgroundColor: colors.backgroundGrey,
                                borderRadius: 5
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: colors.green,
                                    paddingHorizontal: 20
                                }}>{'Offers for you by travel companies'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.containerBox}>
                        <View style={{ height: 130, width: "100%" }}>
                            <Image source={require('../../../assets/images/home_asset.png')} style={{
                                width: "50%",
                                height: 120,
                                position: 'absolute',
                                right: 0,
                                resizeMode: 'contain'
                            }} />
                            <View style={{ width: "100%", height: '100%', justifyContent: 'center', backgroundColor: "transparent" }}>
                                <Text style={{ fontSize: 20, color: colors.black, width: '60%', fontWeight: "bold" }}>{'Explore Travel Companies'}</Text>
                                <Text style={{ fontSize: 9, width: '60%', color: colors.grey }}>{'Check out the existing Travel Companies inside the app.'}</Text>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        navigation.navigate('TravelCompaniesScreen')
                                    }}
                                    style={{ width: 70, backgroundColor: colors.primary, borderRadius: 20, height: 30, alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
                                    <Text style={{ fontSize: 12, color: colors.white }}>{'Explore'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <Loader loading={loading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center'
    },
    containerBoxMain: {
        width: "100%",
        alignItems: 'center'
    },
    containerBox: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        padding: 20,
        marginTop: 10
    },
    buttonTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colors.white,
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
        marginTop: 20,
        marginBottom: 10,
        width: '100%',
        backgroundColor: colors.mediumGrey,
        height: 1
    },
    userProfileContainer: {
        backgroundColor: colors.white,
        margin: 20,
        width: 40,
        height: 40,
        borderRadius: 10,
        resizeMode: 'cover'
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
    },
});

