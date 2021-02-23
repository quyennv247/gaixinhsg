import React from 'react';
import { StyleSheet, View, Text, Image, Pressable, Platform, StatusBar } from 'react-native';
import { ICONS, COLORS, SIZES } from '../../../constants';
import Icon from "react-native-vector-icons/Feather";
Icon.loadFont();

const SearchBar = ({ navigation }) => {
    return (
        <View style={style.container}>
            <View style={style.logo}>
                <Image style={style.iconLogo} source={ICONS.logo}></Image>
            </View>
            <View style={style.name}>
                <Text style={style.nameText}>PHIM SEX</Text>
            </View>
            <View style={style.search}>
                <Pressable onPress={() => navigation.navigate('Video-Search')} style={style.searchBtn}>
                    <Icon style={style.searchIcon} name='search'></Icon>
                </Pressable> 
            </View>
            
        </View>
    );
};

const style = StyleSheet.create({
    
    container: {
        backgroundColor: COLORS.bgHeader,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        height: SIZES.NavigationHeight,
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
    },

    logo: {
        
    },

    iconLogo: {
        height: 30,
        width: 30
    },

    
    name: {
        
    },

    nameText: {
        color: COLORS.primary,
        fontWeight: 'bold'
    },

    search: {
        
    },

    searchIcon: {
        color: COLORS.white,
        fontSize: 20
    }

})


export default SearchBar;
