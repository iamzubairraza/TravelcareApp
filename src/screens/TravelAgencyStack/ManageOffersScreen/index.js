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
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';

export default class ManageOffersScreen extends Component {
    constructor(props) {
        super(props);

        let user = {
            userImage: require('../../../assets/images/top_traveller.png'),
            userName: 'Kevin E.Parker',
            jobTitle: 'Chief of Surgery',
            jobsDone: '80 jobs done',
        }
        const { params } = props.route

        if (params) {
            if (params.user) user = params.user
        }

        this.state = {
            loading: false,
            mainHeading: "Manage Offers",
            mainText: "Manage and organize your existing offers or create a new one.",
            offersList: [
                {
                    offerName: 'Group Travel Promo',
                    desctiption: 'Save up to80% with our group travel promo and it\'s completely free.',
                    sentRecipients: 27,
                    acceptedRecipients: 2,
                },
                {
                    offerName: 'Travel Bundle',
                    desctiption: 'Save up to80% with our group travel promo and it\'s completely free.',
                    sentRecipients: 32,
                    acceptedRecipients: 5,
                },
            ]
        }
    }

    componentDidMount() {

    }

    renderJobItem = (item, index) => {
        const { offersList } = this.state
        const { navigation } = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.offerItemStyle, { marginBottom: index + 1 == offersList.length ? 120 : 15 }]}
                onPress={() => {
                    if (item.offerName === 'Group Travel Promo')
                        navigation.navigate('GroupTravel')
                }}>
                <Text style={{ fontSize: 20, color: colors.green, fontWeight: "bold" }}>{item.offerName}</Text>
                <View style={{ width: '70%' }}>
                    <Text style={{ fontSize: 11, color: colors.grey, marginTop: 5 }}>{item.desctiption}</Text>
                </View>
                <View style={[styles.horizontalDivider, { marginTop: 20, marginBottom: 10 }]} />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 11, color: colors.grey, marginTop: 5 }}>
                        {`Sent to ${item.sentRecipients} recipients,`}
                        <Text style={{ color: colors.green }}>{` ${item.acceptedRecipients} accepted`}</Text>
                    </Text>
                    <View style={{ flex: 1 }} />
                    <View style={{
                        width: 20,
                        height: 20,
                        backgroundColor: colors.transparentGrey,
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
            </TouchableOpacity>
        )
    }

    render() {
        const { user, offersList } = this.state
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
                <View style={{ flex: 1 }}>
                    <View style={{ height: 60, marginBottom: 20 }}>
                        <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                        <Text style={styles.hearderBelowText}>{this.state.mainText}</Text>
                    </View>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={offersList}
                        style={{ marginBottom: 0 }}
                        extraData={offersList}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderJobItem(item, index)
                        }}
                    />
                    <View style={{ position: 'absolute', bottom: 40, right: 40, left: 40, ...styles.shadowElevation }}>
                        <Button
                            containerStyle={{ backgroundColor: colors.primary }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={'Add New Offer'}
                            onPressButton={() => {
                                navigation.navigate('NewOfferScreen')
                            }}
                        />
                    </View>
                </View>
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
    offerItemStyle: {
        backgroundColor: "white",
        // alignItems: 'center',
        // flexDirection: 'row',
        borderRadius: 20,
        padding: 20,
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
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 10.84,

        elevation: 5,
    },
});
