import React from "react";
import { Linking, View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, SafeAreaView, Platform  } from "react-native";
import Icon from "react-native-vector-icons/Feather";
Icon.loadFont();
import AntDesign from "react-native-vector-icons/AntDesign";
AntDesign.loadFont();
import HTML from "react-native-render-html";
import { COLORS, SIZES } from '../../constants';
import girlService from '../../api/girlService';
import { Spinner } from '../../components'
var { width, height } = Dimensions.get('window');
import Gallery from "./components/Gallery";

class GirlDetailScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            data: null
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        girlService.getById(this.props.route.params.id).then((response) => {
            this.setState({ loading: false });
            if(response.statusCode == 200){
                this.setState({ data: response.data });
            }
            else{
                alert(response.error);
            }
            }).finally(() => { this.setState({ loading: false });
        });
    }

    call = (id, number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);

        girlService.call(id).then().finally();
    }

    render(){
        if(this.state.loading){
            return (
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.navigation}>
                        <Pressable style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign style={styles.backIcon} name="left" />
                        </Pressable>
                        <Text style={styles.categoryText}></Text>
                    </View>
                    <View style={styles.body}>
                        <Spinner /> 
                    </View>
                    
                </SafeAreaView>
            )
        }
        else if(this.state.data != null){

            const description = '<div style="color:white;">' + this.state.data.Description + '</div>';

            return(
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.navigation}>
                        <Pressable style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign style={styles.backIcon} name="left" />
                        </Pressable>
                        <Text style={styles.categoryText}>{this.state.data.Category.CategoryName}</Text>
                    </View>
                    <ScrollView style={styles.body}>
                        <View style={styles.gallery}>
                            <Gallery data={this.state.data.Galleries} />
                        </View>
                        <View>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>{this.state.data.Title}</Text>
                            </View>

                            <View style={styles.intro}>
                                <Text style={styles.introText}>Thông tin cơ bản</Text>
                                <View style={styles.group}>
                                    <Text style={styles.label}>Năm sinh:</Text>
                                    <Text style={styles.value}>{this.state.data.Birthday}</Text>
                                </View>
                                <View style={styles.group2}>
                                    <Text style={styles.label}>Chiều cao:</Text>
                                    <Text style={styles.value}>{this.state.data.Height}cm</Text>
                                </View>
                                <View style={styles.group}>
                                    <Text style={styles.label}>Cân nặng:</Text>
                                    <Text style={styles.value}>{this.state.data.Weight}kg</Text>
                                </View>
                                <View style={styles.group2}>
                                    <Text style={styles.label}>Số đo 3 vòng:</Text>
                                    <Text style={styles.value}>{this.state.data.Measurement}</Text>
                                </View>
                                <View style={styles.group}>
                                    <Text style={styles.label}>Làm việc:</Text>
                                    <Text style={styles.value}>{this.state.data.WorkingHour}</Text>
                                </View>
                                <View style={styles.group2}>
                                    <Text style={styles.label}>Dịch vụ:</Text>
                                    <View style={styles.value}>
                                    {
                                        this.state.data.GirlServices.map((service)=>{
                                            return(
                                                <Text key={service.Id} style={styles.value2}>{service.Title} - </Text>
                                            )
                                        })
                                    }
                                    </View>
                                </View>
                            </View>

                            <View style={styles.content}>
                                <HTML source={{ html: description }} contentWidth={width} />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.action}>
                        <Pressable onPress={() => this.call(this.state.data.Id, this.state.data.Phone)} style={styles.phone}>
                            <Icon style={styles.phonIcon} name='phone-call'/>
                            <Text style={styles.phoneText}>Gọi điện</Text>
                        </Pressable>
                        <View style={styles.price}>
                            <Icon style={styles.priceIcon} name='dollar-sign'/>
                            <Text style={styles.priceText}>{this.state.data.Price}K</Text>
                        </View>
                    </View>

                </SafeAreaView>
            )
        }
        else{
            return null;
        }
    }
}

const styles = StyleSheet.create({
   
    btnBack: {
        width: 40,
        height: 20,
    },

    categoryText: {
        color: COLORS.white,
        fontSize: 16
    },

    backIcon:{
        color: COLORS.white,
        fontSize: 18
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.bgHeader
    },

    navigation: {
        backgroundColor: COLORS.bgHeader,
        height: SIZES.NavigationHeight,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
        flexDirection: 'row',
        paddingTop: 10,
        paddingLeft: 10
    },


    body: {
        flex: 1,
        width: width,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: COLORS.bg,
        paddingBottom: 12,
    },

    gallery: {
        paddingTop: 0,
        width: width,
    },

    title: {
        paddingHorizontal: 0,
        width: width,
    },

    titleText: {
        color: COLORS.secondary,
        fontSize: 14,
        fontWeight: 'bold'
    },

    intro: {
        paddingTop: 10,
    },

    introText: {
        color: COLORS.blue,
        paddingBottom: 10
    },

    group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: 5
    },

    group2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        paddingVertical: 5,
        backgroundColor: '#191c24',
        marginBottom: 5
    },

    label:{
        color: COLORS.white,
        width: '30%',
        paddingLeft: 5
    },

    value: {
        color: COLORS.white,
        width: '60%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    value2: {
        color: COLORS.white,
    },

    content: {
        width: width - 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 50,
        paddingTop: 20,
        color: COLORS.white,
    },

    contentText: {
        color: COLORS.white,
    },

    action: {
        position: 'absolute',
        bottom: 0,
        width: width,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    phone: {
        width: width / 2,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: COLORS.secondary,
        paddingTop: 8,
        paddingBottom: 8,
    },

    phonIcon: {
        color: COLORS.white,
        fontSize: 20,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 3
    },

    phoneText: {
        color: COLORS.white,
        fontSize: 18
    },

    price: {
        width: width / 2,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: COLORS.green,
        paddingTop: 8,
        paddingBottom: 8,
    },

    priceIcon: {
        color: COLORS.white,
        fontSize: 20,
        paddingRight: 0,
        paddingLeft: 10,
        paddingTop: 3
    },

    priceText: {
        color: COLORS.white,
        fontSize: 20
    },

})

export default GirlDetailScreen