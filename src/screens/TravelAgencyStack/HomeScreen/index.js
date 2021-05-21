import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import Preference from 'react-native-preference'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';
import preferenceKeys from '../../../utils/preferenceKeys';
import { API, requestGetWithToken } from '../../../utils/API';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
        this.state = {
            loading: false,
            acceptedOffers: "0",
            currentUser: currentUser
        }
    }

    componentDidMount() {
        // this.getProfile()
        const { navigation } = this.props
        this.onFocusListener = navigation.addListener('focus', () => {
            this.getProfile()
        });
    }

    getProfile = () => {
        const { navigation } = this.props
        this.setState({ loading: true })
        requestGetWithToken(API.GET_PROFILE).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                this.setState({ currentUser: response.data }, () => {
                    Preference.set(preferenceKeys.CURRENT_USER, response.data)
                    console.log('getProfile-plan', response.data.plan)
                    if (response.data?.payment_status == 0) {
                        Alert.alert(
                            null, "Complete your subcription!",
                            [{
                                text: "OK", onPress: () => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: "PaymentPlanScreen", params: { isFromHome: true, plan: response.data?.plan } }],
                                    });
                                }
                            }],
                            { cancelable: false }
                        )
                    }
                })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
        })
    }

    render() {
        const { navigation } = this.props
        const { currentUser } = this.state
        return (
            <View style={styles.container}>
                <BackGround blueView={'25%'} whiteView={'75%'} />
                <Header
                    onLeftAction={() => {
                        navigation.toggleDrawer()
                    }}
                    leftIcon={icons.menu}
                    hearderText={currentUser?.name}
                    hearderTextStyle={{ width: '80%', textAlign: 'left', color: colors.white, fontSize: currentUser?.name.length > 20 ? 18 : 22 }}
                />
                <View style={styles.containerBoxMain}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("AcceptedListScreen")
                        }} style={styles.containerBox}>
                        <View style={{ width: "100%", height: 50, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, color: colors.grey }}>{'Accepted Offers'}</Text>
                            <Text style={{ fontSize: 20, color: colors.green }}>
                                {currentUser.accepted_offer_count < 10 ? `0${currentUser.accepted_offer_count}` : currentUser.accepted_offer_count}
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
                                <Image source={require('../../../assets/icons/right_arrow.png')} style={{
                                    width: 10,
                                    height: 10,
                                    resizeMode: 'contain'
                                }} />
                            </View>
                        </View>

                        <View style={{
                            height: 40,
                            justifyContent: 'center',
                            backgroundColor: colors.backgroundGrey,
                            borderRadius: 5
                        }}>
                            <Text style={{
                                fontSize: 12,
                                color: colors.green,
                                paddingHorizontal: 20
                            }}>{'Travellers accepted your offer'}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.containerBox}>
                        <View style={{ height: 130, width: "100%" }}>
                            <Image source={require('../../../assets/images/top_traveller.png')} style={{
                                width: "60%",
                                height: 120,
                                position: 'absolute',
                                right: 0,
                                resizeMode: 'contain'
                            }} />
                            <View style={{ width: "100%", height: '100%', justifyContent: 'center', backgroundColor: "transparent" }}>
                                <Text style={{ fontSize: 20, color: colors.black, width: '60%', fontWeight: "bold" }}>{'Explore Top Travelers'}</Text>
                                <Text style={{ fontSize: 9, width: '60%', color: colors.grey }}>{'Explore top travelers width\n good reputation'}</Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('TravelerListScreen', { traveler: "top" })
                                }} style={{ width: 70, backgroundColor: colors.primary, borderRadius: 20, height: 30, alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
                                    <Text style={{ fontSize: 12, color: colors.white }}>{'Explore'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

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
                                <Text style={{ fontSize: 20, color: colors.black, width: '60%', fontWeight: "bold" }}>{'Explore Travelers \n& Send Offers'}</Text>
                                <Text style={{ fontSize: 9, width: '60%', color: colors.grey }}>{'Explore and find some trevelers\nwho are ready to accept offers'}</Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('TravelerListScreen', { traveler: "all" })
                                }} style={{ width: 70, backgroundColor: colors.primary, borderRadius: 20, height: 30, alignItems: "center", justifyContent: 'center', marginTop: 20 }}>
                                    <Text style={{ fontSize: 12, color: colors.white }}>{'Explore'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

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
        flex: 1,
        backgroundColor: colors.mediumGrey,
        height: 1
    },
});

