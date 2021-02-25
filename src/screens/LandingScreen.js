import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, SafeAreaView } from 'react-native';
import { COLORS } from './../constants';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();
var { width, height } = Dimensions.get('window');
import { AuthContext } from '../components/Context';
import DeviceInfo from 'react-native-device-info';
import appInstalledService from "../api/appInstalledService";

const LandingScreen = () => {
    const { setLoading } = React.useContext(AuthContext);

    useEffect(() => {
        setTimeout(() =>{
            setLoading(false)
        }, 1500)

        addDevice();
    })

    const addDevice = () => {

        let systemName = DeviceInfo.getSystemName();
        let uniqueId = DeviceInfo.getUniqueId();
        let version = DeviceInfo.getVersion();

        const entity = {
            DeviceId: uniqueId,
            AppVersion: version,
            DeviceType: systemName == "Android" ? 1 : 2
        };

        appInstalledService.add(entity);
    }

    return (
        <SafeAreaView style={style.container}>
            <StatusBar backgroundColor={COLORS.bgHeader} barStyle="dark-content" />
            <View style={style.body}>
                <Image style={style.logo} source={ require('../assets/images/gaixinhsg.png') }/>
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    
    body: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: COLORS.white
    },

    info: {
        width: width - 100,
        padding: 5, 
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary
    },

    logo: {
        width: 300,
        height: 150
    }
})

export default LandingScreen;