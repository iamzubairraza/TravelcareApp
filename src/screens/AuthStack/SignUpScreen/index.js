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
    SafeAreaView
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment'
import ImagePickerCrop from 'react-native-image-crop-picker';
import nodeEmoji from 'node-emoji';
import Preference from 'react-native-preference'

import Button, { ButtonWithIcon } from '../../../components/Button'
import InputField from '../../../components/InputField'
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView'
import CountryCodePicker from '../../../components/CountryCodePicker'
import DropDownPicker from '../../../components/DropDownPicker'
import CheckBoxRound from '../../../components/CheckBoxRound'
import { listOfContries } from "../../../components/CountryCodePicker";
import Loader from '../../../components/Loader';

import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import preferenceKeys from '../../../utils/preferenceKeys';
import { permissionCamera } from '../../../utils/permissions'

import { requestPost, requestPostWithToken, API, requestGet } from '../../../utils/API'

import {
    TRAVELER,
    COMPANY,
    ACTIVE,
    THINKING,
    IDLE,
} from '../../../utils/constants'

const { height } = Dimensions.get('screen');

const REGEX_EMAIL = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
const REGEX_PHONE = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
const REGEX_NAME = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/gm

const imagePickerOptions = {
    cropping: false,
    width: 750,
    height: 750,
    mediaType: 'photo',
    includeBase64: false,
    // cropperCircleOverlay: true,
    compressImageQuality: 1.0,
};
const inputAccessoryViewID = 'SignUpScreen'

export default class SignUpScreen extends Component {
    constructor(props) {
        super(props);

        const { params } = props.route
        const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
        let userId = -1
        let email = ''
        let name = 'Ali Rehman'
        let userType = TRAVELER
        let isModeEdit = false
        let phoneNumber = '12345678'
        let profileImage = ''
        let password = '123456'
        let selectedCountryCode = { callingCode: ["1"], flag: "flag-us", name: { common: "United States" } }
        if (params) {
            if (params.email) email = params.email
            if (params.userType) userType = params.userType
            if (params.isModeEdit) {
                isModeEdit = params.isModeEdit
                password = '1234567890'
                if (currentUser) {
                    const { id, country_code, phone, image } = currentUser
                    if (id) userId = id
                    if (currentUser.name) name = currentUser.name
                    if (currentUser.email) email = currentUser.email
                    if (phone) phoneNumber = phone
                    if (image) profileImage = image
                    if (country_code) {
                        let callingCode = country_code.replace('+', '')
                        selectedCountryCode = listOfContries.find((item) => item.callingCode[0] == callingCode)
                    }
                }
            }
        }

        this.state = {
            loading: true,
            loadingOnCreateAccount: false,
            loadingOnSetNewPassword: false,
            percentCompleted: 0,
            userType: userType,
            isModeEdit: isModeEdit,
            email: email,
            profileStatus: ACTIVE,
            name: name,
            selectedCountryCode: selectedCountryCode,
            phoneNumber: phoneNumber,
            typesOfOrganizations: [],
            selectedTypeOfOrganization: '',
            previousSelectedIndex: 0,
            services: [
                { id: 2, name: 'Doctor' },
                { id: 'aldskjf', name: 'Eye spacialist' },
                { id: 2, name: 'Doctor' },
                { id: 'aldskjf', name: 'Eye spacialist' },
                { id: 2, name: 'Doctor' },
                { id: 'aldskjf', name: 'Eye spacialist' },
            ],
            profileImage: profileImage,
            selectedServices: [],
            password: password,
            isHiddenPassword: true,
            confirmPassword: '123456',
            isHiddenConfirmPassword: true,
            rememberPassword: true,
            isOpenCountrySelector: false,
            showOptionModal: false,
            showPasswordChangeModal: false,
            oldPassword: '',
            isHiddenOldPassword: true,
            newPassword: '',
            isHiddenNewPassword: true,
            confirmNewPassword: '',
            isHiddenConfirmNewPassword: true,
            showSuccessModal: false,
        }
    }

    componentDidMount() {
        if (this.state.userType == TRAVELER)
            this.getServices()
        else
            this.getOrganizations()
    }

