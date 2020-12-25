import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet, FlatList,
} from 'react-native';
import moment from 'moment'
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import Button from '../../../components/Button'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';
import { API, requestGetWithToken, requestPostWithToken } from '../../../utils/API';
import Loader from '../../../components/Loader';

const dummyList = [
    {
        id: '1',
        image: "https://travel.crmstock.io/storage/app/TravelerImages/H9j4vHyjXwv9y4EYv8qt61SVwFmdkrgqZgaDMClV.jpeg",
        name: 'Kevin E.Parker',
        jobTitle: 'CNA',
        jobsDone: '80 jobs done',
        profile_status: '1',
        selected: false
    },
    {
        id: '1',
        image: "https://travel.crmstock.io/storage/app/TravelerImages/H9j4vHyjXwv9y4EYv8qt61SVwFmdkrgqZgaDMClV.jpeg",
        name: 'Kevin E.Parker',
        jobTitle: 'CNA',
        jobsDone: '80 jobs done',
        profile_status: '1',
        selected: false
    },
    {
        id: '2',
        image: "https://travel.crmstock.io/storage/app/TravelerImages/H9j4vHyjXwv9y4EYv8qt61SVwFmdkrgqZgaDMClV.jpeg",
        name: 'Kevin E.Parker',
        jobTitle: 'CNA',
        jobsDone: '80 jobs done',
        profile_status: '3',
        selected: false
    },
    {
        id: '3',
        image: "https://travel.crmstock.io/storage/app/TravelerImages/H9j4vHyjXwv9y4EYv8qt61SVwFmdkrgqZgaDMClV.jpeg",
        name: 'Kevin E.Parker',
        jobTitle: 'CNA',
        jobsDone: '80 jobs done',
        profile_status: '2',
        selected: false
    }
]

