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
import { Rating, AirbnbRating } from 'react-native-ratings';

import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';
import { API, requestGetWithToken } from '../../../utils/API';
import Loader from '../../../components/Loader';

const inputAccessoryViewID = 'TravelCompaniesScreen'

export default class TravelCompaniesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mainHeading: "Travel Companies",
            mainText: "Explore travel companies",
            companyList: [],
            filteredCompanyList: [],
            showSearchInput: false,
            searchText: ''
        }
    }

    componentDidMount() {
        this.getCompanyOffers()
    }

    getCompanyOffers = () => {
        this.setState({ loading: true })
        requestGetWithToken(API.GET_TRAVELER_COMPANIES).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('getCompanyOffers', 'response.data', response.data)
                this.setState({ companyList: response.data, filteredCompanyList: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getCompanyOffers', 'error', error)
        })
    }

    renderCompanyItem = (item, index) => {
        const { navigation } = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.jobItemStyle}
                onPress={() => {
                    navigation.navigate('TravelCompanyDetailsScreen', { company: item })
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{item.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>
                        {item.description}
                        {/* {'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'} */}
                    </Text>
                </View>
                <View style={{
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    <Rating
                        readonly={true}
                        startingValue={item.rating}
                        ratingCount={5}
                        imageSize={14}
                        style={{ paddingVertical: 0 }}
                    />
                    <Text style={{ fontSize: 11, color: colors.black, marginTop: 5 }}>
                        {item.reviews_count + ' Reviews'}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { companyList, filteredCompanyList, searchText, loading, showSearchInput } = this.state
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
                                        let filteredCompanyListTemp = companyList
                                        if (text !== '') {
                                            filteredCompanyListTemp = filteredCompanyListTemp.filter((item) => {
                                                return (item.name.toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
                                            })
                                        }
                                        this.setState({
                                            filteredCompanyList: filteredCompanyListTemp,
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
                            this.setState({ showSearchInput: !showSearchInput, filteredCompanyList: companyList })
                        } else {
                            this.setState({ showSearchInput: !showSearchInput }, () => {
                                if (this.fieldSearch) this.fieldSearch.focus()
                            })
                        }

                    }}
                    rightButtonContainerStyle={showSearchInput ? styles.searchIconStyle : { padding: 20 }}
                    rightButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={{ minHeight: 60, paddingHorizontal: 40 }}>
                    <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                    <Text style={styles.hearderBelowText}>{this.state.mainText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={filteredCompanyList}
                        style={{ marginBottom: 0 }}
                        extraData={filteredCompanyList}
                        keyExtractor={(item, index) => item.id}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderCompanyItem(item, index)
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
        flexDirection: 'row',
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
        marginTop: 5,
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