    getServices = () => {
        this.setState({ loading: true })
        requestGet(API.GET_SERVICES).then((response) => {
            if (response.status == 200) {
                this.setState({ loading: false })
                if (response.data) {
                    this.setState({ services: response.data }, () => {
                        // const { isModeEdit, services } = this.state
                        // if (isModeEdit) {
                        //     const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
                        //     const { service } = currentUser
                        //     let servicesTemp = services
                        //     let selectedTypeOfOrganization = ''
                        //     let previousSelectedIndex = 0
                        //     typesOfOrganizations.map((item, index) => {
                        //         if (item.id == organization) {
                        //             selectedTypeOfOrganization = {
                        //                 ...item,
                        //                 isChecked: true
                        //             }
                        //             previousSelectedIndex = index
                        //         }
                        //     })
                        //     if (selectedTypeOfOrganization) {
                        //         typesOfOrganizationsTemp[previousSelectedIndex].isChecked = true
                        //         this.setState({ selectedTypeOfOrganization, previousSelectedIndex, typesOfOrganizations: typesOfOrganizationsTemp })
                        //     }
                        // }
                    })
                }
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getServices', 'error', error)
        })
    }

    getOrganizations = () => {
        this.setState({ loading: true })
        requestGet(API.GET_ORGANIZATIONS).then((response) => {
            if (response.status == 200) {
                this.setState({ loading: false })
                if (response.data) {
                    this.setState({ typesOfOrganizations: response.data }, () => {
                        const { isModeEdit, typesOfOrganizations } = this.state
                        if (isModeEdit) {
                            const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
                            const { organization } = currentUser
                            let typesOfOrganizationsTemp = typesOfOrganizations
                            let selectedTypeOfOrganization = ''
                            let previousSelectedIndex = 0
                            typesOfOrganizations.map((item, index) => {
                                if (item.id == organization) {
                                    selectedTypeOfOrganization = {
                                        ...item,
                                        isChecked: true
                                    }
                                    previousSelectedIndex = index
                                }
                            })
                            if (selectedTypeOfOrganization) {
                                typesOfOrganizationsTemp[previousSelectedIndex].isChecked = true
                                this.setState({ selectedTypeOfOrganization, previousSelectedIndex, typesOfOrganizations: typesOfOrganizationsTemp })
                            }
                        }
                    })
                }
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getOrganizations', 'error', error)
        })
    }

    verifyFields = () => {
        const {
            userType,
            profileImage,
            name,
            selectedCountryCode,
            phoneNumber,
            selectedServices,
            selectedTypeOfOrganization,
            email,
            password,
            confirmPassword,
            isModeEdit,
        } = this.state

        if (profileImage === '') {
            alert('Profile images is required')
            return false
        } else if (name === '') {
            alert('Name is required')
            return false
        } else if (phoneNumber === '') {
            alert('Phone number is required')
            return false
        } else if (!REGEX_PHONE.test('+' + selectedCountryCode.callingCode[0] + phoneNumber)) {
            alert('Invalid phone format')
            return false
            // } else if (userType === TRAVELER && selectedServices.length === 0) {
            //     alert('Select at least on service')
            //     return false
        } else if (userType === COMPANY && selectedTypeOfOrganization.length === '') {
            alert('Select your organization type')
            return false
        } else if (email === '') {
            alert('Email is required')
            return false
        } else if (REGEX_EMAIL.test(email.trim()) === false) {
            alert('Email not valid')
            return false
        } else if (password === '') {
            alert('Password is required')
            return false
        } else if (!isModeEdit && password !== confirmPassword) {
            alert('Confirm password not matched with new password.')
            return false
        }

        return true
    }

    onCreateAccoutPress = () => {
        const { navigation } = this.props
        const {
            userType,
            profileImage,
            profileStatus,
            name,
            selectedCountryCode,
            phoneNumber,
            selectedServices,
            selectedTypeOfOrganization,
            email,
            password,
        } = this.state

        if (this.verifyFields()) {
            Keyboard.dismiss()
            let URL = ''
            let navigateTo = ''
            let formData = new FormData();
            if (typeof profileImage != 'string') formData.append('image', profileImage)
            formData.append('country_code', selectedCountryCode.callingCode[0])
            formData.append('phone', phoneNumber)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('country_status', 'ali')
            if (userType == COMPANY) {
                URL = API.COMPANY_SIGN_UP
                navigateTo = 'TravelAgencyStack'
                formData.append('company_name', name)
                formData.append('type_of_organization', selectedTypeOfOrganization.id)
                formData.append('plan', '1')
            }
            else {
                URL = API.TRAVELER_SIGN_UP
                navigateTo = 'TravelerStack'
                formData.append('full_name', name)
                formData.append('profile_status', profileStatus)
                formData.append('service', selectedServices)
            }
            this.setState({ loadingOnCreateAccount: true, percentCompleted: 0 })
            requestPost(URL, formData, {}, { onUploadProgress: this.onUploadProgress }).then((response) => {
                this.setState({ loadingOnCreateAccount: false })
                console.log('response', response)
                if (response.status == 200) {
                    const { data, token } = response
                    Preference.set(preferenceKeys.HAS_SESSION, true)
                    Preference.set(preferenceKeys.USER_TYPE, userType)
                    Preference.set(preferenceKeys.CURRENT_USER, data)
                    Preference.set(preferenceKeys.AUTH_TOKEN, `Bearer ${token}`)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: navigateTo }],
                    });
                } else {
                    Alert.alert(null, response.message)
                }
            }).catch(() => {
                this.setState({ loadingOnCreateAccount: false })
                Alert.alert(null, 'Something went wrong')
            })
        }
    }

    onSavePress = () => {
        const { navigation } = this.props
        const {
            userType,
            profileImage,
            profileStatus,
            name,
            selectedCountryCode,
            phoneNumber,
            selectedServices,
            selectedTypeOfOrganization,
            email,
            password,
        } = this.state

        if (this.verifyFields()) {
            Keyboard.dismiss()
            let URL = ''
            let formData = new FormData();
            if (typeof profileImage != 'string') formData.append('image', profileImage)
            formData.append('country_code', selectedCountryCode.callingCode[0])
            formData.append('phone', phoneNumber)
            formData.append('email', email)
            formData.append('password', password)
            if (userType == COMPANY) {
                URL = API.UPDATE_COMPANY_PROFILE
                navigateTo = 'TravelAgencyStack'
                formData.append('company_name', name)
                formData.append('type_of_organization', selectedTypeOfOrganization.id)
            }
            else {
                URL = API.UPDATE_TRAVELER_PROFILE
                navigateTo = 'TravelerStack'
                formData.append('full_name', name)
                formData.append('profile_status', profileStatus)
                formData.append('service', selectedServices)
            }
            this.setState({ loadingOnCreateAccount: true, percentCompleted: 0 })
            requestPostWithToken(URL, formData, {}, { onUploadProgress: this.onUploadProgress }).then((response) => {
                this.setState({ loadingOnCreateAccount: false })
                console.log('response', response)
                if (response.status == 200) {
                    const { data, message } = response
                    Preference.set(preferenceKeys.CURRENT_USER, data)
                    Alert.alert(null, message)
                    // navigation.goBack()
                } else {
                    Alert.alert(null, message)
                }
            }).catch(() => {
                this.setState({ loadingOnCreateAccount: false })
                Alert.alert(null, 'Something went wrong')
            })
        }
    }

    onUploadProgress = (progressEvent) => {
        var _percentCompleted = (Math.round((progressEvent.loaded * 100) / progressEvent.total)) - 1
        this.setState({ percentCompleted: _percentCompleted })
    }

    verifyFieldsForPasswordChange = () => {
        const { oldPassword, newPassword, confirmNewPassword } = this.state
        if (oldPassword === '') {
            alert('Old password field is required')
            return false
        } else if (oldPassword.length < 6) {
            alert('Recheck your old password')
            return false
        } else if (newPassword === '') {
            alert('New password field is required')
            return false
        } else if (newPassword.length < 6) {
            alert('Password must contain 6 characters')
            return false
        } else if (newPassword !== confirmNewPassword) {
            alert('Confirm password not matched with new password.')
            return false
        }

        return true
    }

    onSetAsNewPasswrodPress = () => {
        const { navigation } = this.props
        const { oldPassword, newPassword } = this.state
        if (this.verifyFieldsForPasswordChange()) {
            let formData = new FormData();
            formData.append('old_password', oldPassword)
            formData.append('new_password', newPassword)
            this.setState({ loadingOnSetNewPassword: true })
            requestPostWithToken(API.CHANGE_PASSWORD, formData).then((response) => {
                if (response.status == 200) {
                    this.setState({ loadingOnSetNewPassword: false, showPasswordChangeModal: false, oldPassword: '', newPassword: '', confirmNewPassword: '', showSuccessModal: true }, () => {
                        setTimeout(() => {
                            this.setState({ showSuccessModal: false }, () => {

                            })
                        }, 100);
                    })
                } else {
                    Alert.alert(null, response.message)
                }
            }).catch(() => {
                this.setState({ loadingOnSetNewPassword: false })
                Alert.alert(null, 'Something went wrong')
            })
        }
    }

    onChooseFromLibraryPress = () => {
        try {
            ImagePickerCrop.openPicker(imagePickerOptions).then(this._onImagePickerResponse);
        } catch (error) {
            console.log('error', error)
        }
    }

    onTakePhotoPress = () => {
        ImagePickerCrop.openCamera(imagePickerOptions).then(this._onImagePickerResponse);
    }

    _onImagePickerResponse = (response) => {
        this.setState({
            profileImage: { name: moment().format('x') + '.jpeg', uri: response.path, type: 'image/jpeg' }
        })
    }

    renderOptionModel = () => {
        const borderRadius = 13

        return (
            <Modal
                animationType="slide"
                presentationStyle="overFullScreen"
                transparent={true}
                visible={this.state.showOptionModal}>
                <View style={[styles.modalStyle, { justifyContent: 'flex-end' }]}>
                    {/* <StatusBar barStyle='dark-content' backgroundColor='#00000000' /> */}
                    <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
                        <View style={{ marginBottom: 15 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ showOptionModal: false }, () => {
                                        setTimeout(() => {
                                            this.onChooseFromLibraryPress()
                                        }, 1000)
                                    })
                                }}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: 'white',
                                    alignItems: 'center', justifyContent: 'center',
                                    borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius
                                }}>
                                <Text style={{ color: colors.primary, padding: 14, fontSize: 20 }}>
                                    {'Choose from Library'}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ height: 2, width: '100%' }} />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ showOptionModal: false }, () => {
                                        setTimeout(() => {
                                            this.onTakePhotoPress()
                                        }, 1000)
                                    })
                                }}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: 'white',
                                    alignItems: 'center', justifyContent: 'center',
                                    borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius
                                }}>
                                <Text style={{ color: colors.primary, padding: 14, fontSize: 20 }}>{'Take Photo'}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ backgroundColor: 'white', borderRadius: borderRadius, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                this.setState({ showOptionModal: false })
                            }}>
                            <Text style={{ color: colors.primary, padding: 14, fontSize: 20 }}>{'Cancel'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    renderPasswordChangeModal = () => {
        const {
            showPasswordChangeModal,
            oldPassword,
            isHiddenOldPassword,
            newPassword,
            isHiddenNewPassword,
            confirmNewPassword,
            isHiddenConfirmNewPassword,
            loadingOnSetNewPassword
        } = this.state

        return (
            <Modal
                animationType="slide"
                presentationStyle="overFullScreen"
                transparent={true}
                visible={showPasswordChangeModal}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.setState({ showPasswordChangeModal: false, oldPassword: '', newPassword: '', confirmNewPassword: '', })
                    }}
                    style={styles.modalContainerStyle}>
                    <StatusBar barStyle='dark-content' backgroundColor='#00000060' />
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalPasswordStyle}>
                        <Text style={{ fontWeight: '600', fontSize: 16, color: 'black', alignSelf: 'center', marginBottom: 10 }}>{'Setup New Password'}</Text>
                        <InputField
                            fieldRef={ref => this.fieldOldPassword = ref}
                            onParentPress={() => { if (this.fieldOldPassword) this.fieldOldPassword.focus() }}
                            inputContainer={{ paddingRight: 10, backgroundColor: colors.background }}
                            value={oldPassword}
                            hideShadowElevation={true}
                            placeholder={'Enter Old Password'}
                            secureTextEntry={isHiddenOldPassword}
                            onChangeText={(text) => {
                                this.setState({ oldPassword: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldNewPassword.focus()
                            }}
                            returnKeyType='next'
                            rightIcon={isHiddenOldPassword ? icons.eyeOpen : icons.eyeClose}
                            rightIconStyle={{ tintColor: '#A4A4A4' }}
                            onRightIconPress={() => {
                                this.setState({ isHiddenOldPassword: !isHiddenOldPassword })
                            }}
                        />
                        <InputField
                            fieldRef={ref => this.fieldNewPassword = ref}
                            onParentPress={() => { if (this.fieldNewPassword) this.fieldNewPassword.focus() }}
                            inputContainer={{ paddingRight: 10, backgroundColor: colors.background }}
                            value={newPassword}
                            hideShadowElevation={true}
                            placeholder={'Enter New Password'}
                            secureTextEntry={isHiddenNewPassword}
                            onChangeText={(text) => {
                                this.setState({ newPassword: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldConfrimNewPassword.focus()
                            }}
                            returnKeyType='next'
                            rightIcon={isHiddenNewPassword ? icons.eyeOpen : icons.eyeClose}
                            rightIconStyle={{ tintColor: '#A4A4A4' }}
                            onRightIconPress={() => {
                                this.setState({ isHiddenNewPassword: !isHiddenNewPassword })
                            }}
                        />
                        <InputField
                            fieldRef={ref => this.fieldConfrimNewPassword = ref}
                            onParentPress={() => { if (this.fieldConfrimNewPassword) this.fieldConfrimNewPassword.focus() }}
                            inputContainer={{ paddingRight: 10, backgroundColor: colors.background }}
                            value={confirmNewPassword}
                            hideShadowElevation={true}
                            placeholder={'Confirm New Password'}
                            secureTextEntry={isHiddenConfirmNewPassword}
                            onChangeText={(text) => {
                                this.setState({ confirmNewPassword: text })
                            }}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                            rightIcon={isHiddenConfirmNewPassword ? icons.eyeOpen : icons.eyeClose}
                            rightIconStyle={{ tintColor: '#A4A4A4' }}
                            onRightIconPress={() => {
                                this.setState({ isHiddenConfirmNewPassword: !isHiddenConfirmNewPassword })
                            }}
                        />
                        <Button
                            activityIndicatorProps={{
                                loading: loadingOnSetNewPassword
                            }}
                            containerStyle={{ backgroundColor: colors.green, marginTop: 30, marginBottom: 0 }}
                            buttonTextStyle={{ color: colors.white }}
                            buttonText={'Set as New Passwrod'}
                            onPressButton={() => {
                                this.onSetAsNewPasswrodPress()
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
                    <View style={[styles.modalPasswordStyle, { paddingBottom: 30 }]}>
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
                        <Text style={styles.modalSuccessText}>{'New password is successfully set'}</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    renderContent = () => {
        return (
            <CountryCodePicker
                navigation={this.props.navigation}
                onSelectCountryCode={(_selectedCountryCode) => {
                    this.setState({ selectedCountryCode: _selectedCountryCode }, () => {
                        this.Bsheet.snapTo(1)
                    })
                }}
            />
        )
    }

    render() {
        const {
            loading,
            loadingOnCreateAccount,
            email,
            userType,
            isModeEdit,
            profileStatus,
            name,
            selectedCountryCode,
            phoneNumber,
            typesOfOrganizations,
            selectedTypeOfOrganization,
            previousSelectedIndex,
            services,
            selectedServices,
            password,
            isHiddenPassword,
            confirmPassword,
            isHiddenConfirmPassword,
            profileImage,
            isOpenCountrySelector,
            percentCompleted
        } = this.state
        const { navigation } = this.props

        let profileStatusColor = colors.green
        let profileStatusText = 'Actively looking for travel offers'

        if (profileStatus == THINKING) {
            profileStatusColor = colors.yellow
            profileStatusText = 'Timely looking for travel offers'
        } else if (profileStatus == IDLE) {
            profileStatusColor = colors.red
            profileStatusText = 'Restricted for travel offers'
        }

        return (
            <View style={styles.container}>
                <Header
                    leftIcon={icons.backArrow}
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    hearderText={isModeEdit ? "Profile Setting" : "Sign Up"}
                />
                <KeyboardAwareScrollView
                    innerRef={ref => { this.scroll = ref }}
                    // bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    extraHeight={160}
                    style={{ flexGrow: 1, width: '100%', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.profileImageContainerStyle}>
                            <Image
                                style={{ width: 134, height: 134, borderRadius: 67, resizeMode: 'cover' }}
                                source={profileImage ? { uri: profileImage.uri ? profileImage.uri : profileImage } : images.user}
                            />
                            <TouchableOpacity
                                // activeOpacity={0.7}
                                style={styles.imagePickerButtonStyle}
                                onPress={() => {
                                    permissionCamera().then(result => {
                                        if (result) {
                                            this.setState({ showOptionModal: true })
                                        }
                                    })
                                }}>
                                <Image
                                    style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: colors.grey }}
                                    source={icons.camera}
                                />
                            </TouchableOpacity>
                        </View>

                        {userType === TRAVELER &&
                            <View style={{ fontSize: '600' }}>
                                <Text>{'Profile Status'}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    <CheckBoxRound
                                        disableFunc={true}
                                        disableLable={true}
                                        isChecked={profileStatus == ACTIVE}
                                        label={'Active'}
                                        onPress={() => {
                                            this.setState({ profileStatus: ACTIVE })
                                        }}
                                    />
                                    <CheckBoxRound
                                        disableFunc={true}
                                        disableLable={true}
                                        iconContainer={{ backgroundColor: profileStatus == THINKING ? colors.yellow : colors.mediumGrey }}
                                        isChecked={profileStatus == THINKING}
                                        label={'Thinking'}
                                        onPress={() => {
                                            this.setState({ profileStatus: THINKING })
                                        }}
                                    />
                                    <CheckBoxRound
                                        mainContainer={{ marginRight: 30 }}
                                        disableFunc={true}
                                        disableLable={true}
                                        iconContainer={{ backgroundColor: profileStatus == IDLE ? colors.red : colors.mediumGrey }}
                                        isChecked={profileStatus == IDLE}
                                        label={'Idle'}
                                        onPress={() => {
                                            this.setState({ profileStatus: IDLE })
                                        }}
                                    />
                                </View>
                                <View style={[styles.profileStatusTextContainer, { backgroundColor: (profileStatusColor + '30') }]}>
                                    <Text
                                        style={{
                                            color: profileStatusColor
                                        }}>
                                        {profileStatusText}
                                    </Text>
                                </View>
                            </View>
                        }

                        <InputField
                            fieldRef={ref => this.fieldName = ref}
                            onParentPress={() => { if (this.fieldName) this.fieldName.focus() }}
                            value={name}
                            autoCapitalize={'words'}
                            placeholder={userType == COMPANY ? 'Company Name' : 'Full Name'}
                            textContentType={'name'}
                            autoCompleteType={'name'}
                            returnKeyType='next'
                            onChangeText={(text) => {
                                this.setState({ name: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldPhoneNumber.focus()
                            }}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.countryPickerContainer}
                                onPress={() => {
                                    Keyboard.dismiss()
                                    this.setState({ isOpenCountrySelector: true }, () => {
                                        this.Bsheet.snapTo(0)
                                    })
                                }}>
                                <Text style={{ fontWeight: '600', fontSize: 30, color: 'black' }}>
                                    {nodeEmoji.get(selectedCountryCode.flag)}
                                </Text>
                                <Text style={{ fontSize: 16 }}>
                                    {'   + ' + selectedCountryCode.callingCode[0]}
                                </Text>
                            </TouchableOpacity>
                            <InputField
                                fieldRef={ref => this.fieldPhoneNumber = ref}
                                onParentPress={() => { if (this.fieldPhoneNumber) this.fieldPhoneNumber.focus() }}
                                inputContainer={{ flex: 1, marginLeft: 10 }}
                                value={phoneNumber}
                                autoCapitalize={'none'}
                                placeholder={'Phone Number'}
                                textContentType={'telephoneNumber'}
                                keyboardType={'phone-pad'}
                                autoCompleteType={'tel'}
                                returnKeyType='next'
                                onChangeText={(text) => {
                                    this.setState({ phoneNumber: text })
                                }}
                                onSubmitEditing={() => {
                                    // Keyboard.dismiss()
                                    this.fieldEmail.focus()
                                }}
                                inputAccessoryViewID={inputAccessoryViewID}
                            />
                        </View>

                        {userType === TRAVELER ?
                            <DropDownPicker
                                items={services}
                                selectedItem={selectedServices}
                                dropDownMaxHeight={200}
                                showArrow={true}
                                multiple={true}
                                containerStyle={[styles.countryPickerContainer, { paddingHorizontal: 0 }]}
                                style={{ backgroundColor: colors.transparent, borderWidth: 0 }}
                                placeholder={'Select your service(s)'}
                                placeholderStyle={{ color: colors.mediumGrey }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={(item, index) => {
                                    let servicesTemp = services
                                    servicesTemp[index].isChecked = item.isChecked == true ? false : true
                                    this.setState({ servicesTemp: servicesTemp }, () => {
                                        let selectedServicesFiltered = servicesTemp.filter((item) => item.isChecked)
                                        this.setState({ selectedServices: selectedServicesFiltered })
                                    })
                                }}
                            />
                            :
                            <DropDownPicker
                                items={typesOfOrganizations}
                                selectedItem={selectedTypeOfOrganization}
                                dropDownMaxHeight={200}
                                showArrow={true}
                                multiple={false}
                                containerStyle={[styles.countryPickerContainer, { paddingHorizontal: 0 }]}
                                style={{ backgroundColor: colors.transparent, borderWidth: 0 }}
                                placeholder={'Type of Organization'}
                                placeholderStyle={{ color: colors.mediumGrey }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={(item, index) => {
                                    let typesOfOrganizationsTemp = typesOfOrganizations
                                    typesOfOrganizationsTemp[previousSelectedIndex].isChecked = false
                                    typesOfOrganizationsTemp[index].isChecked = item.isChecked == true ? false : true
                                    this.setState({ typesOfOrganizations: typesOfOrganizationsTemp }, () => {
                                        this.setState({ selectedTypeOfOrganization: item, previousSelectedIndex: index })
                                    })
                                }}
                            />
                        }
                        <InputField
                            fieldRef={ref => this.fieldEmail = ref}
                            onParentPress={() => { if (this.fieldEmail) this.fieldEmail.focus() }}
                            value={email}
                            autoCapitalize={'none'}
                            placeholder={'Email Address'}
                            textContentType={'emailAddress'}
                            keyboardType={'email-address'}
                            autoCompleteType={'email'}
                            returnKeyType='next'
                            onChangeText={(text) => {
                                this.setState({ email: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldPassword.focus()
                            }}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                        <InputField
                            fieldRef={ref => this.fieldPassword = ref}
                            onParentPress={() => { if (this.fieldPassword) this.fieldPassword.focus() }}
                            editable={!isModeEdit}
                            inputContainer={{ paddingRight: 10 }}
                            value={password}
                            placeholder={'Password'}
                            secureTextEntry={isHiddenPassword}
                            returnKeyType='next'
                            onChangeText={(text) => {
                                this.setState({ password: text })
                            }}
                            onSubmitEditing={() => {
                                this.fieldConfrimPassword.focus()
                            }}
                            rightIcon={isHiddenPassword ? icons.eyeOpen : icons.eyeClose}
                            rightIconStyle={{ tintColor: '#A4A4A4' }}
                            onRightIconPress={() => {
                                if (isModeEdit) {
                                    this.setState({ showPasswordChangeModal: true })
                                } else {
                                    this.setState({ isHiddenPassword: !isHiddenPassword })
                                }
                            }}
                            rightText={isModeEdit ? 'Change' : false}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                        {!isModeEdit &&
                            <InputField
                                fieldRef={ref => this.fieldConfrimPassword = ref}
                                onParentPress={() => { if (this.fieldConfrimPassword) this.fieldConfrimPassword.focus() }}
                                inputContainer={{ paddingRight: 10 }}
                                value={confirmPassword}
                                placeholder={'Confirm Password'}
                                secureTextEntry={isHiddenConfirmPassword}
                                onChangeText={(text) => {
                                    this.setState({ confirmPassword: text })
                                }}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                                rightIcon={isHiddenConfirmPassword ? icons.eyeOpen : icons.eyeClose}
                                rightIconStyle={{ tintColor: '#A4A4A4' }}
                                onRightIconPress={() => {
                                    this.setState({ isHiddenConfirmPassword: !isHiddenConfirmPassword })
                                }}
                                inputAccessoryViewID={inputAccessoryViewID}
                            />
                        }
                        {userType == COMPANY &&
                            <ButtonWithIcon
                                containerStyle={{ backgroundColor: colors.lightGrey, paddingHorizontal: 20 }}
                                buttonTextStyle={{ color: colors.mediumGrey, fontSize: 14 }}
                                buttonText={'Plans & Payment'}
                                onPressButton={() => {
                                    navigation.navigate('PaymentPlanScreen')
                                }}
                            />
                        }
                    </View>
                    <Button
                        activityIndicatorProps={{ loading: loadingOnCreateAccount }}
                        containerStyle={{ backgroundColor: (userType == COMPANY && !isModeEdit) ? colors.primary : colors.green, marginBottom: 70 }}
                        buttonTextStyle={{ color: colors.white }}
                        buttonText={isModeEdit ? 'Save' : 'Create Account'}
                        onPressButton={() => {
                            if (isModeEdit) {
                                this.onSavePress()
                            } else {
                                this.onCreateAccoutPress()
                            }
                        }}
                    />
                </KeyboardAwareScrollView>
                {this.renderOptionModel()}
                {this.renderSuccessModal()}
                {this.renderPasswordChangeModal()}
                {isOpenCountrySelector &&
                    <View style={{ flex: 1, backgroundColor: '#00000020', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <BottomSheet
                            ref={(ref) => this.Bsheet = ref}
                            snapPoints={[height * 0.85, 0]}
                            borderRadius={20}
                            initialSnap={1}
                            renderContent={() => this.renderContent()}
                            onCloseEnd={() => { this.setState({ isOpenCountrySelector: false }) }}
                        />
                    </View>
                }
                <KeyboardAccessoryView inputAccessoryViewID={inputAccessoryViewID} />
                <Loader loading={loading} />
                {loadingOnCreateAccount &&
                    <SafeAreaView style={{ width: '100%', height: 5, top: 0, position: 'absolute', justifyContent: 'center' }}>
                        <View style={{ width: (percentCompleted + '%'), height: 5, backgroundColor: colors.primary }}></View>
                    </SafeAreaView>
                }
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
    countryPickerContainer: {
        flexDirection: 'row',
        minHeight: 55,
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        marginTop: 10,
        borderRadius: 10,
        paddingHorizontal: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 10.84,

        elevation: 5,
    },
    buttonTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colors.white,
        textAlign: 'center'
    },
    checkCircle: {
        width: 15,
        height: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7.5,
        marginRight: 5,
        padding: 2.5
    },
    horizontalDivider: {
        flex: 1,
        backgroundColor: colors.mediumGrey,
        height: 1
    },
    profileImageContainerStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 152,
        height: 152,
        padding: 8,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: colors.grey,
        marginBottom: 20
    },
    imagePickerButtonStyle: {
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        position: 'absolute',
        bottom: 8,
        right: 8,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 10.84,

        elevation: 5,
    },
    modalStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
        // backgroundColor: '#00000000'
    },
    profileStatusTextContainer: {
        width: '100%',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        // alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
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
    modalPasswordStyle: {
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

