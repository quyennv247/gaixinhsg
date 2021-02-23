import React from 'react';
import { 
    View,
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { COLORS } from '../../constants';
import Loading from "../../components/Loading";
import smsService from "../../api/smsService";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AlertModal from "../../components/AlertModal";

class ResetPasswordScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            otp: '',
            username: '',
            password: '',
            confirmPassword: '',
            loading: false,
            securePasswordEntry: true,
            secureConfirmPasswordEntry: true,
            isValidOtp: true,
            isRequireUser: true,
            isRequirePassword: true,
            lengthPassword: true,
            isValidPassword: true,
            isValidConfirmPassword: true,
            isRequireConfirmPassword: true,
            comparePassword: true,
            success: false,
            showAlert: false,
            message: ''
        }
    }

    componentDidMount () {
        this.setState({
            userId: this.props.route.params.userId,
            username : this.props.route.params.username
        });
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


    handleOTPChange = (val) => {
        if(val !== '') {
            this.setState({
                otp: val,
                isValidOtp: true
            });
            return true;
        } else {
            this.setState({
                otp: val,
                isValidOtp: false
            });
            return false;
        }
    }

    handleSubmit = (otp, password, confirmPassword) => {
        let valid = false;
        if(this.handleOTPChange(otp)){
            valid = this.handlePasswordChange(password);
        }
        if(valid){
            valid = this.handleConfirmPasswordChange(password, confirmPassword);
        }

        if(valid){
            this.setState({loading: true});
            smsService.updatePassword(this.state.userId, otp, password).then((response) => {
                this.setState({loading: false});
                if(response.statusCode == 200){
                    this.setState({showAlert: true, message: "Đổi mật khẩu thành công."});
                }
                else{
                    this.setState({showAlert: true, message: response.error});
                }
            }).finally(() => {  this.setState({loading: false}); });
        }
    }

    handleClose = () => {
        this.props.navigation.navigate('Login');
    }

    closeAlert = () => {
        this.setState({showAlert: false});
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <KeyboardAwareScrollView style={{flex: 1}} behavior="padding">
                <TouchableOpacity onPress={() => this.handleClose()} style={styles.closeBtn} >
                    <Ionicons style={styles.iconClose} name="close-outline" />
                </TouchableOpacity>
                
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>Đổi mật khẩu</Text>
                    </View>
                    <View style={styles.form}>
                        <View style={styles.formGroup}>
                            <FontAwesome name="user-o" style={styles.iconInput}/>
                            <TextInput value={this.state.username} editable={false} style={styles.input} placeholder="Tên đăng nhập" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                        </View>

                        { this.state.isValidOtp ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                <Text style={styles.errorMsg}>Vui lòng nhập mã OTP.</Text>
                            </Animatable.View>
                        }
                        <View style={styles.formGroup}>
                            <FontAwesome name="gg" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handleOTPChange(val)} style={styles.input} placeholder="Mã OTP" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
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

                        <View style={styles.action}>
                            <TouchableOpacity onPress={() => this.handleSubmit(this.state.otp, this.state.password, this.state.confirmPassword) } style={styles.signIn}>
                                <Text style={styles.signInText}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Loading show={this.state.loading} />

                <AlertModal navigation={ this.props.navigation } show={this.state.showAlert} message={this.state.message} close={this.closeAlert} />

                </KeyboardAwareScrollView>
            </View>
        )
    }
};

export default ResetPasswordScreen

const styles = StyleSheet.create({
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
        color: COLORS.textGray,
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
        color: COLORS.textGray
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