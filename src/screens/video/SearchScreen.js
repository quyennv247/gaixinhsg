import React from "react";
import { View, Text, StyleSheet, StatusBar, Dimensions, FlatList, TouchableOpacity, Pressable, Image, SafeAreaView, Platform } from "react-native";
import { COLORS } from "../../constants";
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();
import Icon from "react-native-vector-icons/Feather";
Icon.loadFont();
var { width, height } = Dimensions.get('window');
import Category from "./components/Category";
import videoService from "../../api/videoService";
import { Spinner } from "../../components";

class SearchScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isSearch: false,
            categoryId: 0,
            loading: false,
            data: null,
            pageIndex: 1,
            pageSize: 20,
            isShow: false,
            product: null,
            quantity: 1,
            pager: null,
            total: 0,
            refreshing: false,
            isLoadMore: false,
            loadingMore: false
        }
    }

    getData = () => {
        this.setState({ total: 0 });
        videoService.getVideos(this.state.pageIndex, this.state.pageSize, 0, this.state.categoryId, "").then((response) => {
            this.setState({ loading: false });
            if(response.statusCode == 200){
                this.setState({ total: response.data.Total });
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

    handleSearch = () => {
        this.setState({ loading: true, isSearch: true });
        this.getData();
    }

    handleLoadMore = () => {
        if(this.state.isLoadMore){
            this.setState({ loadingMore: true });
            this.setState({ pageIndex: this.state.pageIndex += 1 });
            this.getData();
        }
    }

    handleCategorySearch = (categoryId) => {
        this.setState({
            categoryId: categoryId
        });
    }

    handleBackSearch = () => {
        this.setState({ isSearch: false });
    }

    handleClickItem(id){
        this.props.navigation.navigate('Video-Detail', {
            id: id
        });
    }

    render(){
        if(this.state.loading){
            return(
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.btnCancel} onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.btnText}>Hủy</Text>
                        </TouchableOpacity>
                        <Text style={styles.btnText}>TÌM KIẾM</Text>
                        {
                            this.state.isSearch
                            ?
                                <TouchableOpacity style={styles.btnCancel} onPress={() => this.handleBackSearch()}>
                                   <Icon style={styles.searchIcon} name='search'></Icon>
                                </TouchableOpacity>
                            :   <TouchableOpacity style={styles.btnCancel} onPress={() => this.handleSearch()}>
                                    <Text style={styles.btnSubmitText}>Done</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.body}>
                        <Spinner/>
                    </View>
                </SafeAreaView>
            )
        }
        else{
            return(
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor={COLORS.bgHeader} translucent barStyle="light-content" />
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.btnCancel} onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.btnText}>Hủy</Text>
                        </TouchableOpacity>
                        <Text style={styles.btnText}>TÌM KIẾM</Text>
                        {
                            this.state.isSearch
                            ?
                                <TouchableOpacity style={styles.btnCancel} onPress={() => this.handleBackSearch()}>
                                   <Icon style={styles.searchIcon} name='search'></Icon>
                                </TouchableOpacity>
                            :   <TouchableOpacity style={styles.btnCancel} onPress={() => this.handleSearch()}>
                                    <Text style={styles.btnSubmitText}>Done</Text>
                                </TouchableOpacity>
                        }
                        
                    </View>
                    {
                        !this.state.isSearch 
                        ? <View style={styles.body}>
                            <View style={styles.category}>
                                <Text style={styles.categoryText}></Text>
                            </View>
                            
                            <Category handleCategorySearch={this.handleCategorySearch} />
                        </View>
                        : <View style={styles.wrapper}>
                            {
                                this.state.total > 0
                                ? <FlatList
                                    data={this.state.data}
                                    keyExtractor={(e, i) => i.toString()}
                                    renderItem={({ item }) => this.renderItem(item)}
                                    ListFooterComponent={this.renderFooter.bind(this)}
                                    onEndReachedThreshold={0}
                                    scrollEnabled={true}
                                    numColumns={2}
                                />
                                : <Text style={styles.notFound}>Không tìm thấy kết quả</Text>
                            }
                        </View>
                    }
                </SafeAreaView>
            )
        }
    }

    renderItem = (item) => {
        return (
            <Pressable onPress={() => this.handleClickItem(item.Id)} key={item.Id} style={styles.itemContainer}>
                <View style={styles.itemWrapper}>
                    <Image style={styles.image} source={{uri : item.File.ThumbnailPath}}/>
                    <View style={styles.info}>
                        <Text style={styles.title}>{item.Title}</Text>
                        <View style={styles.duration}>
                            <Text style={styles.durationText}>{item.File.Duration}</Text>
                        </View>
                    </View>
                    <View style={styles.price}>
                        <Text style={styles.priceText}>NEW</Text>
                    </View>
                </View>
            </Pressable>
        )
    }

    renderFooter = () => {
        return(
            <View style={this.state.isLoadMore ? styles.footer : styles.none}>
                {
                    this.state.isLoadMore
                    ? <TouchableOpacity activeOpacity={1} onPress={this.handleLoadMore} style={styles.loadMoreBtn}>  
                    {
                        this.state.loadingMore 
                        ? 
                            <Text style={styles.loadMoreText}>Đang tải...</Text>
                            
                        : <Text style={styles.btnText}>Xem thêm</Text>
                    }
                    </TouchableOpacity>
                    : null
                }
                
            </View>
        );
    };
}

