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

import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';
import { API, requestGetWithToken } from '../../../utils/API';
import Loader from '../../../components/Loader';

export default class AcceptedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            anyItemSelected: false,
            displayBottomSheet: false,
            mainHeading: "Accepted Offers",
            mainText: "Offers that are accepted by travelers",
            travelers: []
        }
    }

    componentDidMount() {
        this.getAcceptedOffers()
    }

    getAcceptedOffers = () => {
        this.setState({ loading: true })
        requestGetWithToken(API.GET_ACCEPTED_OFFERS).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                console.log('getAcceptedOffers', 'response.data', response.data)
                this.setState({ travelers: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getAcceptedOffers', 'error', error)
        })
    }

    tarvelerBox = (item, index) => {
        const { navigation } = this.props
        if (index == 0) console.log('item', item)
        return (
            <View style={styles.containerBox}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{ height: 80, width: "100%" }}
                    onPress={() => {
                        navigation.navigate('OfferAcceptorDetailScreen', { traveler: item })
                    }}>
                    <View style={{
                        flexDirection: 'row',
                        paddingBottom: 15
                    }}>
                        <View style={{
                            width: 80,
                            borderColor: item.profile_status == 1 ? colors.green : item.profile_status == 2 ? colors.yellow : colors.red,
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
                                color: colors.primary,
                                marginVertical: 5,
                            }}>
                                {
                                    Array.isArray(item?.services) ?
                                        item?.services[0]?.name :
                                        item.service
                                }
                            </Text>
                            <Text style={{
                                fontSize: 11,
                                width: '40%',
                                color: colors.grey
                            }}>{item.jobs + " jobs done"}</Text>
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

                </TouchableOpacity>
            </View>
        )
    }

    maintarvelerBox = (item, index) => {
        if (item?.accepted_users?.length > 0 == false) return null
        return (
            <View style={{ width: '100%', alignItems: 'center', marginBottom: index + 1 == this.state.travelers.length ? 120 : 20 }}>
                <View style={{ width: '80%', height: 15, flexDirection: "row" }}>
                    <Text style={{ width: '50%', color: colors.black, fontSize: 14 }}>{item.title}</Text>
                    <View style={{ width: "50%", alignItems: "flex-end" }}>
                        <View style={{ width: "100%", flexDirection: "row", }}>
                            <View style={{ width: 15, height: 15, backgroundColor: colors.green, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
                                <Image source={icons.check_white} style={{ width: 10, height: 10, borderRadius: 10, tintColor: colors.white }} />
                            </View>
                            <Text style={{ fontSize: 14, color: colors.green, marginStart: 5 }}>{item.accepted_users?.length + " Traveler selected"}</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    listKey={moment().format('x').toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={item.accepted_users}
                    style={{ marginBottom: 10 }}
                    extraData={this.state}
                    keyExtractor={(item, index) => index}
                    numColumns={1}
                    renderItem={({ item, index }) => this.tarvelerBox(item, index)}
                />
            </View>
        );
    }

    render() {
        const { loading } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <BackGround blueView={'20%'} whiteView={'80%'} />
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={styles.containerBoxMain}>
                    <View style={{ minHeight: 60, paddingHorizontal: 40 }}>
                        <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                        <Text style={styles.hearderBelowText}>{this.state.mainText}</Text>
                    </View>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.travelers}
                        style={{ marginBottom: 20, marginTop: 20 }}
                        extraData={this.state}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => this.maintarvelerBox(item, index)}
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
        backgroundColor: colors.primary,
        alignItems: 'center'
    },
    containerBoxMain: {
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
        bottom: 0,
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
        position: 'absolute',
        borderRadius: 5,
        top: 10,
        right: 0,
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
    },
    hearderBelowText: {
        width: '80%',
        fontSize: 12,
        color: colors.white,
        marginTop: 5
    }
});