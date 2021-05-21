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
import InputField from '../../../components/InputField'
import { API, requestGetWithToken } from '../../../utils/API';
import Loader from '../../../components/Loader';

const inputAccessoryViewID = 'AllJobsScreen'

export default class AllJobsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mainHeading: "All Jobs",
            mainText: " jobs active",
            jobsList: [],
            jobsFilteredList: [],
            searchText: '',
            showSearchInput: false
        }
    }

    componentDidMount() {
        this.getJobsList()
    }

    getJobsList = () => {
        this.setState({ loading: true })
        requestGetWithToken(API.GET_COMPANY_JOBS).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                this.setState({ jobsList: response.data?.jobs, jobsFilteredList: response.data?.jobs })
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getCompanyOffers', 'error', error)
        })
    }

    renderJobItem = (item, index) => {
        const { navigation } = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.jobItemStyle}
                onPress={() => {
                    navigation.navigate('JobDetailsScreen', { jobDetails: item })
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{item.title}</Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{item.short_description}</Text>
                    <Text style={{ fontSize: 11, color: colors.primary, marginTop: 5 }}>{moment(item.created_at).format('MM/DD/YYYY')}</Text>
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
        const { loading, mainHeading, mainText, jobsList, jobsFilteredList, searchText, showSearchInput } = this.state
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
                                        let jobsFilteredListTemp = jobsList
                                        if (text !== '') {
                                            jobsFilteredListTemp = jobsFilteredListTemp.filter((item) => {
                                                return (item.title.toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
                                            })
                                        }
                                        this.setState({
                                            jobsFilteredList: jobsFilteredListTemp,
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
                            this.setState({ showSearchInput: !showSearchInput, jobsFilteredList: jobsList, searchText: '' })
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
                    <Text style={styles.hearderText}>{mainHeading}</Text>
                    <Text style={styles.hearderBelowText}>{jobsList.length + mainText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={jobsFilteredList}
                        style={{ marginBottom: 0 }}
                        extraData={jobsFilteredList}
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

