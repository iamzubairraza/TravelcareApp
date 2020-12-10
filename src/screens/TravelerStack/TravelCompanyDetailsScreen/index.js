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



export default class TravelCompanyDetailsScreen extends Component {
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
            user: user,
            anyItemSelected: false,
            displayBottomSheet: false,
            companyTitle: 'HotelPlanner.com',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\n Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            ratting: 4.5,
            noOfReview: 1631,
            myJobHistoryList: [
                {
                    offerName: 'Group Travel Promo',
                    desctiption: 'Save up to80% with our group travel promo and it\'s completely free.',
                    endingDate: moment().add(72, 'hours'),
                },
                {
                    offerName: 'Travel Bundle',
                    desctiption: 'Save up to80% with our group travel promo and it\'s completely free.',
                    endingDate: moment().add(48, 'hours'),
                },
            ]
        }
    }

    componentDidMount() {

    }

    renderCompanyDetails = () => {
        const { companyTitle, description, ratting, noOfReview } = this.state
        const { navigation } = this.props
        return (
            <View
                style={[styles.offerItemStyle, { alignItems: 'flex-start', paddingBottom: 20, marginTop: 20 }]}
                onPress={() => {

                }}>
                <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{companyTitle}</Text>
                <Rating
                    readonly={true}
                    startingValue={ratting}
                    ratingCount={5}
                    imageSize={14}
                    style={{ marginTop: 5 }}
                />
                <Text style={{ fontSize: 11, color: colors.black, marginTop: 5 }}>{noOfReview + ' Reviews'}</Text>
                <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{description}</Text>
            </View>
        )
    }

    renderOfferItem = (item, index) => {

        let expiresIn = moment(moment(item.endingDate).diff(moment()))
        expiresIn = moment.duration(expiresIn).asHours().toFixed(0)

        const { navigation } = this.props
        return (
            <TouchableOpacity
                disabled={true}
                activeOpacity={0.6}
                style={styles.offerItemStyle}
                onPress={() => {
                    // navigation.navigate('TravelerListScreen')
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.green, fontWeight: "bold" }}>{item.offerName}</Text>
                    <Text style={{ fontSize: 11, color: colors.grey, marginVertical: 10 }}>{item.desctiption}</Text>
                </View>
                <View style={styles.horizontalDivider} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={{
                                width: 15,
                                height: 15,
                                resizeMode: 'contain',
                                tintColor: 'red'
                            }}
                            source={icons.clockIcon}
                        />
                        <Text style={{ fontSize: 11, color: colors.grey, marginLeft: 10 }}>{'Expires in: ' + expiresIn}</Text>
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
            </TouchableOpacity>
        )
    }

    render() {
        const { user, myJobHistoryList } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <View style={{ width: '100%', height: 200 }}>
                    <ImageBackground
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                        source={images.hotelPlanner}>
                        <Header
                            onLeftAction={() => {
                                navigation.goBack()
                            }}
                            leftIcon={icons.backArrow}
                            leftButtonIconStyle={{ tintColor: colors.white }}
                        />
                    </ImageBackground>
                </View>
                {this.renderCompanyDetails()}
                <View style={{ paddingHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{ marginVertical: 20, color: colors.mediumGrey }}>{'Offers'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={myJobHistoryList}
                        style={{ marginBottom: 0 }}
                        extraData={myJobHistoryList}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderOfferItem(item, index)
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
    offerItemStyle: {
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
});

