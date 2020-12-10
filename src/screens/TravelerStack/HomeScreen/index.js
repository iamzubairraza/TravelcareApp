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


export default class MyJobsScreen extends Component {
    constructor(props) {
        super(props);
        const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
        const { profileImage, name } = currentUser
        this.state = {
            loading: false,
            user: {
                name: name,
                profileImage: profileImage
            }
        }
    }

    componentDidMount() {

    }

    render() {
        const { user } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <BackGround blueView={'25%'} whiteView={'75%'} />
                <Header
                    onLeftAction={() => {
                        navigation.toggleDrawer()
                    }}
                    leftButtonContainerStyle={{ padding: 0, paddingLeft: 20 }}
                    leftIcon={user.profileImage ? user.profileImage : images.dummyProfile}
                    leftButtonIconStyle={[styles.userProfileContainer]}
                    centerComponent={
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 20, color: colors.white, fontWeight: 'bold' }}>{`Hi ${user.name},`}</Text>
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

                            }}>
                            <Text style={{ fontSize: 12, color: colors.grey }}>{'Your status'}</Text>
                            <Text style={{ fontSize: 20, color: colors.green, fontWeight: 'bold' }}>{'Active'}</Text>
                            <View style={{
                                width: 20,
                                height: 20,
                                position: 'absolute',
                                right: 0,
                                top: 15,
                                backgroundColor: colors.lightGrey,
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
                                }}>{'Actively Loking for travel offers.'}</Text>
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
                            <Text style={{ fontSize: 20, color: colors.green, fontWeight: 'bold' }}>{'07'}</Text>
                            <View style={{
                                width: 20,
                                height: 20,
                                position: 'absolute',
                                right: 0,
                                top: 15,
                                backgroundColor: colors.lightGrey,
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
                                }}>{'Offer for you by travel companies'}</Text>
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

