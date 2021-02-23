import React from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { COLORS } from "../../constants";
import EvilIcons from "react-native-vector-icons/EvilIcons";
EvilIcons.loadFont();
import FontAwesome from "react-native-vector-icons/FontAwesome";
FontAwesome.loadFont();
import Fontisto from "react-native-vector-icons/Fontisto";
Fontisto.loadFont();
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
MaterialIcons.loadFont();
var { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import userService from "../../api/userService";
import { Spinner } from "../../components/Spinner";
import AntDesign from "react-native-vector-icons/AntDesign";
AntDesign.loadFont();

class AccountScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            loginId: '0',
            userName: '',
            loading: false,
            showAlert: false,
            genderModal: false,
            textInputValue: '',
            message: '',
            id: 0,
            firstName: '',
            lastName: '',
            fullName: '',
            avatar: '',
            address: '',
            email: '',
            gender: '',
            birthday: 'Ngày sinh',
            genderTitle: 'Giới tính',
            showBirthday: false,
            resourcePath: {}
        };
    }

    async componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.getLoginInfo();
        });
    }

    getLoginInfo = async () => {
        const loginId = await AsyncStorage.getItem('login_id');
        const userName = await AsyncStorage.getItem('user_name');

        await this.setState({
            loginId: loginId,
            userName: userName
        });

        if(loginId !== null && loginId !== '' && loginId !== '0' && loginId !== 0){
            this.getInfo();
        }
        else{
            this.setState({ id: 0 });
        }
    }

    getInfo = async () => {
        this.setState({loading: true});
        userService.getInfo().then((response) => {
            this.setState({loading: false});
       
            if(response.statusCode == 200){
                this.setState({
                    id: response.data.Id,
                    userName: response.data.UserName,
                    firstName: response.data.FirstName,
                    lastName: response.data.LastName,
                    fullName: response.data.FullName,
                    address: response.data.Address,
                    phone: response.data.Phone,
                    email: response.data.Email,
                    gender: response.data.Gender,
                    genderTitle: response.data.GenderTitle,
                    birthday: response.data.Birthday == '' ? 'Ngày sinh' : response.data.Birthday,
                    createTime: response.data.CreateDate,
                });
            }
        }).finally(() => { this.setState({loading: false}); });
    }

    handleMessage(){
        if(this.state.id == 0 || this.state.id == '0'){
            this.props.navigation.navigate('Login');
        }
        else{
            this.props.navigation.navigate('Messenger')
        }
    }
    
    handleToProfile(){
        if(this.state.id == 0 || this.state.id == '0'){
            this.props.navigation.navigate('Login');
        }
        else{
            this.props.navigation.navigate('Profile')
        }
    }

    handleToChangePassword(){
        if(this.state.id == 0 || this.state.id == '0'){
            this.props.navigation.navigate('Login');
        }
        else{
            this.props.navigation.navigate('ChangePassword')
        }
    }

    handleLogin(){
        this.props.navigation.navigate('Login');
    }

    handleRegistry(){
        this.props.navigation.navigate('Registry');
    }

    logout = async () => {
        try {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('login_id');
            await AsyncStorage.removeItem('user_name');

            alert('Logout thành công');
            
            this.props.navigation.navigate('Girl');
        }
        catch(exception) {
            return false;
        }
    }

    render(){
        return(
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <EvilIcons style={styles.iconAvatar} name="user"/>
                    </View>
                    {
                        this.state.loading
                        ? <Spinner/>
                        :
                            this.state.id == 0
                            ? <View style={styles.info}>
                                <View style={styles.button}>
                                    <Pressable onPress={() => this.handleLogin()}>
                                        <Text style={styles.btnLogin}>Đăng nhập</Text>
                                    </Pressable>
                                    <Pressable onPress={() => this.handleRegistry()}>
                                        <Text style={styles.btnRegistry}> / Đăng ký</Text>
                                    </Pressable>
                                </View>
                            </View>
                            :<View style={styles.info}>
                                <View style={styles.item}>
                                    <Text style={styles.username}>{this.state.userName}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <FontAwesome style={styles.icon} name="address-card-o"/>
                                    <Text style={styles.itemText}>{this.state.fullName}</Text>
                                </View>
                                
                                <View style={styles.infoItem}>
                                    <FontAwesome style={styles.icon} name="envelope-o"/>
                                    <Text style={styles.itemText}>{this.state.email}</Text>
                                </View>
    
                                <View style={styles.infoItem}>
                                    <FontAwesome style={styles.icon} name="phone"/>
                                    <Text style={styles.itemText}>{this.state.phone}</Text>
                                </View>
    
                                <View style={styles.infoItem}>
                                    <FontAwesome style={styles.icon} name="map-marker"/>
                                    <Text style={styles.itemText}>{this.state.address}</Text>
                                </View>
    
                                <View style={styles.infoItem}>
                                    <FontAwesome style={styles.icon} name="calendar"/>
                                    <Text style={styles.itemText}>{this.state.createTime}</Text>
                                </View>
                            </View>
                    }
                    
                </View>
                <View style={styles.body}>
                    <View style={styles.wrapper}>
                        <TouchableOpacity onPress={() => this.handleToProfile()} style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <FontAwesome style={styles.iconInfo}  name='user-o' />
                            </View>
                            <View style={styles.nav}>
                                <View style={styles.navText}><Text style={styles.menuText}>Thông tin tài khoản</Text></View>
                                <View style={styles.iconArrow}>
                                    <FontAwesome style={styles.arrow}  name='angle-right' />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.handleToChangePassword()} style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <FontAwesome style={styles.iconPassword}  name='key' />
                            </View>
                            <View style={styles.nav}>
                                <View style={styles.navText}><Text style={styles.menuText}>Đổi mật khẩu</Text></View>
                                <View style={styles.iconArrow}>
                                    <FontAwesome style={styles.arrow}  name='angle-right' />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Security')} style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <MaterialIcons style={styles.iconSecurity}  name='security' />
                            </View>
                            <View style={styles.nav}>
                                <View style={styles.navText}><Text style={styles.menuText}>Bảo mật tài khoản</Text></View>
                                <View style={styles.iconArrow}>
                                    <FontAwesome style={styles.arrow}  name='angle-right' />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.handleMessage()} style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <AntDesign style={styles.iconMessage}  name='message1' />
                            </View>
                            <View style={styles.nav}>
                                <View style={styles.navText}><Text style={styles.menuText}>Tin nhắn</Text></View>
                                <View style={styles.iconArrow}>
                                    <FontAwesome style={styles.arrow}  name='angle-right' />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View> 

                    {
                        this.state.id == 0 ? null 
                        :<View style={styles.footer}>
                            <TouchableOpacity style={styles.logoutBtn} onPress={() => this.logout()}>
                                <Text style={styles.logout}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingTop: 40
    },

    btnLogin:{
        color: COLORS.primary
    },

    btnRegistry:{
        color: COLORS.primary
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.bgHeader
    },

    header: {
        backgroundColor: COLORS.bgHeader,
        height: 150,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
        flexDirection: 'row'
    },

    avatar: {
        width: '40%',
        paddingLeft: 10,
        justifyContent: 'center',
        paddingBottom: 30
    },

    iconAvatar: {
        color: 'rgba(160,180,200,.85)',
        fontSize: 130
    },

    info: {
        paddingTop: 10
    },

    item: {
        paddingBottom: 5
    },

    username: {
        color: 'rgba(160,180,200,.85)',
        fontSize: 20
    },

    infoItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    icon: {
        color: COLORS.white,
        fontSize: 10,
        paddingRight: 5,
        width: 20,
    },

    itemText: {
        color: 'rgba(160,180,200,.85)',
        fontSize: 12,
    },

    body: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },

    title: {
        color: COLORS.white
    },

    wrapper: {

    },

    menuItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingLeft: 10,
    },

    menuIcon: {
        paddingRight: 10,
        width: 30
    },

    nav: {
        width: width - 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        height: 40,
        borderBottomColor: 'rgb(71, 77, 87)',
        borderBottomWidth: 0.5,
    },

    menuText: {
        color: COLORS.white
    },

    iconInfo: {
        fontSize: 16,
        color: COLORS.blue,
    },

    iconArrow: {
        width: 40,
    },

    arrow: {
        fontSize: 20,
        color: 'rgba(160,180,200,.85)'
    },

    iconPassword: {
        fontSize: 16,
        color: COLORS.purple,
    },

    iconSecurity: {
        fontSize: 16,
        color: COLORS.green,
    },

    iconMessage: {
        fontSize: 16,
        color: COLORS.yellow,
    },

    footer: {
        position: 'absolute',
        backgroundColor: COLORS.bg,
        bottom: 0,
        width: width,
        paddingVertical: 10,
        justifyContent: 'center',
        flexDirection: 'row',
    },

    logoutBtn: {
        backgroundColor: COLORS.bg,
        borderRadius: 30,
        width: width - 40,
        paddingVertical: 8,
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: COLORS.primary,
        borderWidth: 0.5
    },

    logout: {
        color: COLORS.primary,
        fontSize: 16
    },

})

export default AccountScreen