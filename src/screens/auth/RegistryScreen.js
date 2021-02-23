import React from 'react';
import { 
    View,
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    SafeAreaView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont();
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { COLORS } from '../../constants';
import Loading from "../../components/Loading";
import Success from "./Success";
import accountService from "../../api/accountService";
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioButton } from 'react-native-paper';

class RegistryScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            phone: '',
            loading: false,
            securePasswordEntry: true,
            secureConfirmPasswordEntry: true,
            isValidUser: true,
            lengthUserName: true,
            isRequireUser: true,
            isRequirePassword: true,
            lengthPassword: true,
            isValidPassword: true,
            isValidConfirmPassword: true,
            isRequireConfirmPassword: true,
            comparePassword: true,
            success: false,
            gender: '1',
            isRequirePhone: true,
            isValidPhone: true,
            isPhoneNumber: true,
        }
    }

    componentDidMount(){
       
    }

    isPhoneNumber = (number) => {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
    }

    updateSecurePasswordEntry = () => {
        this.setState({securePasswordEntry: !this.state.securePasswordEntry});
    }

    updateSecureConfirmPasswordEntry = () => {
        this.setState({secureConfirmPasswordEntry: !this.state.secureConfirmPasswordEntry});
    }

    handlePasswordChange = (val) => {
        if(val == '') {
            this.setState({
                password: val,
                isValidPassword: false,
                isRequirePassword: true,
                lengthPassword: true
            });
            return false;
        } 
        else if(val.trim().length < 4) {
            this.setState({
                password: val,
                isValidPassword: false,
                isRequirePassword: false,
                lengthPassword: false
            });
            return false;
        } 
        else {
            this.setState({
                password: val,
                isValidPassword: true,
                isRequirePassword: false,
                lengthPassword: true
            });
            return true;
        }
    }

    handleConfirmPasswordChange = (password, val) => {
        if( val !== '' ) {
            if( password === val ) {
                this.setState({
                    confirmPassword: val,
                    isValidConfirmPassword: true
                });

                return true;
            } 
            else {
                this.setState({
                    confirmPassword: val,
                    isValidConfirmPassword: false,
                    isRequireConfirmPassword: false,
                    comparePassword: false
                });
            }
        }
        else{
            this.setState({
                confirmPassword: val,
                isValidConfirmPassword: false,
                isRequireConfirmPassword: true,
                comparePassword: true
            });
        }
        return false;
    }

    handleUserChange = (val) => {
        if(val == '') {
            this.setState({
                username: val,
                isValidUser: false,
                lengthUserName: true,
                isRequireUser: true
            });
            return false;
        } 
        else if(val.trim().length < 4) {
            this.setState({
                username: val,
                isValidUser: false,
                lengthUserName: false,
                isRequireUser: false
            });
            return false;
        }
        else{
            this.setState({
                username: val,
                isValidUser: true,
                lengthUserName: true,
                isRequireUser: false
            });
            return true;
        }
    }

    handleRegistry = (userName, password, confirmPassword) => {
        let valid = false;
        if(this.handleUserChange(userName)){
            valid = this.handlePasswordChange(password);
        }
        if(valid){
            valid = this.handleConfirmPasswordChange(password, confirmPassword);
        }

        if(valid){
            this.setState({loading: true});

            const entity = {
                UserName: userName,
                Password: password,
                FirstName: '',
                LastName: '',
                Phone: this.state.phone,
                Gender: this.state.gender
            };
        
            accountService.registry(entity).then((response) => {
                this.setState({loading: false});
                if(response.statusCode == 200){
                    this.setState({success: true});
                }
                else{
                    alert(response.error);
                }
            }).finally(() => { this.setState({loading: false}); });
        }
    }

    handlePhoneChange = (val) => {
        if(val == '') {
            this.setState({
                phone: val,
                isValidPhone: false,
                isPhoneNumber: true,
                isRequirePhone: true
            });
            return false;
        } 
        else if (this.isPhoneNumber(val.trim()) == false) {
            this.setState({
                phone: val,
                isValidPhone: false,
                isPhoneNumber: false,
                isRequirePhone: false
            });
            return false;
        }
        else{
            this.setState({
                phone: val,
                isValidPhone: true,
                isPhoneNumber: true,
                isRequirePhone: false
            });
            return true;
        }
    }


    setGender = (gender) => {
        this.setState({ gender: gender });
    }

    setLoginInfo = async (data) => {
        await AsyncStorage.setItem('access_token', data.AccessToken);
        await AsyncStorage.setItem('login_id', data.UserInfo.Id.toString());
        await AsyncStorage.setItem('user_name', data.UserInfo.UserName);
    }

    closeSuccess = () => {
        this.setState({ success: false });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                
                <KeyboardAwareScrollView style={{flex: 1}} behavior="padding">
                
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.closeBtn} >
                    <Ionicons style={styles.iconClose} name="close-outline" />
                </TouchableOpacity>
               
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>Tạo tài khoản</Text>
                    </View>
                    <View style={styles.form}>
                        { 
                            this.state.isValidUser ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                {
                                    this.state.isRequireUser == false ? null : <Text style={styles.errorMsg}>Vui lòng nhập tên đăng nhập.</Text>
                                }
                                {
                                this.state.lengthUserName == true ? null : <Text style={styles.errorMsg}>Tên đăng nhập tối thiểu 4 ký tự.</Text>
                                }
                            </Animatable.View>
                        }

                        <View style={styles.formGroup}>
                            <FontAwesome name="user-o" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handleUserChange(val)} style={styles.input} placeholder="Tên đăng nhập" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                        </View>
                        
                        { 
                            this.state.isValidPassword ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                {
                                    this.state.isRequirePassword == false ? null : <Text style={styles.errorMsg}>Vui lòng nhập mật khẩu.</Text>
                                }
                                {
                                    this.state.lengthPassword == true ? null : <Text style={styles.errorMsg}>Mật khẩu tối thiểu 4 ký tự.</Text>
                                }
                            </Animatable.View>
                        }

                        <View style={styles.formGroup}>
                            <Feather name="lock" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handlePasswordChange(val)} secureTextEntry={this.state.securePasswordEntry ? true : false} style={styles.input} placeholder="Mật khẩu" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                            <TouchableOpacity style={styles.btnShowPass} onPress={ () => this.updateSecurePasswordEntry()} >
                                {this.state.securePasswordEntry 
                                ?  <Feather name="eye-off" style={styles.iconPass} />
                                : <Feather name="eye" style={styles.iconPass} />
                                }
                            </TouchableOpacity>
                        </View>

                        { 
                            this.state.isValidConfirmPassword ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                {
                                    this.state.isRequireConfirmPassword == false ? null : <Text style={styles.errorMsg}>Vui lòng nhập lại mật khẩu.</Text>
                                }
                                {
                                    this.state.comparePassword == true ? null : <Text style={styles.errorMsg}>Nhập lại mật khẩu không đúng.</Text>
                                }
                            </Animatable.View>
                        }
                        
                        <View style={styles.formGroup}>
                            <Feather name="lock" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handleConfirmPasswordChange(this.state.password, val)} secureTextEntry={this.state.secureConfirmPasswordEntry ? true : false} style={styles.input} placeholder="Nhập lại mật khẩu" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                            <TouchableOpacity style={styles.btnShowPass} onPress={ () => this.updateSecureConfirmPasswordEntry()} >
                                {this.state.secureConfirmPasswordEntry 
                                ?  <Feather name="eye-off" style={styles.iconPass} />
                                : <Feather name="eye" style={styles.iconPass} />
                                }
                            </TouchableOpacity>
                        </View>

                        { 
                            this.state.isValidPhone ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                {
                                    this.state.isValidPhone == false ? null : <Text style={styles.errorMsg}>Vui lòng nhập số điện thoại.</Text>
                                }
                                {
                                this.state.isPhoneNumber == true ? null : <Text style={styles.errorMsg}>Số điện thoại không đúng.</Text>
                                }
                            </Animatable.View>
                        }

                        <View style={styles.formGroup}>
                            <FontAwesome name="phone" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handlePhoneChange(val)} style={styles.input} placeholder="Số điện thoại" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                        </View>

                        <View style={styles.gender}>
                            <View style={styles.genderMale}>
                                <RadioButton
                                    value="1"
                                    uncheckedColor={COLORS.textGray}
                                    status={ this.state.gender === '1' ? 'checked' : 'unchecked' }
                                    onPress={() => this.setGender('1')}
                                /> 
                                <Text style={styles.genderTitle}>Nam</Text>
                            </View>

                            <View style={styles.genderFemale}>
                                <RadioButton
                                    uncheckedColor={COLORS.textGray}
                                    value="2"
                                    status={ this.state.gender === '2' ? 'checked' : 'unchecked' }
                                    onPress={() => this.setGender('2')}
                                />
                                <Text style={styles.genderTitle}>Nữ</Text>
                            </View>
                        </View>

                        <View style={styles.action}>
                            <TouchableOpacity onPress={() => this.handleRegistry(this.state.username, this.state.password, this.state.confirmPassword) } style={styles.signIn}>
                                <Text style={styles.signInText}>Đăng ký</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </KeyboardAwareScrollView>

                <Loading show={this.state.loading} />

                <Success navigation={ this.props.navigation } closeSuccess={this.closeSuccess} show={this.state.success} />
                
            </SafeAreaView>
        )
    }
};

