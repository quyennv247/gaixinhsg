import React from "react";
import { LogBox, View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, SafeAreaView, Platform } from "react-native";
import Icon from "react-native-vector-icons/Feather";
Icon.loadFont();
import AntDesign from "react-native-vector-icons/AntDesign";
AntDesign.loadFont();
import { COLORS, SIZES } from '../../constants';
import newsService from '../../api/newsService';
import { Spinner } from '../../components'
var { width, height } = Dimensions.get('window');
import HTML from "react-native-render-html";

class NewsDetailScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            data: null,
            paused: true,
            duration: 0.0,
            currentTime: 0.0,
            repeat: false,
            hideControls: false
        }
    }

    componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        newsService.getById(this.props.route.params.id).then((response) => {
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

    onbLoad = (data) => {
        this.setState({ duration: data.duration })
    }

    onEnd = () => {
        this.setState({ paused: true });
        this.data.seek(0);
    }

    render(){
        if(this.state.loading){
            return (
                <View style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.navigation}>
                        <Pressable style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign style={styles.backIcon} name="left" />
                        </Pressable>
                        <Text style={styles.headerTitle}>Ký sự</Text>
                    </View>
                    <View style={styles.body}>
                        <Spinner /> 
                    </View>
                </View>
            )
        }
        else if(this.state.data != null){
            const description = '<div style="color:white;">' + this.state.data.Description + '</div>';
            const content = '<div style="color:white;">' + this.state.data.Content + '</div>';
            return(
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.navigation}>
                        <Pressable style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign style={styles.backIcon} name="left" />
                        </Pressable>
                        <Text style={styles.headerTitle}>{this.state.data.Category.Title}</Text>
                    </View>
                    <ScrollView style={styles.body}>
                        <Text style={styles.newsTitle}>{this.state.data.Title}</Text>

                        <Text style={styles.newsDate}>{this.state.data.PublicDate}</Text>

                        <View style={styles.newsDescription}>
                            <HTML source={{ html: description }} contentWidth={width} />
                        </View>

                        <View style={styles.newsContent}>
                            <HTML source={{ html: content }} contentWidth={width} />
                        </View>
                    </ScrollView>
                    
                </SafeAreaView>
            )
        }
        else{
            return null;
        }
    }
}

const styles = StyleSheet.create({
    newsTitle: {
        fontSize: 16,
        color: COLORS.white,
        paddingTop: 10,
        fontWeight: 'bold'
    },

    newsDate: {
        color: COLORS.textSecond,
        paddingVertical: 10
    },

    newsDescription: {
        color: COLORS.white,
        paddingBottom: 10
    },

    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    navigation: {
        backgroundColor: COLORS.bgHeader,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'center',
        height: SIZES.NavigationHeight,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight
    },

    headerTitle: {
        color: COLORS.white
    },

    btnBack: {
        width: 50,
        height: 20,
        width: 35
    },

    backIcon:{
        color: COLORS.white,
        fontSize: 18
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.bgHeader
    },

    body: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: COLORS.bg,
    },
})

export default NewsDetailScreen