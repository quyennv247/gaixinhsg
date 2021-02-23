import React from 'react';
import { 
    LogBox,
    Image,
    StyleSheet,
    Dimensions,
    View,
    ScrollView,
    Pressable
  } from 'react-native';

var { width } = Dimensions.get('window');
import Swiper from 'react-native-swiper';
import { COLORS } from '../../../constants';
import ImageView from 'react-native-image-view';

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isImageViewVisible: false,
            imageIndex: 0,
        }
    }

    componentDidMount(){
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }

    handleViewImage = (index) => {
        this.setState({ isImageViewVisible: true, imageIndex: index })
    }

    render() {
        const images = [];
        return (
            <ScrollView>
                <View style={ styles.container } >
                    <Swiper style={ styles.swiper } showsButtons={false} autoplay={true} autoplayTimeout={3}>
                        {
                            this.props.data.map((item, index)=>{
                                const obj = {
                                    source: {
                                        uri: item.Image.FullPath
                                    }
                                }
                                images.push(obj);

                                return(
                                    <Pressable onPress={() => this.handleViewImage(index)} key={item.Id} >
                                        <Image style={styles.image} resizeMode="cover" source={{uri:item.Image.FullPath}}/>
                                    </Pressable>
                                )
                            })
                        }
                    </Swiper>
                    <View style={{height:10}} />
                </View>
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
            </ScrollView>
          );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width, 
        alignItems:'center',
        paddingRight: 10,
        backgroundColor: COLORS.bg,
        paddingTop: 2
    },

    swiper: {
        height: width / 2 
    },

    image: {
        height: width / 2,
        width: width - 20,
    }, 

    notFound: {
        color: COLORS.textGray
    }
});

export default Gallery;