const styles = StyleSheet.create({
    notFound: {
        color: COLORS.white,
        paddingLeft: 10
    },
    category: {
        paddingLeft: 10,
        paddingBottom: 10,
        backgroundColor: COLORS.bg
    },

    categoryText: {
        fontSize: 16,
        color: COLORS.white,
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.bgHeader,
    },

    header: {
        backgroundColor: COLORS.bgHeader,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 0,
        paddingLeft: 15,
        alignContent: 'center',
        alignItems: 'center',
        borderBottomColor: COLORS.gray5,
        borderBottomWidth: 0.5,
        height: 50,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight
    },

    searchIcon: {
        fontSize: 20,
        color: COLORS.secondary,
        width: 35
    },

    btnCancel: {
        width: 50,
    },

    btnText: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight: '400'
    },

    btnSubmitText:{
        fontSize: 16,
        color: COLORS.secondary,
        fontWeight: '400'
    },

    body: {
        flex: 1
    },

    line: {
        height: 0.5,
        width: '100%',
        backgroundColor: COLORS.grey
    },

    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        paddingTop: 10,
        width: '100%',
        backgroundColor: COLORS.bg
    },

    itemContainer: {
        flexDirection: 'row',
        flex:0.5,
        backgroundColor: COLORS.bg,
        marginBottom: 20,
        maxWidth: '50%'
    },

    itemWrapper: {
        paddingLeft: 10,
    },

    image: {
        width: width / 2,
        height: height / 3,
    },

    info:{
        position: 'absolute',
        bottom: 0,
        paddingLeft: 15,
        backgroundColor: 'rgba(0,0,0,.4)',
        width: '100%',
        paddingTop: 5
    },

    title: {
        color: COLORS.white,
        textTransform: 'uppercase',
        fontSize: 14
    },

    mapIcon: {
        color: COLORS.secondary,
        fontSize: 12,
        paddingTop: 3
    },

    address: {
        flexDirection: 'row',
        paddingBottom: 3
    },

    addressText: {
        color: COLORS.secondary,
        paddingLeft: 5,
        fontSize: 14
    },

    price:{
        position: 'absolute',
        left: 10,
        top: 0,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 5,
        paddingVertical: 3
    },

    priceText:{
        color: COLORS.white
    },

    footer: {
        borderColor: COLORS.borderButton,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: COLORS.bg,
        marginBottom: 0,
        marginLeft: 10,
        marginBottom: 10
    },

    loadMoreBtn: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadMoreText: {
        color: COLORS.white
    },

    btnText: {
        color: COLORS.white
    }
})

export default SearchScreen