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
import smsService from "../../api/smsService";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class ForgetPasswordScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            loading: false,
            isValidUser: true
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

    handleSubmit = (userName) => {
        let valid = this.handleUserChange(userName);
        if(valid){
            this.setState({loading: true});
        
            smsService.getPhone(userName).then((response) => {
                this.setState({loading: false});
                if(response.statusCode == 200){
                    this.props.navigation.navigate('OTP', {
                        id: response.data.UserName
                    });
                }
                else{
                    alert(response.error);
                }
            }).finally(() => {  this.setState({loading: false}); });
        }
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
                        <Text style={styles.titleText}>Quên mật khẩu</Text>
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
                        
                        <View style={styles.action}>
                            <TouchableOpacity onPress={() => this.handleSubmit(this.state.username) } style={styles.signIn}>
                                <Text style={styles.signInText}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Loading show={this.state.loading} />

                </KeyboardAwareScrollView>
            </View>
        )
    }
};

export default ForgetPasswordScreen

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