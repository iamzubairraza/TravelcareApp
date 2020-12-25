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
import { API, requestGetWithToken } from '../../../utils/API';

export default class OfferAcceptorDetailScreen extends Component {
    constructor(props) {
        super(props);

        let traveler = {
            image: "https://travel.crmstock.io/storage/app/TravelerImages/H9j4vHyjXwv9y4EYv8qt61SVwFmdkrgqZgaDMClV.jpeg",
            name: 'Kevin E.Parker',
            jobTitle: 'Chief of Surgery',
            jobsDone: '80 jobs done',
        }
        const { params } = props.route

        if (params) {
            if (params.traveler) traveler = params.traveler
        }

        this.state = {
            loading: false,
            traveler: traveler,
            anyItemSelected: false,
            displayBottomSheet: false,
            mainHeading: "Accepted Offers",
            mainText: "Offers that are accepted by travelers",
            myJobHistoryList: [
                {
                    jobTitle: 'Chief of Surgery',
                    organization: 'Bulleford General Hospital',
                    startingDate: moment().subtract(1, 'year'),
                    endingDate: null,
                    department: 'Manage the organizational aspect of Department of Surgery'
                },
                {
                    jobTitle: 'Surgical Resident',
                    organization: 'Numford University Hospital',
                    startingDate: moment().subtract(3, 'year'),
                    endingDate: moment().subtract(2, 'year'),
                    department: 'Created dianostic and therapeutic plans for surgical patients'
                },
            ]
        }
    }

    componentDidMount() {
        const { params } = this.props.route
        console.log('getTravelerDetails', 'params?.traveler?.id', params?.traveler?.id)
        this.getTravelerDetails(params?.traveler?.id)
    }

    getTravelerDetails = (id) => {
        // this.setState({ loading: true })
        requestGetWithToken(API.GET_TRAVELER_DETAILS + '/' + id).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                console.log('getTravelerDetails', 'travelers', response)
                if (response.data)
                    this.setState({ traveler: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getOrganizations', 'error', error)
        })
    }

    renderJobItem = (item, index) => {
        const { navigation } = this.props
        return (
            <TouchableOpacity
                disabled={true}
                activeOpacity={0.6}
                style={styles.jobItemStyle}
                onPress={() => {
                    // navigation.navigate('TravelerListScreen')
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{item.jobTitle}</Text>
                    <Text style={{ fontSize: 11, color: colors.primary }}>
                        {item.organization} | {moment(item.startingDate).format('MMM YYYY')} - {item.endingDate ? moment(item.endingDate).format('MMM YYYY') : 'Present'}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.grey }}>{item.department}</Text>
                </View>
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
            </TouchableOpacity>
        )
    }

    render() {
        const { traveler, myJobHistoryList } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <View style={{ width: '100%', height: 200 }}>
                    <ImageBackground
                        style={{ width: '100%', height: '100%', resizeMode: 'cover', backgroundColor: colors.primary }}
                        source={{ uri: traveler?.image }}>
                        <Header
                            onLeftAction={() => {
                                navigation.goBack()
                            }}
                            leftIcon={icons.backArrow}
                            leftButtonIconStyle={{ tintColor: colors.white }}
                        />
                    </ImageBackground>
                </View>
                <View style={[styles.jobItemStyle, { marginTop: 20, flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{traveler.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.primary }}>{traveler.jobTitle}</Text>
                    <Text style={{ fontSize: 11, color: colors.grey }}>{traveler.jobsDone}</Text>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <Text style={{ marginVertical: 20, color: colors.mediumGrey }}>{'My Job History'}</Text>
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
});

