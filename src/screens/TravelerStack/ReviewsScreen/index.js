import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    Modal,
    TouchableOpacity,
    StyleSheet, FlatList,
    StatusBar
} from 'react-native';
import moment from 'moment'
import { Rating, AirbnbRating } from 'react-native-ratings';

import icons from '../../../assets/icons'
import images from '../../../assets/images'
import colors from '../../../utils/colors';

import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';
import { API, requestGetWithToken, requestPostWithToken } from '../../../utils/API';
import Loader from '../../../components/Loader';

const inputAccessoryViewID = 'ReviewsScreen'

export default class ReviewsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mainHeading: "Pending Reviews",
            mainText: "Rate the job",
            companyList: [],
            filteredCompanyList: [],
            showSearchInput: false,
            searchText: '',

            reviewModal: false,
            showSuccessModal: false,
            loadingOnSubmitReview: false,
            currentRating: 0,
            currentItemOfferId: -1
        }
    }

    componentDidMount() {
        this.getPendingReview()
    }

    getPendingReview = () => {
        this.setState({ loading: true })
        requestGetWithToken(API.GET_PENDING_REVIEW).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('getPendingReview', 'response.data', response.data)
                this.setState({ companyList: response.data, filteredCompanyList: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getPendingReview', 'error', error)
        })
    }

    onSubmitReview = () => {
        const { currentRating, currentItemOfferId } = this.state
        this.setState({ loadingOnSubmitReview: true })
        let formData = new FormData();
        formData.append('send_offer_id', currentItemOfferId)
        formData.append('rating', currentRating)
        requestPostWithToken(API.ADD_REVIEW, formData).then((response) => {
            this.setState({ loadingOnSubmitReview: false })
            if (response.status == 200) {
                this.setState({ reviewModal: false, currentRating: 0, showSuccessModal: true }, () => {
                    setTimeout(() => {
                        this.setState({ showSuccessModal: false }, () => {
                            this.getPendingReview()
                        })
                    }, 2000);
                })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loadingOnSubmitReview: false })
            console.log('onSubmitReview', 'error', error)
        })
    }

    renderRatingModal = () => {
        const {
            reviewModal,
            loadingOnSubmitReview,
            currentRating
        } = this.state

        return (
            <Modal
                animationType="slide"
                presentationStyle="overFullScreen"
                transparent={true}
                visible={reviewModal}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.setState({ reviewModal: false, currentRating: 0, currentItemOfferId: -1 })
                    }}
                    style={styles.modalContainerStyle}>
                    <StatusBar barStyle='dark-content' backgroundColor='#00000060' />
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalRatingStyle}>
                        <Text style={{ fontWeight: '600', fontSize: 16, color: 'black', alignSelf: 'center', marginBottom: 10 }}>{'Select Rating'}</Text>
                        <AirbnbRating
                            count={5}
                            reviews={false}
                            showRating={false}
                            selectedColor={colors.primary}
                            ratingColor={colors.primary}
                            ratingBackgroundColor={colors.grey}
                            defaultRating={currentRating}
                            onFinishRating={(rating) => {
                                this.setState({ currentRating: rating })
                            }}
                            size={30}
                        />
                        <Button
                            activityIndicatorProps={{
                                loading: loadingOnSubmitReview
                            }}
                            containerStyle={{ backgroundColor: colors.green, marginTop: 30, marginBottom: 0 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={'Submit review'}
                            onPressButton={() => {
                                this.onSubmitReview()
                            }}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        )
    }

    renderSuccessModal = () => {
        const { showSuccessModal } = this.state
        return (
            <Modal
                animationType="slide"
                presentationStyle="overFullScreen"
                transparent={true}
                visible={showSuccessModal}>
                <View style={styles.modalContainerStyle}>
                    <StatusBar barStyle='dark-content' backgroundColor='#00000060' />
                    <View style={[styles.modalRatingStyle, { paddingBottom: 30 }]}>
                        <View style={styles.modalCheckIcon}>
                            <Image
                                style={{ width: '100%', height: '100%', resizeMode: 'contain', tintColor: colors.white }}
                                source={icons.check}
                            />
                        </View>
                        <Image
                            style={{ alignSelf: 'center', width: 150, height: 150, resizeMode: 'contain', marginVertical: 10 }}
                            source={images.success}
                        />
                        <Text style={styles.modalSuccessText}>{'Rating Submitted Successfully!'}</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    renderCompanyItem = (item, index) => {
        const { navigation } = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.jobItemStyle}
                onPress={() => {
                    this.setState({ reviewModal: true, currentRating: 0, currentItemOfferId: item.send_offer_id })
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{item.title}</Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>
                        {item.short_description}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>
                        {"End: " + moment(item.end_date).fromNow()}
                    </Text>
                </View>
                <View style={{
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    {/* <Text style={{ fontSize: 11, color: colors.black, marginTop: 5 }}>
                        {'Rate'}
                    </Text> */}
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
                                                return (item.title.toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
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
                {this.renderRatingModal()}
                {this.renderSuccessModal()}
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
    },
    modalContainerStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        backgroundColor: '#00000060',
        paddingHorizontal: 30,
    },
    modalRatingStyle: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingBottom: 20,
        zIndex: 9
    },
    modalCheckIcon: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderColor: colors.white,
        borderWidth: 5,
        backgroundColor: colors.primary,
        padding: 5,
        marginTop: -50
    },
    modalSuccessText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'center'
    },
});

