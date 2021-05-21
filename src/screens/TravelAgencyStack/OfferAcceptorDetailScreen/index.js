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
import moment from 'moment'

import icons from '../../../assets/icons'

import colors from '../../../utils/colors';
import { API, requestGetWithToken } from '../../../utils/API';

import Header from '../../../components/Header';
import Loader from '../../../components/Loader';

const dummyJobHistory = [
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

export default class OfferAcceptorDetailScreen extends Component {
    constructor(props) {
        super(props);

        let traveler = {}
        const { params } = props.route
        if (params) {
            if (params.traveler) traveler = params.traveler
        }

        this.state = {
            loading: false,
            traveler: traveler,
            myJobHistoryList: []
        }
    }

    componentDidMount() {
        const { traveler } = this.state
        this.getTravelerDetails(traveler?.id)
    }

    getTravelerDetails = (id) => {
        this.setState({ loading: true })
        requestGetWithToken(API.GET_TRAVELER_DETAILS + '/' + id).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                // console.log('getTravelerDetails', 'travelers', JSON.stringify(response))
                this.setState({ traveler: response.data })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getOrganizations', 'error', error)
        })
    }

    renderJobItem = (job, index) => {
        const item = job.offers
        const { navigation } = this.props
        const offerEndDate = new Date(moment(item.end_date, "YYYY-MM-DD"))

        const currentDate = parseInt(moment().format('YYYYMM'))
        const endDate = parseInt(moment(offerEndDate).format('YYYYMM'))

        console.log(currentDate + " >= " + endDate + " = " + (currentDate >= endDate))

        const isActive = endDate >= currentDate
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.jobItemStyle}
                onPress={() => {
                    navigation.navigate('JobDetailsScreen', { jobDetails: item })
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{item.title}</Text>
                    <Text style={{ fontSize: 11, color: colors.primary, marginVertical: 5 }}>
                        {item.users?.name} | {moment(item.created_at).format('MMM YYYY')} - {isActive ? 'Present' : moment(offerEndDate).format('MMM YYYY')}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.grey }}>{item.short_description}</Text>
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
                        source={require('../../../assets/icons/right_arrow.png')}
                        style={{
                            width: 10,
                            height: 10,
                            resizeMode: 'contain'
                        }}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { loading, traveler, myJobHistoryList } = this.state
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
                            leftButtonIconStyle={{ tintColor: colors.black }}
                        />
                    </ImageBackground>
                </View>
                <View style={[styles.jobItemStyle, { marginTop: 20, flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{traveler.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.primary, marginVertical: 5 }}>
                        {Array.isArray(traveler.services) ? traveler.services[0].name : traveler.service}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.grey }}>{traveler.jobs + " jobs done"}</Text>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <Text style={{ marginVertical: 20, color: colors.mediumGrey }}>{'My Job History'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={traveler?.job_history}
                        style={{ marginBottom: 0 }}
                        extraData={traveler?.job_history}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderJobItem(item, index)
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
});

