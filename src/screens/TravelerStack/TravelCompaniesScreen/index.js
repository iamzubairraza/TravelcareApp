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

export default class TravelCompaniesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mainHeading: "Travel Companies",
            mainText: "Explore travel companies",
            jobsList: [
                {
                    companyTitle: 'Booklt.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 3.5,
                    noOfReview: 8256
                },
                {
                    companyTitle: 'HotelPlanner.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 4.5,
                    noOfReview: 1631
                },
                {
                    companyTitle: 'Booklt.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 3.5,
                    noOfReview: 8256
                },
                {
                    companyTitle: 'HotelPlanner.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 4.5,
                    noOfReview: 1631
                },
                {
                    companyTitle: 'Booklt.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 3.5,
                    noOfReview: 8256
                },
                {
                    companyTitle: 'HotelPlanner.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 4.5,
                    noOfReview: 1631
                },
                {
                    companyTitle: 'Booklt.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 3.5,
                    noOfReview: 8256
                },
                {
                    companyTitle: 'HotelPlanner.com',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                    ratting: 4.5,
                    noOfReview: 1631
                },
            ]
        }
    }

    componentDidMount() {

    }

    renderJobItem = (item, index) => {
        const { navigation } = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.jobItemStyle}
                onPress={() => {
                    navigation.navigate('TravelCompanyDetailsScreen')
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{item.companyTitle}</Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{item.description}</Text>
                </View>
                <View style={{
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    <Rating
                        readonly={true}
                        startingValue={item.ratting}
                        ratingCount={5}
                        imageSize={14}
                        style={{ paddingVertical: 0 }}
                    />
                    <Text style={{ fontSize: 11, color: colors.black, marginTop: 5 }}>{item.noOfReview + ' Reviews'}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { jobsList } = this.state
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
                    rightIcon={icons.search}
                    onRightAction={() => {
                        Alert.alert(null, 'Under Development')
                    }}
                    rightButtonContainerStyle={{ padding: 20 }}
                    rightButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={{ height: 60 }}>
                    <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                    <Text style={styles.hearderBelowText}>{this.state.mainText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={jobsList}
                        style={{ marginBottom: 0 }}
                        extraData={jobsList}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderJobItem(item, index)
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
        marginLeft: 40
    },
    hearderBelowText: {
        width: '80%',
        fontSize: 12,
        color: colors.white,
        marginLeft: 40,
        marginTop: 5,
    },
});

