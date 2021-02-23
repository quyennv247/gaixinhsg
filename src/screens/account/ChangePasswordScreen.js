import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../../constants';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();
import AntDesign from 'react-native-vector-icons/AntDesign';
AntDesign.loadFont();
import userService from "../../api/userService";
import Loading from "../../components/Loading";
import ChangePasswordSuccess from "./components/ChangePasswordSuccess";
import AlertModal from "../../components/AlertModal";

class ChangePasswordScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            oldPassword: '',
            password: '',
            confirmPassword: '',
            loading: false,
            secureOldPasswordEntry: true,
            securePasswordEntry: true,
            secureConfirmPasswordEntry: true,
            isRequireOldPassword: false,
            isRequirePassword: false,
            lengthPassword: true,
            isValidPassword: true,
            isValidConfirmPassword: true,
            isRequireConfirmPassword: true,
            comparePassword: true,
            success: false,
            showAlert: false,
            message: '',
        }
    }

    handleOldPasswordChange = (val) => {
        if(val == '') {
            this.setState({
                oldPassword: val,
                isRequireOldPassword: true
            });
            return false;
        }
        else{
            this.setState({
                oldPassword: val,
                isRequireOldPassword: false
            });
            return true;
        }
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

    closeAlert = () => {
        this.setState({showAlert: false});
    }

    handleSubmit = (oldPassword, password, confirmPassword) => {
        let valid = false;
        if(this.handleOldPasswordChange(oldPassword)){
            valid = this.handlePasswordChange(password);
        }
        if(valid){
            valid = this.handleConfirmPasswordChange(password, confirmPassword);
        }

        if(valid){
            this.setState({loading: true});

            userService.changePassword(oldPassword, password).then((response) => {
                this.setState({loading: false});
                if(response.statusCode == 200){
                    this.setState({success: true});
                }
                else{
                    this.setState({showAlert: true, message: response.error});
                }
            }).finally(() => { this.setState({loading: false}); });
        }
    }

    updateSecureOldPasswordEntry = () => {
        this.setState({secureOldPasswordEntry: !this.state.secureOldPasswordEntry});
    }

    updateSecurePasswordEntry = () => {
        this.setState({securePasswordEntry: !this.state.securePasswordEntry});
    }

    updateSecureConfirmPasswordEntry = () => {
        this.setState({secureConfirmPasswordEntry: !this.state.secureConfirmPasswordEntry});
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                <View style={styles.navigation}>
                    <TouchableOpacity style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                        <AntDesign style={styles.backIcon} name="left" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Đổi mật khẩu</Text>
                    <Pressable style={styles.btnSave} onPress={() => this.handleSubmit(this.state.oldPassword, this.state.password, this.state.confirmPassword)}>
                        <Text style={styles.btnSaveText}>Lưu</Text>
                    </Pressable>
                </View>
                <View style={styles.body}>
                    <View style={styles.titlePage}>
                        <Text style={styles.titleText}>Vui lòng nhập mật khẩu cũ và nhập mật mới để thay đổi.</Text>
                    </View>
                    <View style={styles.form}>
                        { 
                            this.state.isRequireOldPassword == false ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                <Text style={styles.errorMsg}>Vui lòng nhập mật khẩu cũ.</Text>
                            </Animatable.View>
                        }

                        <View style={styles.formGroup}>
                            <Feather name="lock" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handleOldPasswordChange(val)} secureTextEntry={this.state.secureOldPasswordEntry ? true : false} style={styles.input} placeholder="Mật khẩu cũ" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                            <TouchableOpacity style={styles.btnShowPass} onPress={ () => this.updateSecureOldPasswordEntry()} >
                                {this.state.secureOldPasswordEntry 
                                ?  <Feather name="eye-off" style={styles.iconPass} />
                                : <Feather name="eye" style={styles.iconPass} />
                                }
                            </TouchableOpacity>
                        </View>
                        { 
                            this.state.isValidPassword ? null : 
                            <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                                {
                                    this.state.isRequirePassword == false ? null : <Text style={styles.errorMsg}>Vui lòng nhập mật khẩu mới.</Text>
                                }
                                {
                                    this.state.lengthPassword == true ? null : <Text style={styles.errorMsg}>Mật khẩu tối thiểu 4 ký tự.</Text>
                                }
                            </Animatable.View>
                        }

                        <View style={styles.formGroup}>
                            <Feather name="lock" style={styles.iconInput}/>
                            <TextInput onChangeText={(val) => this.handlePasswordChange(val)} secureTextEntry={this.state.securePasswordEntry ? true : false} style={styles.input} placeholder="Mật khẩu mới" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
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
                                    this.state.isRequireConfirmPassword == false ? null : <Text style={styles.errorMsg}>Vui lòng nhập lại mật khẩu mới.</Text>
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
                    </View>
                </View>

                <Loading show={this.state.loading} />

                <AlertModal navigation={ this.props.navigation } show={this.state.showAlert} message={this.state.message} close={this.closeAlert} />

                <ChangePasswordSuccess navigation={ this.props.navigation } show={this.state.success} />
            </SafeAreaView>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgHeader
    },

    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        borderBottomColor: COLORS.bgHeader,
        borderBottomWidth: 0.5,
        backgroundColor: COLORS.bgHeader,
        height: SIZES.NavigationHeight,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight
    },

    btnBack: {
        width: 50,
        height: 20,
        width: 35,
        paddingLeft: 10
    },

    backIcon:{
        color: COLORS.white,
        fontSize: 18
    },

    title: {
        color: COLORS.white,
        fontSize: 16
    },

    btnSave: {
        paddingRight: 15,
        paddingTop: 13,
        height: 45,
    },

    btnSaveText: {
        color: COLORS.primary,
        fontSize: 16
    },

    body: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingHorizontal: 10,
        paddingTop: 10,
        width: '100%',
    },

    titlePage: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        flexWrap: 'wrap'
    },

    titleText:{
        color: COLORS.textGray,
        fontSize: 12,
        width: '100%',
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
        position: 'relative'
    },

    iconPass: {
        width: 30,
        color: COLORS.textGray,
        fontSize: 14,
    },

    input: {
        backgroundColor: COLORS.bgHeader,
        borderRadius: 100,
        height: 40,
        width: '83%',
        color: COLORS.textGray,
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

})

export default ChangePasswordScreen;