import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';


export default class TravelerListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            anyItemSelected: false,
            displayBottomSheet: false,
            mainHeading: "All Travelers",
            mainText: "Explore for travelers that are ready in accepting offers, travel soon and more",
            travelers: [{
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: true,
                selected: false
            }, {
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: true,
                selected: false
            }, {
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: true,
                selected: false
            }, {
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: false,
                selected: false
            },]
        }
    }

    componentDidMount() {
        const { params } = this.props.route;
        console.log("PARAMS: ", JSON.stringify(params))
        if (params?.traveler === "top") {
            this.setState({ mainHeading: "Top Travelers", mainText: "Explore for travelers that are ready in accepting offers, travel soon and more" })
        } else {
            this.setState({ mainHeading: "All Travelers", mainText: "Explore for travelers that are ready in accepting offers, travel soon and more" })
        }
    }

    tarvelerBox = (item, index) => {
        const { navigation } = this.props
        return (
            <View style={styles.containerBox}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('OfferAcceptorDetailScreen')
                }} style={{ height: 120, width: "100%" }}>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 0.5,
                        borderColor: colors.grey,
                        paddingBottom: 15
                    }}>
                        <View style={{
                            width: 80,
                            borderColor: item.statusOffer ? colors.green : colors.yellow,
                            height: 80,
                            alignItems: 'center',
                            borderRadius: 40,
                            borderWidth: 1
                        }}>
                            <Image source={item.userImage} style={{
                                width: 70,
                                height: 70,
                                resizeMode: 'contain',
                                borderRadius: 35
                            }} />
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
                            }}>{item.userName}</Text>
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

                    <View style={{ width: "100%", height: 40, justifyContent: "center" }}>
                        <Text style={{
                            fontSize: 11,
                            width: '40%',
                            color: item.statusOffer ? colors.green : colors.yellow
                        }}>{item.statusOffer ? 'Accepting offers now!' : 'Would be traveling soon'}</Text>
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
                <View style={{ width: "100%", height: 300, flexDirection: "column" }}>
                    <Text style={{ fontSize: 16, color: colors.black, fontWeight: "bold", marginTop: 10 }}>Choose offer to send</Text>
                    <View style={{ width: "100%", flexDirection: "column", alignItems: "center" }}>
                        <View style={{ width: "90%", height: 80, backgroundColor: colors.Grey, borderRadius: 10, marginTop: 20, padding: 20 }}>
                            <Text style={{ fontSize: 15, color: colors.black, width: '60%', fontWeight: "bold" }}>{'Group Travel Promo'}</Text>
                            <Text style={{ fontSize: 9, width: '60%', color: colors.grey }}>{'Save upto 80% with our group travel promo and its completely free'}</Text>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={{ position: "absolute", right: 20, top: 7, width: 70, backgroundColor: colors.white, borderRadius: 20, height: 30, alignItems: "center", justifyContent: 'center', marginTop: 20 }}
                                onPress={() => {
                                    navigation.navigate('TravelerListScreen')
                                }}>
                                <Text style={{ fontSize: 12, color: colors.green }}>{'Send'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "90%", height: 80, backgroundColor: colors.Grey, borderRadius: 10, marginTop: 10, padding: 20 }}>
                            <Text style={{ fontSize: 15, color: colors.black, width: '60%', fontWeight: "bold" }}>{'Travel Bundle'}</Text>
                            <Text style={{ fontSize: 9, width: '60%', color: colors.grey }}>{'Save upto 80% with our group travel promo and its completely free'}</Text>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={{ position: "absolute", right: 20, top: 7, width: 70, backgroundColor: colors.white, borderRadius: 20, height: 30, alignItems: "center", justifyContent: 'center', marginTop: 20 }}
                                onPress={() => {

                                }}>
                                <Text style={{ fontSize: 12, color: colors.green }}>{'Send'}</Text>
                            </TouchableOpacity>
                        </View>
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
        const { displayBottomSheet } = this.state
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
                        data={this.state.travelers}
                        style={{ marginBottom: 80 }}
                        extraData={this.state}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => this.tarvelerBox(item, index)}
                    />
                </View>
                {this.state.anyItemSelected && <View style={styles.bottomContainer}>
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