export default RegistryScreen

const styles = StyleSheet.create({
    gender: {
        flexDirection: 'row',
        paddingBottom: 20
    },

    genderMale: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingRight: 20
    },

    genderFemale: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },

    genderTitle: {
        color: COLORS.textGray
    },

    container: {
        flex: 1, 
        backgroundColor: COLORS.bg,
        flexDirection: 'column'
    },

    closeBtn: {
        position: 'absolute',
        top: 30,
        paddingLeft: 15,
        zIndex: 9999,
        width: 50,
        height: 40
    },

    iconClose: {
        color: COLORS.textGray,
        fontSize: 28
    },
    
    body: {
        flex: 1,
        backgroundColor: COLORS.bg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        position: 'relative',
        width: '100%',
        paddingTop: 50
    },

    title: {
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20
    },

    titleText:{
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold'
    },

    form:{

    },

    formGroup: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bgHeader,
        borderRadius: 100,
        marginBottom: 15
    },

    iconInput: {
        width: 30,
        paddingLeft: 15,
        position: 'relative',
        color: COLORS.textGray,
        fontSize: 14
    },

    btnShowPass: {
        position: 'absolute',
        right: 0
    },

    iconPass: {
        width: 30,
        right: 0,
        color: COLORS.textGray,
        fontSize: 14,
    },

    input: {
        backgroundColor: COLORS.bgHeader,
        borderRadius: 100,
        height: 40,
        width: '90%',
        color: COLORS.white
    },

    action: {
        flexDirection: 'column'
    },

    signIn: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 30
    },

    signInText: {
        color: COLORS.white,
        fontSize: 16
    },

    forgot: {
        flexDirection: 'row',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    forgotText: {

    },

    signUp: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    signUpText: {
        color: COLORS.textGray
    },

    signUpBtn: {
        color: COLORS.primary,
        paddingLeft: 10,
    },

    invalid: {
        position: 'relative',
        paddingLeft: 12,
        paddingTop: 0
    },

    errorMsg: {
        color: COLORS.secondary,
        fontSize: 12
    }
    
  });