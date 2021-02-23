import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, TouchableOpacity, TextInput, SafeAreaView, Image } from 'react-native';
import { COLORS } from './../constants';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();
var { width, height } = Dimensions.get('window');
import { AuthContext } from '../components/Context';
import AsyncStorage from '@react-native-community/async-storage';
import Feather from 'react-native-vector-icons/Feather';
Feather.loadFont();
import * as Animatable from 'react-native-animatable';

const SecurityScreen = () => {
    const { setShowSecurity } = React.useContext(AuthContext);
    const [security, setSecurity] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [isValidPassword, setValidPassword] = React.useState(true);
    const [requirePassword, setRequirePassword] = React.useState(false);

    useEffect(() => {
        (async () => {
            const security = await AsyncStorage.getItem('security');
            if(security !== null && security !== ''){
                setSecurity(security);
            }
            else{
                setSecurity('');
                setShowSecurity(false);
            }
          })()
    })

    async function checkSecurity(){
        if(password == ''){
            setRequirePassword(true);
            setValidPassword(true);
        }
        else{
            const security = await AsyncStorage.getItem('security');
            if(security === password){
                setShowSecurity(false);
            }
            else{
                setRequirePassword(false);
                setValidPassword(false);
            }
        }
        
    }

    const updateSecureTextEntry = () => {
        if(secureTextEntry == true){
            setSecureTextEntry(false);
        }else{
            setSecureTextEntry(true);
        }
    }

    const handlePasswordChange = (val) => {
        setPassword(val);
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.bg} barStyle="dark-content" />
            <View style={styles.body}>
                <View style={styles.logo}><Image source={ require('../assets/images/logo.png') }/></View>
                { requirePassword == false ? false : 
                    <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                        <Text style={styles.errorMsg}>Vui lòng nhập mật khẩu</Text>
                    </Animatable.View>
                }
                { isValidPassword == true ? false : 
                    <Animatable.View animation="fadeInLeft" duration={500} style={styles.invalid}>
                        <Text style={styles.errorMsg}>Mật khẩu không đúng</Text>
                    </Animatable.View>
                }
                <View style={styles.formGroup}>
                    <Feather name="lock" style={styles.iconInput}/>
                    <TextInput onChangeText={(val) => handlePasswordChange(val)} secureTextEntry={secureTextEntry ? true : false} style={styles.input} placeholder="Mật khẩu" placeholderTextColor={COLORS.textGray} autoCapitalize="none" />
                    <TouchableOpacity style={styles.btnShowPass} onPress={ () => updateSecureTextEntry()} >
                        {secureTextEntry 
                        ?  <Feather name="eye-off" style={styles.iconPass} />
                        : <Feather name="eye" style={styles.iconPass} />
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btnSubmit} onPress={() => checkSecurity()}>
                    <Text style={styles.submitText}>Đồng ý</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logo: {
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },

    errorMsg: {
        color: COLORS.secondary,
        fontSize: 12
    },

    invalid: {
        position: 'relative',
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 3,
    },

    input: {
        backgroundColor: COLORS.bgHeader,
        borderRadius: 100,
        height: 40,
        width: '90%',
        color: COLORS.textGray,
    },

    formGroup: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bgHeader,
        borderRadius: 100,
        marginBottom: 15,
    },

    btnShowPass: {
        position: 'absolute',
        right: 0
    },

    iconPass: {
        width: 30,
        right: 0,
        color: COLORS.textGray,
        fontSize: 14,
    },

    iconInput: {
        width: 30,
        paddingLeft: 15,
        position: 'relative',
        color: COLORS.textGray,
        fontSize: 14
    },

    btnSubmit: {
        paddingVertical: 8,
        width: width - 60,
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },

    submitText: {
        color: COLORS.white,
        paddingLeft: 10,
        fontSize: 16
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    
    body: {
        flex: 9,
        paddingTop: '30%',
        backgroundColor: COLORS.bg,
        width: width,
        paddingHorizontal: 30,
        paddingVertical: 20,
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
        color: COLORS.primary,
        fontFamily: 'sans-serif'
    },
})

export default SecurityScreen;