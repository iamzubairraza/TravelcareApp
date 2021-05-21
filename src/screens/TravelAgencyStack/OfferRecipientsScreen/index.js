import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet, FlatList,
} from 'react-native';
import Preference from 'react-native-preference'
import moment from 'moment'

import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

import Button from '../../../components/Button'
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';

import { API, requestGetWithToken, requestPostWithToken } from '../../../utils/API';

const inputAccessoryViewID = 'ManageOffersScreen'

export default class OfferRecipientsScreen extends Component {
    constructor(props) {
        super(props);

        let offer = {}
        const { params } = props.route
        if (params) {
            if (params.offer) offer = params.offer
        }

        this.state = {
            loading: false,
            offer: offer,
            mainHeading: "Group Travel Promo",
            mainText: "All 27 reciepents",
            travelers: [],
            filteredTravelers: [],
            showSearchInput: false,
            searchText: '',
            isEditModeEnabled: false
        }
    }

    componentDidMount() {
        const { offer } = this.state
        const { navigation } = this.props
        this.getOfferRecipients(offer?.id)
        this.onFocusListener = navigation.addListener('focus', () => {
            this.getOfferRecipients(offer?.id)
        });
    }
    componentWillUnmount() {
        this.onFocusListener = null
    }

    getOfferRecipients = (id) => {
        console.log('offer_id', id)
        this.setState({ loading: true })
        requestGetWithToken(API.GET_OFFER_RECIPIENTS + '/' + id).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('getOfferRecipients', 'travelers', response.data[0].users)
                if (response.data) this.setState({ travelers: response.data, filteredTravelers: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getOfferRecipients', 'error', error)
        })
    }

