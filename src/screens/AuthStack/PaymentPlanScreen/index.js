import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    StatusBar,
    StyleSheet,
    Keyboard,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../../components/Button'
import PlanCard from '../../../components/PlanCard'

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

const { width, height } = Dimensions.get('screen');

import {
    BASIC,
    PROFESSIONAL,
    ENTERPRISE
} from '../../../utils/constants'

export default class PaymentPlanScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            selectedPeckage: ENTERPRISE
        }
    }

    componentDidMount() {

    }

    render() {
        const {
            loading,
            selectedPeckage,
        } = this.state
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => navigation.goBack()}
                    hearderText={"Plans & Payments"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', width: '80%', alignSelf: 'center', justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', width: 80 }}>
                                <View style={[styles.stepStype, {}]}>
                                    <Text style={{ color: colors.white, fontWeight: '600' }}>{'1'}</Text>
                                </View>
                                <Text style={{ marginTop: 10 }}>{'Select Plan'}</Text>
                            </View>
                            <View style={{ position: 'absolute', width: (width * 0.80) - (120), height: 1, backgroundColor: colors.primary, marginTop: 15, zIndex: -1 }} />
                            <View style={{ flex: 1 }} />
                            <View style={{ alignItems: 'center', width: 90 }}>
                                <View style={[styles.stepStype, { backgroundColor: colors.background }]}>
                                    <Text style={{ color: colors.primary, fontWeight: '600' }}>{'2'}</Text>
                                </View>
                                <Text style={{ marginTop: 10 }}>{'Payment Info'}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingVertical: 20, marginTop: 20 }}>
                            <Text style={{ fontSize: 23, fontWeight: '600' }}>{'Select a plan'}</Text>
                            <Text style={{ color: colors.mediumGrey }}>{'Select offer that best suits your needs'}</Text>

                            <PlanCard
                                containerStyle={{ marginTop: 20 }}
                                isChecked={selectedPeckage == BASIC}
                                buttonTitleText={'Basic'}
                                buttonDesctiptionText={'Basic feature offered'}
                                peckageText={'$19/mo'}
                                onPressButton={() => {
                                    this.setState({ selectedPeckage: BASIC })
                                }}
                            />
                            <PlanCard
                                isChecked={selectedPeckage == PROFESSIONAL}
                                buttonTitleText={'Professional'}
                                buttonDesctiptionText={'Pro feature offered'}
                                peckageText={'$29/mo'}
                                onPressButton={() => {
                                    this.setState({ selectedPeckage: PROFESSIONAL })
                                }}
                            />
                            <PlanCard
                                isChecked={selectedPeckage == ENTERPRISE}
                                buttonTitleText={'Enterprise'}
                                buttonDesctiptionText={'Unlimited feature offered'}
                                peckageText={'$199/mo'}
                                onPressButton={() => {
                                    this.setState({ selectedPeckage: ENTERPRISE })
                                }}
                            />

                            <Button
                                containerStyle={{ backgroundColor: colors.primary, marginTop: 30 }}
                                buttonTextStyle={{ color: colors.white }}
                                buttonText={'Step 2: Payment Info'}
                                onPressButton={() => {
                                    navigation.navigate('PaymentInfoScreen')
                                }}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
        backgroundColor: colors.background,
    },
    stepStype: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary
    }
});

