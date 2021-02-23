import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, Dimensions } from 'react-native';
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

class MessengerScreen extends React.Component {
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
            userName: ''
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
       else{
        this.props.navigation.navigate('Login');
       }
    }

    getData = () => {
        chatService.filter(this.state.pageIndex, this.state.pageSize, this.state.userName).then((response) => {
            this.setState({ loading: false });
            if(response.statusCode == 200){
                if(response.data.Pager.PageIndex == 1){
                    this.setState({ data: response.data.Items });
                }
                else{
                    let data = this.state.data.concat(response.data.Items)
                    this.setState({ data: data });
                    this.setState({ loadingMore: false });
                }

                if(response.data.Pager.TotalPages > response.data.Pager.PageIndex){
                    this.setState({ isLoadMore: true });
                }
                else{
                    this.setState({ isLoadMore: false });
                }
                
                this.setState({ pager: response.data.Pager, total: response.data.Total });
            }
            else{
                alert(response.error);
            }
            }).finally(() => { this.setState({ loading: false });; 
        });
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                <View style={styles.navigation}>
                    <TouchableOpacity style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                        <AntDesign style={styles.backIcon} name="left" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Tin nhắn</Text>
                    <Text style={{width: 50}}></Text>
                </View>
                <View style={styles.body}>
                    {
                        this.state.loading
                        ?<Spinner size="small" />
                        :<FlatList
                            data={this.state.data}
                            ItemSeparatorComponent={this.renderItemSeparator}
                            keyExtractor={(e, i) => i.toString()}
                            renderItem={({ item }) => this.renderItem(item)}
                            onEndReachedThreshold={0}
                            scrollEnabled={true}
                        />
                    }
                    
                </View>
            </SafeAreaView>
        );
    }

    renderItemSeparator = () => <View style={styles.line}/>

    renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', { chatId: item.ChatId, toUserId: item.FromUserId == this.state.loginId ? item.ToUserId : item.FromUserId, chatter: item.FromUserId == this.state.loginId ? item.ToUser.UserName : item.FromUser.UserName })} key={item.Id} style={styles.itemContainer}>
                <View style={styles.itemIcon}>
                    <FontAwesome style={styles.iconAvatar} name="user-circle"/>
                </View>
                <View style={styles.itemContent}>
                    {
                        item.FromUserId == this.state.loginId
                        ? <View>
                            <View style={styles.itemTitle}>
                                <Text style={styles.itemUserName}>{item.ToUser.UserName}</Text>
                                <Text style={styles.itemMessage}>{item.ChatDate}</Text>
                            </View>
                            <View>
                                <Text style={styles.itemMessage}>Bạn: {item.LastMessage}</Text>
                            </View>
                        </View>
                        :<View>
                            <View style={styles.itemTitle}>
                                <Text style={styles.itemUserName}>{item.FromUser.UserName}</Text>
                                <Text style={styles.itemMessage}>{item.ChatDate}</Text>
                            </View>
                            <View>
                                <Text style={styles.itemMessage}>{item.LastMessage}</Text>
                            </View>
                            
                        </View>
                    }
                    
                </View>
            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    itemTitle:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 80,
        paddingRight: 0
    },

    itemContainer: {
        backgroundColor: COLORS.bgHeader,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10
    },

    itemIcon: {
        width: 60
    },

    iconAvatar: {
        color: 'rgba(160,180,200,.85)',
        fontSize: 40
    },

    itemUserName: {
        color: COLORS.white,
        fontSize: 14
    },

    itemMessage: {
        color: 'rgba(160,180,200,.85)',
        paddingTop: 3,
        fontSize: 12
    },

    line: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'rgb(71, 77, 87)',
    },

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
        paddingTop: 10,
        width: '100%',
    },

})

export default MessengerScreen;