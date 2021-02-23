import React from "react";
import { LogBox, View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, Image, SafeAreaView, Platform } from "react-native";
import Icon from "react-native-vector-icons/Feather";
Icon.loadFont();
import AntDesign from "react-native-vector-icons/AntDesign";
AntDesign.loadFont();
import { COLORS, SIZES } from '../../constants';
import albumService from '../../api/albumService';
import { Spinner } from '../../components'
var { width, height } = Dimensions.get('window');
import ImageView from 'react-native-image-view';

class AlbumDetailScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            data: null,
            isImageViewVisible: false,
            imageIndex: 0,
            galleries: []
        }
    }

    componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true });
        albumService.getById(this.props.route.params.id).then((response) => {
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

    handleViewImage = (index) => {
        this.setState({ isImageViewVisible: true, imageIndex: index })
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
                        <Text style={styles.categoryText}></Text>
                    </View>
                    <View style={styles.body}>
                        <Spinner />
                    </View>
                     
                </View>
            )
        }
        else if(this.state.data != null){
            const images = [];
            return(
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.navigation}>
                        <Pressable style={styles.btnBack} onPress={() => this.props.navigation.goBack()}>
                            <AntDesign style={styles.backIcon} name="left" />
                        </Pressable>
                        <Text style={styles.categoryText}>{this.state.data.Title}</Text>
                    </View>
                    <ScrollView style={styles.body} horizontal={false}>
                        {
                            this.state.data.Galleries.map((item, index)=>{
                                const obj = {
                                    source: {
                                        uri: item.Image.FullPath
                                    }
                                }
                                images.push(obj)
                                return(
                                    <Pressable style={styles.item} onPress={() => this.handleViewImage(index)} key={item.Id} >
                                        <Image style={styles.image} resizeMode="cover" source={{uri:item.Image.FullPath}}/>
                                    </Pressable>
                                )
                            })
                        }
                    </ScrollView>

                    <ImageView
                        glideAlways
                        images={images}
                        imageIndex={this.state.imageIndex}
                        animationType="fade"
                        isVisible={this.state.isImageViewVisible}
                        onClose={() => this.setState({isImageViewVisible: false})}
                        onImageChange={index => {
                            //console.log(index);
                        }}
                    />
                </SafeAreaView>
            )
        }
        else{
            return null;
        }
    }
}

const styles = StyleSheet.create({
    navigation: {
        backgroundColor: COLORS.bgHeader,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        height: SIZES.NavigationHeight,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
    },

    btnBack: {
        width: 50,
        height: 20,
        width: 35
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

    body: {
        flex: 1,
        flexDirection: 'column',
        width: width,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: COLORS.bg,
        paddingTop: 10
    },

    item: {
        marginBottom: 20
    },

    image: {
        height: width / 2,
        width: width - 20,
    }, 
})

export default AlbumDetailScreen