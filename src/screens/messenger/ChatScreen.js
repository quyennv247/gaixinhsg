import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, Dimensions, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../../constants';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();
import AntDesign from 'react-native-vector-icons/AntDesign';
AntDesign.loadFont();
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont();
import chatService from "../../api/chatService";
import AsyncStorage from '@react-native-community/async-storage';
import { Spinner } from "../../components/Spinner";
var { width, height } = Dimensions.get('window');

class ChatScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            loginId: 0,
            loading: false,
            data: null,
            pageIndex: 1,
            pageSize: 100,
            pager: null,
            total: 0,
            refreshing: false,
            isLoadMore: false,
            loadingMore: false,
            message: '',
            isValidMessage: false
        }
    }

    async componentDidMount(){
        this.getLoginInfo();
    }

    getLoginInfo = async () => {
        const loginId = await AsyncStorage.getItem('login_id');

       await this.setState({
           loginId: loginId
       });

       if(loginId !== null && loginId !== '' && loginId !== '0' && loginId !== 0){
            this.setState({ loading: true });
            this.getData();
       }
    }

    getData = () => {
        chatService.getChats(this.props.route.params.chatId).then((response) => {
            this.setState({ loading: false });
            if(response.statusCode == 200){
                this.setState({ data: response.data });
            }
            else{
                alert(response.error);
            }
            }).finally(() => { this.setState({ loading: false });; 
        });
    }

    handleSend = () => {
        const entity = {
            ChatId: this.props.route.params.chatId,
            ToUserId: this.props.route.params.toUserId,
            Message: this.state.message
        };

        chatService.add(entity).then((response) => {
            if(response.statusCode == 200){
                this.setState({ message: '' });
                this.getData();
            }
            else{
                alert(response.error);
            }
        }).finally(() => {  this.setState({loading: false}); });
    }

    handleMessageChange = (val) => {
        if(val !== '') {
            this.setState({
                message: val,
                isValidMessage: true
            });
            return true;
        } else {
            this.setState({
                message: val,
                isValidMessage: false
            });
            return false;
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                <View style={styles.navigation}>
                    <TouchableOpacity style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                        <AntDesign style={styles.backIcon} name="left" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{this.props.route.params.chatter}</Text>
                    <Text style={{width: 50}}></Text>
                </View>
                <View style={styles.body}>
                    {
                        this.state.loading
                        ?<Spinner size="small" />
                        :<FlatList
                            data={this.state.data}
                            keyExtractor={(e, i) => i.toString()}
                            renderItem={({ item }) => this.renderItem(item)}
                            onEndReachedThreshold={0}
                            scrollEnabled={true}
                        />
                    }
                    
                </View>
                <View style={styles.footer}>
                    <View style={styles.action}>
                        <TextInput value={this.state.message} onChangeText={(val) => this.handleMessageChange(val)} style={styles.input}></TextInput>
                        <TouchableOpacity onPress={() => this.handleSend()} disabled={!this.state.isValidMessage} style={this.state.isValidMessage ? styles.btnSendActive : styles.btnSendInActive}>
                            <Feather style={this.state.isValidMessage ? styles.btnSendIconActive : styles.btnSendIconInActive}  name='send'></Feather>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    renderItem = (item) => {
        return (
            item.FromUserId != this.state.loginId
            ? <View style={styles.itemChatter}>
                    <View style={styles.itemContentChatter}>
                        <View>
                            <Text style={styles.itemMessageChatter}>{item.Message}</Text>
                            <Text style={styles.itemDateChatter}>{item.ChatDate}</Text>
                        </View>
                    </View> 
                </View>
            : 
            <View style={styles.itemYou}>
                <View style={styles.itemContentYou}>
                    <View>
                        <Text style={styles.itemMessage}>{item.Message}</Text>
                        <Text style={styles.itemDate}>{item.ChatDate}</Text>
                    </View>
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    action: {
        marginTop: 10,
        flexDirection: 'row',
    },

    footer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        backgroundColor: COLORS.bgHeader,
        width: width,
        height: 60,
        paddingHorizontal: 10
    },

    input: {
        width: width - 60,
        borderColor: COLORS.border,
        borderWidth: 0.5,
        borderRadius: 20,
        color: COLORS.white,
        height: 40,
        fontSize: 14,
        paddingLeft: 20,
    },

    btnSendActive: {
        width: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        height: 40
    },

    btnSendInActive: {
        width: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        height: 40,
    },

    btnSendIconActive: {
        color: COLORS.yellow,
        fontSize: 24,
    },

    btnSendIconInActive: {
        color: '#696969',
        fontSize: 24,
    },

    itemContentYou: {
        paddingVertical: 10, 
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#01a9ac',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignSelf: 'flex-end',
        marginRight: 10,
        maxWidth: '80%'
    },

    itemContentChatter: {
        backgroundColor: '#8a9eaf',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignSelf: 'flex-start',
        paddingVertical: 10, 
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,
        maxWidth: '80%'
    },

    itemChatter: {
        backgroundColor: COLORS.bg,
        width: width,
        marginBottom: 10
    },

    itemYou: {
        backgroundColor: COLORS.bg,
        width: width,
        marginBottom: 10
    },

    itemMessageChatter: {
        color: COLORS.black,
    },

    itemMessage: {
        color: COLORS.white,
    },

    itemDateChatter: {
        color: '#666',
        paddingTop: 5,
        fontSize: 12
    },

    itemDate: {
        color: COLORS.textGray,
        paddingTop: 5,
        fontSize: 12,
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
        paddingTop: 10,
        width: '100%',
        marginBottom: 60
    },

})

export default ChatScreen;