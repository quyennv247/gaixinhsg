import React from 'react';
import { 
    View,
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import { COLORS } from '../../constants';
import Loading from "../../components/Loading";
import accountService from "../../api/accountService";
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class LoginScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            loading: false,
            secureTextEntry: true,
            isValidUser: true,
            isValidPassword: true,
        }
    }

    updateSecureTextEntry = () => {
        this.setState({secureTextEntry: !this.state.secureTextEntry});
    }

    handlePasswordChange = (val) => {
        if(val !== '') {
            this.setState({
                password: val,
                isValidPassword: true
            });
            return true;
        } else {
            this.setState({
                password: val,
                isValidPassword: false
            });
            return false;
        }
    }

    handleUserChange = (val) => {
        if(val !== '') {
            this.setState({
                username: val,
                isValidUser: true
            });
            return true;
        } else {
            this.setState({
                username: val,
                isValidUser: false
            });
            return false;
        }
    }

    handleLogin = (userName, password) => {
        let valid = false;
        if(this.handleUserChange(userName)){
            valid = this.handlePasswordChange(password);
        }

        if(valid){
            this.setState({loading: true});
        
            const entity = {
                UserName: userName,
                Password: password
            };

            accountService.login(entity).then((response) => {
                this.setState({loading: false});
                if(response.statusCode == 200){
                    this.setLoginInfo(response.data);
                    this.props.navigation.navigate("Girl");
                }
                else{
                    alert(response.error);
                }
            }).finally(() => {  this.setState({loading: false}); });
        }
    }

    setLoginInfo = async (data) => {
        await AsyncStorage.setItem('access_token', data.AccessToken);
        await AsyncStorage.setItem('login_id', data.UserInfo.Id.toString());
        await AsyncStorage.setItem('user_name', data.UserInfo.UserName);
    }

    handleClose = () => {
        if( this.props.route.params == null){
            this.props.navigation.goBack();
        }
        else{
            const { screen } = this.props.route.params;

            if(screen !== ''){
                this.props.navigation.navigate(screen);
            }
            else{
                this.props.navigation.goBack();
            }
        }
        
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
                        <Text style={styles.titleText}>Welcome</Text>
                    </View>
                    <View style={styles.form}>
                        { this.state.isValidUser ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                <Text style={styles.errorMsg}>Vui lòng nhập tên đăng nhập.</Text>
                            </Animatable.View>
                        }
                        <View style={styles.formGroup}>
                            <FontAwesome name="user-o" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handleUserChange(val)} style={styles.input} placeholder="Tên đăng nhập" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                        </View>
                        
                        { this.state.isValidPassword ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                <Text style={styles.errorMsg}>Vui lòng nhập mật khẩu.</Text>
                            </Animatable.View>
                        }
                        <View style={styles.formGroup}>
                            <Feather name="lock" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handlePasswordChange(val)} secureTextEntry={this.state.secureTextEntry ? true : false} style={styles.input} placeholder="Mật khẩu" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                            <TouchableOpacity style={styles.btnShowPass} onPress={ () => this.updateSecureTextEntry()} >
                                {this.state.secureTextEntry 
                                ?  <Feather name="eye-off" style={styles.iconPass} />
                                : <Feather name="eye" style={styles.iconPass} />
                                }
                            </TouchableOpacity>
                        </View>

                        <View style={styles.action}>
                            <TouchableOpacity onPress={() => this.handleLogin(this.state.username, this.state.password) } style={styles.signIn}>
                                <Text style={styles.signInText}>Login</Text>
                            </TouchableOpacity>

                            <View style={styles.forgot}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgetPassword')}>
                                    <Text style={styles.forgotText}>Quên mật khẩu ?</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.signUp}>
                                <Text style={styles.signUpText}>Bạn chưa có tài khoản?</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Registry')}>
                                    <Text style={styles.signUpBtn}>Đăng ký</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <Loading show={this.state.loading} />

                </KeyboardAwareScrollView>
            </View>
        )
    }
};

export default LoginScreen

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
        color: COLORS.blue
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