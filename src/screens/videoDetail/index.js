import React from "react";
import { LogBox, View, Text, StyleSheet, StatusBar, Platform, Dimensions, Pressable, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Feather";
Icon.loadFont();
import AntDesign from "react-native-vector-icons/AntDesign";
AntDesign.loadFont();
import { COLORS, SIZES } from '../../constants';
import videoService from '../../api/videoService';
import { Spinner } from '../../components'
var { width, height } = Dimensions.get('window');
import Video from 'react-native-video';

class VideoDetailScreen extends React.Component {
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
        videoService.getById(this.props.route.params.id).then((response) => {
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

    onLoad = () => {
        this.setState({ duration: this.state.data.Duration })
    }

    onEnd = () => {
        this.setState({ paused: true });
        this.data.seek(0);
    }

    onError = () => {
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
                        <Text style={styles.headerTitle}></Text>
                    </View>
                    <View style={styles.body}>
                        <Spinner /> 
                    </View>
                </View>
            )
        }
        else if(this.state.data != null){
            return(
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.navigation}>
                        <Pressable style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign style={styles.backIcon} name="left" />
                        </Pressable>
                        <Text style={styles.headerTitle}>{this.state.data.Title}</Text>
                    </View>
                    <View style={styles.body}>
                        <Video source={{uri: this.state.data.File.VideoUrl}}   
                            ref={(ref) => {
                                this.player = ref
                            }} 
                            onLoad={this.onLoad}                                    
                            onBuffer={this.onBuffer}               
                            onError={this.onError}  
                            repeat={this.state.repeat}
                            paused={this.state.paused}            
                            fullscreen={true}
                            controls={true}
                            resizeMode={"contain"}
                            style={styles.backgroundVideo} />
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
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },

    navigation: {
        backgroundColor: COLORS.bgHeader,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: SIZES.NavigationHeight,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
    },

    headerTitle: {
        color: COLORS.white,
        fontSize: 16
    },

    btnBack: {
        width: 40,
        height: 20,
        paddingTop: 3
    },

    backIcon:{
        color: COLORS.white,
        fontSize: 16
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.bgHeader
    },

    body: {
        flex: 1,
        width: width,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: COLORS.bg,
    },
})

export default VideoDetailScreen