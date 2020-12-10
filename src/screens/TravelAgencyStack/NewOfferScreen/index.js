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
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment'
import ImagePickerCrop from 'react-native-image-crop-picker';
import nodeEmoji from 'node-emoji';

import Button, { ButtonWithIcon } from '../../../components/Button'
import InputField from '../../../components/InputField'
import CountryCodePicker from '../../../components/CountryCodePicker'
import DropDownPicker from '../../../components/DropDownPicker'
import CheckBoxRound from '../../../components/CheckBoxRound'

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import { permissionCamera } from '../../../utils/permissions'

import {
    TRAVELER,
    COMPANY,
} from '../../../utils/constants'

const { width, height } = Dimensions.get('screen');

export default class NewOfferScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            offerName: '',
            fieldTwo: '',
            fullDescription: ''
        }
    }

    componentDidMount() {

    }

    verifyFields = () => {
        const {
            offerName,
            fieldTwo,
            fullDescription
        } = this.state

        return true
    }

    onConfirmPress = () => {
        const { navigation } = this.props
        const { selectedLogin } = this.state

        if (this.verifyFields()) {
            Alert.alert(null, 'Under Development')
        }
    }

    render() {
        const {
            loading,
            offerName,
            fieldTwo,
            fullDescription
        } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    hearderText={"New Offer"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    // bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}>
                    <View style={{ flex: 1 }}>
                        <InputField
                            fieldRef={ref => this.fieldOfferName = ref}
                            value={offerName}
                            placeholder={'Offer name'}
                            textContentType={'name'}
                            returnKeyType='next'
                            onChangeText={(text) => {
                                this.setState({ offerName: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldFieldTwo.focus()
                            }}
                        />
                        <InputField
                            fieldRef={ref => this.fieldFieldTwo = ref}
                            value={fieldTwo}
                            placeholder={'Field 2'}
                            returnKeyType='next'
                            onChangeText={(text) => {
                                this.setState({ fieldTwo: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldDesctiption.focus()
                            }}
                        />
                        <InputField
                            inputContainer={{ height: 250 }}
                            inputStyle={{ height: '90%' }}
                            fieldRef={ref => this.fieldDesctiption = ref}
                            value={fullDescription}
                            multiline={true}
                            placeholder={'Full description'}
                            onChangeText={(text) => {
                                this.setState({ fullDescription: text })
                            }}
                        />
                    </View>
                    <Button
                        containerStyle={{ backgroundColor: colors.green, marginBottom: 70 }}
                        buttonTextStyle={{ color: colors.white }}
                        buttonText={'Confirm'}
                        onPressButton={() => {
                            this.onConfirmPress()
                        }}
                    />
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
    buttonTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colors.white,
        textAlign: 'center'
    },
    horizontalDivider: {
        flex: 1,
        backgroundColor: colors.mediumGrey,
        height: 1
    },
});

