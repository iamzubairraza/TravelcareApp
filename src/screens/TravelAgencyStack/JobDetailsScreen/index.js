import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import Header from '../../../components/Header';
import BackGround from '../../../components/HomeBackGround';

const { height } = Dimensions.get('window')

export default class JobDetailsScreen extends Component {
    constructor(props) {
        super(props);

        let jobDetails = {}
        const { params } = props.route
        if (params) {
            if (params.jobDetails) jobDetails = params.jobDetails
        }

        this.state = {
            loading: false,
            jobDetails: jobDetails,
            isMoreVisible: false,
            showMoreVisibleButton: false
        }
    }

    componentDidMount() {

    }

    render() {
        const { jobDetails, isMoreVisible, showMoreVisibleButton } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.black }}
                />
                <View style={{ width: '100%', }}>
                    <Image source={images.alert} style={{ width: '100%', height: 180, resizeMode: "contain" }} />
                </View>
                <View style={{ flex: 1, width: '100%' }}>
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ flexGrow: 1, width: '100%' }}>
                        <View style={{ flex: 1, padding: 30, paddingBottom: 50 }}>
                            <View
                                style={{ flex: 1, height: isMoreVisible ? 'auto' : !showMoreVisibleButton ? 'auto' : height * 0.5, overflow: isMoreVisible ? 'visible' : 'hidden' }}
                                onLayout={(event) => {
                                    const textViewHeight = event.nativeEvent.layout.height
                                    if (textViewHeight > height * 0.5) {
                                        this.setState({ showMoreVisibleButton: true })
                                    }
                                }}>
                                <Text style={{ fontSize: 20, color: colors.primary, marginTop: 10 }}>{jobDetails.title}</Text>
                                <Text style={{ fontSize: 14, color: colors.black, marginTop: 5 }}>{'Posted ' + moment(jobDetails.created_at).format('MM/DD/YYYY')}</Text>
                                <Text style={{ fontSize: 14, color: colors.mediumGrey, marginTop: 5 }}>{jobDetails.short_description}</Text>
                                <Text style={{ fontSize: 12, color: colors.mediumGrey, marginTop: 5 }}>{jobDetails.full_description}</Text>
                                {showMoreVisibleButton &&
                                    <LinearGradient
                                        colors={[colors.transparent, '#f2f2f2']}
                                        style={{ width: '100%', position: 'absolute', bottom: isMoreVisible ? -40 : 0, zIndex: 99 }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}
                                            onPress={() => this.setState({ isMoreVisible: !isMoreVisible })}>
                                            <Text style={{ fontSize: 14, color: colors.primary }}>{isMoreVisible ? 'See Less' : 'See More'}</Text>
                                            <Image
                                                style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: colors.primary, marginLeft: 5, transform: isMoreVisible ? [{ rotate: '270deg' }] : [{ rotate: '90deg' }] }}
                                                source={icons.rightArrow}
                                            />
                                        </TouchableOpacity>
                                    </LinearGradient>
                                }
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center'
    },
});

