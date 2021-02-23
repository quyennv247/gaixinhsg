import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, StatusBar, Platform, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
AntDesign.loadFont();
import EvilIcons from 'react-native-vector-icons/EvilIcons';
EvilIcons.loadFont();
import userService from "../../api/userService";
import Loading from "../../components/Loading";
import AlertModal from "../../components/AlertModal";
import ModalSelector from 'react-native-modal-selector';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
import ImagePicker from 'react-native-image-picker';

class ProfileScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            showAlert: false,
            genderModal: false,
            textInputValue: '',
            message: '',
            id: 0,
            firstName: '',
            lastName: '',
            avatar: '',
            address: '',
            phone: '',
            email: '',
            gender: '',
            birthday: 'Ngày sinh',
            genderTitle: 'Giới tính',
            showBirthday: false,
            resourcePath: {}
        }
    }

    componentDidMount() {
        this.getInfo();
    }

    closeAlert = () => {
        this.setState({showAlert: false});
    }
    
    getInfo = () => {
        this.setState({loading: true});
        userService.getInfo().then((response) => {
            this.setState({loading: false});
     
            if(response.statusCode == 200){
                this.setState({
                    id: response.data.Id,
                    firstName: response.data.FirstName,
                    lastName: response.data.LastName,
                    address: response.data.Address,
                    phone: response.data.Phone,
                    email: response.data.Email,
                    gender: response.data.Gender,
                    genderTitle: response.data.GenderTitle,
                    birthday: response.data.Birthday == '' ? 'Ngày sinh' : response.data.Birthday
                });
            }
        }).finally(() => { this.setState({loading: false}); });
    }

    handleSubmit = () => {
        this.setState({loading: true});

        const entity = {
            Id: this.state.id,
            UserName: '',
            Password: '',
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Address: this.state.address,
            Phone: this.state.phone,
            Email: this.state.email,
            Gender: this.state.gender,
            Birthday: this.state.birthday,
        };

        userService.edit(entity).then((response) => {
            this.setState({loading: false});
            if(response.statusCode == 200){
                this.setState({showAlert: true, message: "Cập nhật thành công"});
            }
            else{
                this.setState({showAlert: true, message: response.error});
            }
        }).finally(() => {  this.setState({loading: false}); });
    }

    closeAlert = () => {
        this.setState({showAlert: false});
    }

    setFirstName = (val) => {
        this.setState({ firstName : val});
    }

    setLastName = (val) => {
        this.setState({ lastName : val});
    }

    setAddress = (val) => {
        this.setState({ address : val});
    }

    setPhone = (val) => {
        this.setState({ phone : val});
    }

    setEmail = (val) => {
        this.setState({ email : val});
    }

    setGender = (obj) => {
        this.setState({ gender : obj.key, genderTitle : obj.label});
    }

    setGenderModalVisible= (val) => {
        this.setState({ genderModal : val});
    }

    showDatePicker = () => {
        this.setState({showBirthday: true});
    };
     
    hideDatePicker = () => {
        this.setState({showBirthday: false});
    };
     
    handleConfirm = (date) => {
        this.setState({ birthday : Moment(date).format('DD-MM-YYYY')});
        this.hideDatePicker();
    };

    openCamera = (option) => {
        if(option.key == 1){
            this.cameraLaunch();
        }
        else if(option.key == 2){
            this.imageGalleryLaunch();
        }
    };

    // Launch Camera
    cameraLaunch = () => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
            maxWidth: 200,
            maxHeight: 200
          },
        };
        ImagePicker.launchCamera(options, (res) => {
          //console.log('Response = ', res);
          if (res.didCancel) {
            //console.log('User cancelled image picker');
          } 
          else if (res.error) {
            //console.log('ImagePicker Error: ', res.error);
          } 
          else if (res.customButton) {
            //console.log('User tapped custom button: ', res.customButton);
            //alert(res.customButton);
          } 
          else {
            const source = { uri: res.uri };
            //console.log('response', JSON.stringify(res));
            this.setState({
                filePath: res,
                fileData: res.data,
                fileUri: res.uri,
                resourcePath: res,
                avatar: res.data
            });
          }
        });
    }
    
    imageGalleryLaunch = () => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
            maxWidth: 200,
            maxHeight: 200
          },
        };
    
        ImagePicker.launchImageLibrary(options, (res) => {
            //console.log('Response = ', res);
          if (res.didCancel) {
            //console.log('User cancelled image picker');
          } 
          else if (res.error) {
            //console.log('ImagePicker Error: ', res.error);
          } 
          else if (res.customButton) {
            //console.log('User tapped custom button: ', res.customButton);
            //alert(res.customButton);
          } 
          else {
            const source = { uri: res.uri };
            //console.log('response', JSON.stringify(res));
            this.setState({
              filePath: res,
              fileData: res.data,
              fileUri: res.uri,
              resourcePath: res,
              avatar: res.data
            });
          }
        });
      }  

    render() {
        const data = [
            { key: 0, section: true, label: 'Không chọn' },
            { key: 1, label: 'Nam' },
            { key: 2, label: 'Nữ' },
        ];

        const optionCamera = [
            { key: 0, section: true, label: 'Chọn hình avatar' },
            { key: 1, label: 'Chụp hình' },
            { key: 2, label: 'Chọn hình trong album' },
        ];

        return(
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                <View style={styles.navigation}>
                    <TouchableOpacity style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                        <AntDesign style={styles.backIcon} name="left" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Thông tin tài khoản</Text>
                    <Pressable style={styles.btnSave} onPress={() => this.handleSubmit()}>
                        <Text style={styles.btnSaveText}>Lưu</Text>
                    </Pressable>
                </View>
                <View style={styles.body}>
                    <View style={styles.avatarContainer}>
                        <EvilIcons style={styles.iconAvatar} name="user"/>
                    </View>
                    
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Họ và tên đệm</Text>
                        <TextInput onChangeText={text => this.setFirstName(text)} defaultValue={this.state.firstName} placeholder="Họ và tên đệm" style={styles.input} placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tên</Text>
                        <TextInput onChangeText={text => this.setLastName(text)} defaultValue={this.state.lastName} placeholder="Tên" style={styles.input} placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <TextInput onChangeText={text => this.setAddress(text)} defaultValue={this.state.address} placeholder="Địa chỉ" style={styles.input} placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Số điện thoại</Text>
                        <TextInput onChangeText={text => this.setPhone(text)} defaultValue={this.state.phone} placeholder="Số điện thoại" style={styles.input} placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput onChangeText={text => this.setEmail(text)} defaultValue={this.state.email} style={styles.input} placeholderTextColor={COLORS.textGray} placeholder="Email" autoCapitalize="none" />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Giới tính</Text>
                        <ModalSelector
                            optionContainerStyle={styles.selector}
                            sectionTextStyle={styles.selectorTitle}
                            cancelContainerStyle={styles.selectorCancel}
                            data={data}
                            initValue="Giới tính"
                            cancelText="Hủy bỏ"
                            onChange={(option)=> this.setGender(option) } >
                                <Text style={{ color: COLORS.white}}>{this.state.genderTitle}</Text>
                        </ModalSelector>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Ngày sinh</Text>
                        <Pressable onPress={() => this.showDatePicker()} >
                            <Text style={{ color: COLORS.white}}>{this.state.birthday}</Text>
                        </Pressable>
                        <DateTimePickerModal
                            isVisible={this.state.showBirthday}
                            mode="date"
                            onConfirm={(date) => this.handleConfirm(date)}
                            onCancel={() => this.hideDatePicker()}
                        />
                    </View>

                </View>

                <Loading show={this.state.loading} />

                <AlertModal navigation={ this.props.navigation } show={this.state.showAlert} message={this.state.message} close={this.closeAlert} />
            </SafeAreaView> 
        )
        
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgHeader,
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
        paddingTop: 20,
        width: '100%',
    },

    avatarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: 20,
    },

    iconAvatar: {
        borderRadius: 60,
        color: COLORS.textGray,
        fontSize: 120
    },

    avatar: {
        height: 120,
        width: 120,
        borderRadius: 60,
        color: COLORS.textGray
    },

    editAvatar: {
        position: 'absolute',
        backgroundColor: COLORS.secondary,
        height: 35,
        width: 35,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        top: 105,
        left: '64%'
    },

    iconEditAvatar: {
        fontSize: 16,
        color: COLORS.white
    },

    formGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        borderBottomColor: COLORS.border,
        borderBottomWidth:0.5,
        height: 45,
        backgroundColor: COLORS.bgHeader,
        paddingHorizontal: 15,
    },

    label: {
        color: COLORS.textGray,
        width: '30%'
    },

    input: {
        width: '60%',
        textAlign: 'right',
        color: COLORS.white,
    },

    selectorCancel: {
        bottom: 15,
        position: 'absolute',
        width: '100%',
        marginLeft: 20
    },

    selector: {
        bottom: 50,
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },

    selectorTitle: {
        color: COLORS.primary
    },
})

export default ProfileScreen;