    onSavePress = () => {
        const { offer, travelers } = this.state
        this.setState({ loading: true })
        let formData = new FormData();
        formData.append('offer_id', offer?.id)
        travelers.map((item, index) => {
            if (item.users?.selected == false) {
                formData.append('user_id[]', item.user_id)
            }
        })
        console.log('onSavePress', 'formData', formData)
        requestPostWithToken(API.CANCEL_OFFER, formData).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                Alert.alert(null, response.message,
                    [{
                        text: 'OK', onPress: () => {
                            this.getOfferRecipients(offer?.id)
                        }
                    }],
                    { cancelable: false }
                )
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('onSavePress', 'error', error)
        })
    }

    tarvelerBox = (item, index) => {
        const { navigation } = this.props
        const { isEditModeEnabled } = this.state
        let statusColor = item.profile_status == '1' ? colors.green : item.profile_status == '2' ? colors.yellow : colors.red
        return (
            <View style={styles.containerBox}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{ height: isEditModeEnabled ? 120 : 80, width: "100%" }}
                    onPress={() => {
                        navigation.navigate('OfferAcceptorDetailScreen', { traveler: item })
                    }}
                    onLongPress={() => {
                        this.setState({ isEditModeEnabled: true })
                    }}>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: isEditModeEnabled ? 0.5 : 0,
                        borderColor: colors.grey,
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
                            // width: "70%",
                            flex: 1,
                            height: 80,
                            justifyContent: 'center',
                            marginStart: 15,
                            // backgroundColor: "yellow"
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: colors.black,
                                fontWeight: "bold"
                            }}>{item.name}</Text>
                            <Text style={{
                                fontSize: 11,
                                color: colors.primary,
                                marginVertical: 5,
                            }}>{
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
                    {isEditModeEnabled &&
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
                                    style={[styles.checkbox, { backgroundColor: item.selected !== false ? colors.green : colors.mediumGrey }]}
                                    onPress={() => {
                                        const isSelect = item.selected !== false
                                        console.log('new status', isSelect)
                                        let dummyFilteredTravelers = this.state.filteredTravelers
                                        let dummyTravelers = []
                                        this.state.travelers.map((mapItem) => {
                                            if (mapItem.user_id == item.user_id)
                                                dummyTravelers.push({
                                                    ...mapItem,
                                                    users: {
                                                        ...mapItem.users,
                                                        selected: !isSelect
                                                    },
                                                })
                                            else dummyTravelers.push(mapItem)
                                        })
                                        dummyFilteredTravelers[index].users.selected = !isSelect
                                        this.setState({ travelers: dummyTravelers, filteredTravelers: dummyFilteredTravelers })
                                    }}>
                                    {item.selected !== false &&
                                        <Image
                                            style={{ width: '80%', height: '80%', resizeMode: 'contain', tintColor: colors.white }}
                                            source={icons.check_white}
                                        />
                                    }
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { loading, offer, travelers, filteredTravelers, searchText, showSearchInput, isEditModeEnabled } = this.state
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
                    centerComponent={
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            {showSearchInput &&
                                <InputField
                                    inputContainer={{ marginTop: 0, paddingRight: 0, height: 40 }}
                                    fieldRef={ref => this.fieldSearch = ref}
                                    onParentPress={() => { if (this.fieldSearch) this.fieldSearch.focus() }}
                                    value={searchText}
                                    autoCapitalize={'none'}
                                    placeholder={'Search...'}
                                    returnKeyType='search'
                                    onChangeText={(text) => {
                                        let filteredTravelersTemp = travelers
                                        if (text !== '') {
                                            filteredTravelersTemp = filteredTravelersTemp.filter((item) => {
                                                return (item.users.name.toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
                                            })
                                        }
                                        this.setState({
                                            filteredTravelers: filteredTravelersTemp,
                                            searchText: text
                                        })
                                    }}
                                    rightIcon={icons.search}
                                    onRightIconPress={() => { }}
                                    onSubmitEditing={() => { }}
                                    inputAccessoryViewID={inputAccessoryViewID}
                                />
                            }
                        </View>
                    }
                    rightIcon={showSearchInput ? icons.cross : icons.search}
                    onRightAction={() => {
                        if (showSearchInput) {
                            this.setState({ showSearchInput: !showSearchInput, filteredTravelers: travelers, searchText: '' })
                        } else {
                            this.setState({ showSearchInput: !showSearchInput }, () => {
                                if (this.fieldSearch) this.fieldSearch.focus()
                            })
                        }

                    }}
                    rightButtonContainerStyle={showSearchInput ? styles.searchIconStyle : { padding: 20 }}
                    rightButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ minHeight: 60, marginBottom: 20, paddingHorizontal: 40 }}>
                        <Text style={styles.hearderText}>{offer?.title}</Text>
                        <Text style={styles.hearderBelowText}>{`All ${travelers?.length} recipents`}</Text>
                    </View>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={filteredTravelers}
                        style={{ marginBottom: 10 }}
                        extraData={filteredTravelers}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ marginBottom: (index + 1 == filteredTravelers.length && isEditModeEnabled) ? 110 : 0 }}>
                                    {this.tarvelerBox(item.users, index)}
                                </View>
                            )
                        }}
                    />
                </View>
                {isEditModeEnabled &&
                    <View style={{ position: 'absolute', bottom: 30, right: 30, left: 30, height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...styles.shadowElevation }}>
                        <Button
                            containerStyle={{ backgroundColor: colors.primary, marginRight: 5, flex: 1 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={'Add More Traveler'}
                            onPressButton={() => {
                                navigation.navigate('TravelerListScreen', { isFromOffer: true, offerId: offer?.id })
                            }}
                        />
                        <Button
                            containerStyle={{ backgroundColor: colors.primary, marginLeft: 5, flex: 1 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={'Save'}
                            onPressButton={() => {
                                this.onSavePress()
                            }}
                        />
                    </View>
                }
                <Loader loading={loading} />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        // alignItems: 'center'
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
    searchIconStyle: {
        backgroundColor: colors.grey,
        padding: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20
    }
});

