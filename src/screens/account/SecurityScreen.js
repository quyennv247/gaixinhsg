import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../../constants';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();
import AntDesign from 'react-native-vector-icons/AntDesign';
AntDesign.loadFont();
import AlertModal from "../../components/AlertModal";
import AsyncStorage from '@react-native-community/async-storage';
import { Switch } from 'react-native-paper';

class SecurityScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            password: '',
            confirmPassword: '',
            loading: false,
            securePasswordEntry: true,
            secureConfirmPasswordEntry: true,
            isRequirePassword: false,
            lengthPassword: true,
            isValidPassword: true,
            isValidConfirmPassword: true,
            isRequireConfirmPassword: true,
            comparePassword: true,
            showAlert: false,
            message: '',
            securityOn: false
        }
    }

    async componentDidMount(){
        const security = await AsyncStorage.getItem('security');
        if(security !== null && security !== ''){
            this.setState({securityOn: true});
        }
        else{
            this.setState({securityOn: false});
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

    onToggleSwitch = () => {
        this.setState({securityOn: !this.state.securityOn});
    }

    handleSubmit = async (password, confirmPassword) => {
        if(this.state.securityOn == true){
            let valid = false;
            valid = this.handlePasswordChange(password);
            if(valid){
                valid = this.handleConfirmPasswordChange(password, confirmPassword);
            }
            if(valid){
                await AsyncStorage.setItem('security', password);
                this.setState({message: 'Thiết lập thành công'});
                this.setState({showAlert: true});
            }
        }
        else{
            await AsyncStorage.setItem('security', '');
                this.setState({message: 'Cập nhật thành công'});
                this.setState({showAlert: true});
        }
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
                    <Text style={styles.title}>Thiết lập mật khẩu</Text>
                    <Pressable style={styles.btnSave} onPress={() => this.handleSubmit(this.state.password, this.state.confirmPassword)}>
                        <Text style={styles.btnSaveText}>Lưu</Text>
                    </Pressable>
                </View>
                <View style={styles.body}>
                    <View style={styles.titlePage}>
                        <Text style={styles.titleText}>Thiết lập mật khẩu khi truy cập ứng dụng GAIXINHSG.INFO</Text>
                    </View>
                    <View style={styles.form}>
                        <View style={styles.switch}>
                            <View><Text style={styles.switchTitle}>Đặt mã khóa</Text></View>
                            <View><Switch offColor={{ color: '#FFFFFF'}} value={this.state.securityOn} onValueChange={this.onToggleSwitch} /></View>
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
                    </View>
                </View>
                <AlertModal navigation={ this.props.navigation } show={this.state.showAlert} message={this.state.message} close={this.closeAlert} />
            </SafeAreaView>
        );
    }

};

const styles = StyleSheet.create({
    switch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        height: 40,
    },

    switchTitle: {
        color: COLORS.textGray
    },

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
        flex:1,
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

export default SecurityScreen;