export default class TravelerListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            anyItemSelected: false,
            displayBottomSheet: false,
            mainHeading: "All Travelers",
            mainText: "Explore for travelers that are ready in accepting offers, travel soon and more",
            travelers: [],
            companyOffers: []
        }
    }

    componentDidMount() {
        const { params } = this.props.route;
        this.getCompanyOffers()
        if (params?.traveler === "top") {
            this.getTravelers(true)
            this.setState({ mainHeading: "Top Travelers", mainText: "Explore for travelers that are ready in accepting offers, travel soon and more" })
        } else {
            this.getTravelers(false)
            this.setState({ mainHeading: "All Travelers", mainText: "Explore for travelers that are ready in accepting offers, travel soon and more" })
        }
    }

    getTravelers = (onlyTopTravelers) => {
        let URL = onlyTopTravelers ? API.GET_TRAVELERS : API.GET_TRAVELERS
        this.setState({ loading: true })
        requestGetWithToken(URL).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('getTravelers', 'travelers', response.data)
                this.setState({ travelers: response.data })
                //data missing {1. how many jobs done, 2. Current job of traveler} in API, so dummy data is assigned
                // this.setState({ travelers: dummyList })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getTravelers', 'error', error)
        })
    }

    getCompanyOffers = () => {
        this.setState({ loading: true })
        requestGetWithToken(API.GET_COMPANY_OFFERS).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                console.log('getCompanyOffers', 'response.data', response.data)
                this.setState({ companyOffers: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getCompanyOffers', 'error', error)
        })
    }

    sendOffer = (travelers, offer_id) => {
        this.setState({ loading: true })
        let formData = new FormData();
        formData.append('offer_id', offer_id)
        travelers.map((item, index) => {
            if (item.selected) {
                formData.append('user_id[]', item.id)
            }
        })
        requestPostWithToken(API.SEND_OFFER, formData).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                Alert.alert(null, response.message,
                    [{
                        text: 'OK', onPress: () => {
                            if (this.Bsheet) this.Bsheet.snapTo(1)
                        }
                    }]
                )
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getCompanyOffers', 'error', error)
        })
    }

    tarvelerBox = (item, index) => {
        const { navigation } = this.props
        let statusColor = item.profile_status == '1' ? colors.green : item.profile_status == '2' ? colors.yellow : colors.red
        return (
            <View style={styles.containerBox}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('OfferAcceptorDetailScreen', { traveler: item })
                }} style={{ height: 120, width: "100%" }}>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 0.5,
                        borderColor: colors.grey,
                        paddingBottom: 15
                    }}>
                        <View style={{
                            width: 80,
                            borderColor: statusColor,
                            height: 80,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 40,
                            borderWidth: 1
                        }}>
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: 70,
                                    height: 70,
                                    resizeMode: 'cover',
                                    borderRadius: 35
                                }}
                            />
                        </View>
                        <View style={{
                            width: "70%",
                            height: 80,
                            justifyContent: 'center',
                            marginStart: 15,
                            //backgroundColor: "yellow"
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: colors.black,
                                width: '100%',
                                fontWeight: "bold"
                            }}>{item.name}</Text>
                            <Text style={{
                                fontSize: 11,
                                width: '40%',
                                color: colors.primary
                            }}>{item.jobTitle}</Text>
                            <Text style={{
                                fontSize: 11,
                                width: '40%',
                                color: colors.grey
                            }}>{item.jobsDone}</Text>
                        </View>
                        <View style={{
                            width: 20,
                            height: 20,
                            position: 'absolute',
                            right: 0,
                            top: 30,
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

                    <View style={{ flexDirection: 'row', width: "100%", height: 40, alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 11,
                                // width: '40%',
                                color: statusColor
                            }}>{item.profile_status == '1' ? 'Accepting offers now!' : item.profile_status == '2' ? 'Would be traveling soon!' : 'Not receiving offers!'}</Text>
                        </View>
                        {item.profile_status != '3' &&
                            <TouchableOpacity
                                style={[styles.checkbox, { backgroundColor: item.selected ? colors.green : colors.mediumGrey }]}
                                onPress={() => {
                                    let dummyTravelers = this.state.travelers;
                                    console.log("TravelerData: ", JSON.stringify(dummyTravelers))
                                    console.log("TravelerData: ", JSON.stringify(dummyTravelers[index]))
                                    dummyTravelers[index].selected = !dummyTravelers[index].selected;
                                    this.checkAnyItemSelected(dummyTravelers);
                                    this.setState({ travelers: dummyTravelers })
                                }}>
                                {item.selected &&
                                    <Image
                                        style={{ width: '80%', height: '80%', resizeMode: 'contain', tintColor: colors.white }}
                                        source={icons.check_white}
                                    />
                                }
                            </TouchableOpacity>
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    checkAnyItemSelected = (allTravelers) => {
        let count = 0;
        for (let i = 0; i < allTravelers.length; i++) {
            if (allTravelers[i].selected) {
                count++;
            }
        }
        this.setState({ anyItemSelected: count > 0 ? true : false })
    }

    renderContent = () => {
        const { navigation } = this.props
        const { companyOffers, travelers } = this.state
        return (
            <View style={{
                backgroundColor: colors.lightWhite,
                padding: 16,
                height: 450,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                elevation: 6,
            }}>
                <View style={{ width: "100%", height: 10, alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.Bsheet.snapTo(1)
                        }}
                        style={{ width: 60, height: 7, borderRadius: 4, backgroundColor: "grey" }}
                    />
                </View>
                <View style={{ width: "100%", height: 50, borderBottomWidth: 0.3, borderColor: "black", flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 15, height: 15, backgroundColor: colors.green, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
                        <Image source={icons.check_white} style={{ width: 10, height: 10, borderRadius: 10, tintColor: colors.white }} />

                    </View>
                    <Text style={{ fontSize: 12, color: colors.green, marginStart: 10 }}>Swipe down to close</Text>
                </View>
                <View style={{ flex: 1, width: "100%" }}>
                    <Text style={{ fontSize: 16, color: colors.black, fontWeight: "bold", marginTop: 10 }}>Choose offer to send</Text>
                    <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
                        <FlatList
                            listKey={moment().format('x').toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={companyOffers}
                            style={{}}
                            extraData={this.state}
                            keyExtractor={(item, index) => index}
                            numColumns={1}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ width: "90%", height: 80, backgroundColor: colors.Grey, borderRadius: 10, marginTop: 20, padding: 20 }}>
                                        <Text style={{ fontSize: 15, color: colors.black, width: '60%', fontWeight: "bold" }}>{item.title}</Text>
                                        <Text style={{ fontSize: 9, width: '60%', color: colors.grey }}>{'Save upto 80% with our group travel promo and its completely free'}</Text>
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            style={{ position: "absolute", right: 20, top: 7, width: 70, backgroundColor: colors.white, borderRadius: 20, height: 30, alignItems: "center", justifyContent: 'center', marginTop: 20 }}
                                            onPress={() => {
                                                this.sendOffer(travelers, item.id)
                                            }}>
                                            <Text style={{ fontSize: 12, color: colors.green }}>{'Send'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                        <View style={{ flex: 1 }} />
                        <Button
                            containerStyle={{ backgroundColor: colors.primary, width: "90%", marginTop: 30 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={'Quote New Offer'}
                            onPressButton={() => {
                                this.Bsheet.snapTo(1)
                                setTimeout(() => {
                                    navigation.navigate('NewOfferScreen')
                                }, 200);
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { displayBottomSheet, loading, travelers } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <BackGround blueView={'30%'} whiteView={'70%'} />
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={styles.containerBoxMain}>
                    <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                    <Text
                        style={styles.hearderBelowText}>{this.state.mainText}</Text>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={travelers}
                        style={{}}
                        extraData={this.state}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ marginBottom: (index + 1 == travelers.length) ? 110 : 0 }}>
                                    {this.tarvelerBox(item, index)}
                                </View>
                            )
                        }}
                    />
                </View>
                {this.state.anyItemSelected &&
                    <View style={styles.bottomContainer}>
                        <Button
                            containerStyle={{ backgroundColor: colors.green }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={'Send Offer'}
                            onPressButton={() => {
                                this.setState({ displayBottomSheet: true }, () => {
                                    this.Bsheet.snapTo(0)
                                })
                            }}
                        />

                    </View>}

                {displayBottomSheet &&
                    <View style={{ flex: 1, backgroundColor: '#00000020', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <BottomSheet
                            ref={(ref) => this.Bsheet = ref}
                            snapPoints={[450, 0]}
                            borderRadius={20}
                            borderWidth={2}
                            initialSnap={1}
                            renderContent={() => this.renderContent()}
                            onCloseEnd={() => { this.setState({ displayBottomSheet: false }) }}
                        />
                    </View>
                }
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
        flex: 1,
        height: '100%',
        width: '100%',
        flexDirection: "column",
        //backgroundColor:'yellow'
    },
    containerBox: {
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
        marginTop: 10,
        marginHorizontal: 15
    },
    bottomContainer: {
        width: '100%',
        height: 80,
        position: 'absolute',
        paddingHorizontal: 30,
        bottom: 20,
    },
    buttonTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colors.white,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        borderRadius: 5,
    },
    horizontalDivider: {
        flex: 1,
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
        marginVertical: 5
    }
});

