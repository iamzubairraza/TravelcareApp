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
import { API, requestGetWithToken } from '../../../utils/API';
import Loader from '../../../components/Loader';



export default class TravelCompanyDetailsScreen extends Component {
    constructor(props) {
        super(props);

        let company = {
            offers: []
        }
        const { params } = props.route

        if (params) {
            if (params.company) company = { ...params.company }
        }

        this.state = {
            loading: false,
            company: company,
            anyItemSelected: false,
            displayBottomSheet: false,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\n Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            ratting: 0.00,
            noOfReview: 0,
        }
    }

    componentDidMount() {
        this.getCompanyDetailsWithOffers()
    }

    getCompanyDetailsWithOffers = () => {
        const { company } = this.state
        this.setState({ loading: true })
        requestGetWithToken(`${API.GET_TRAVELER_COMPANY_WITH_OFFERS}/${company?.id}`).then((response) => {
            this.setState({ loading: false })
            // console.log('getCompanyDetailsWithOffers', 'requestPost-response', response);
            if (response.status == 200) {
                this.setState({ company: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getCompanyDetailsWithOffers', 'error', error)
            Alert.alert(null, 'Something went wrong')
        })
    }

    renderCompanyDetails = () => {
        const { company } = this.state
        return (
            <View
                style={[styles.offerItemStyle, { alignItems: 'flex-start', paddingBottom: 20, marginTop: 20 }]}
                onPress={() => {

                }}>
                <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{company?.name}</Text>
                <Rating
                    readonly={true}
                    startingValue={company?.rating}
                    ratingCount={5}
                    imageSize={14}
                    style={{ marginTop: 5 }}
                />
                <Text style={{ fontSize: 11, color: colors.black, marginTop: 5 }}>{company?.reviews_count + ' Reviews'}</Text>
                <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{company?.description}</Text>
            </View>
        )
    }

    renderOfferItem = (item, index) => {
        const { company } = this.state
        const { navigation } = this.props
        const expiresIn = moment(item.end_date).endOf('hours').fromNow()

        return (
            <TouchableOpacity
                // disabled={true}
                activeOpacity={0.6}
                style={styles.offerItemStyle}
                onPress={() => {
                    navigation.navigate('ReceivedOfferDetailsScreen', { offer: item, companyName: company.name, updateOffers: this.getCompanyDetailsWithOffers })
                }}>
                <View style={{ flex: 1, width: '100%' }}>
                    <Text style={{ fontSize: 20, color: colors.green, fontWeight: "bold" }}>{item.title}</Text>
                    <Text style={{ fontSize: 11, color: colors.grey, marginVertical: 10 }}>{item.short_description}</Text>
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
                                        navigation.navigate('ProfileSetting', { isModeEdit: true })
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
        const { loading, company } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <View style={{ width: '100%', height: 200 }}>
                    <ImageBackground
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                        source={{ uri: company?.image }}>
                        <Header
                            onLeftAction={() => {
                                navigation.goBack()
                            }}
                            leftIcon={icons.backArrow}
                            leftButtonIconStyle={{ tintColor: colors.black }}
                        />
                    </ImageBackground>
                </View>
                {this.renderCompanyDetails()}
                {company?.offers?.length > 0 &&
                    <View style={{ paddingHorizontal: 15, alignItems: 'center' }}>
                        <Text style={{ marginVertical: 20, color: colors.mediumGrey }}>{'Offers'}</Text>
                    </View>
                }
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={company?.offers}
                        style={{ marginBottom: 0 }}
                        extraData={company?.offers}
                        keyExtractor={(item, index) => item.id}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderOfferItem(item, index)
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

