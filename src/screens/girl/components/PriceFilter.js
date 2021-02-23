import React from 'react';
import { 
    Text,
    StyleSheet,
    Dimensions,
    View,
    Pressable
} from 'react-native';
var { width, height } = Dimensions.get('window');
import { COLORS } from '../../../constants';
import categoryService from '../../../api/categoryService';
import { ScrollView } from 'react-native-gesture-handler';

class PriceFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            priceFilter: 0,
            fromPrice: 0,
            toPrice: 0
        }
    }

    componentDidMount() {
        
    }

    handleClickSearch = (priceFilter, fromPrice, toPrice) => {
        this.setState({
            priceFilter: priceFilter,
            fromPrice: fromPrice,
            toPrice: toPrice
        });
        this.props.handlePriceSearch(fromPrice, toPrice);
    }

    render() {
        
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Giá?</Text>
                </View>
                
                <View style={styles.body}>
                    <Pressable onPress={() => this.handleClickSearch(1, 0, 499)} style={ this.state.priceFilter == 1 ? styles.itemActive : styles.item}>
                        <Text style={ this.state.priceFilter == 1 ? styles.itemTextActive : styles.itemText}> Dưới 500K </Text>
                    </Pressable>
                    <Pressable onPress={() => this.handleClickSearch(2, 500, 600)} style={ this.state.priceFilter == 2 ? styles.itemActive : styles.item}>
                        <Text style={ this.state.priceFilter == 2 ? styles.itemTextActive : styles.itemText}> 500K - 600K </Text>
                    </Pressable>
                    <Pressable onPress={() => this.handleClickSearch(3, 600, 800)} style={ this.state.priceFilter == 3 ? styles.itemActive : styles.item}>
                        <Text style={ this.state.priceFilter == 3 ? styles.itemTextActive : styles.itemText}> 600K - 800K </Text>
                    </Pressable>
                    <Pressable onPress={() => this.handleClickSearch(0, 0, 0)} style={ this.state.priceFilter == 0 ? styles.itemActive : styles.item}>
                        <Text style={ this.state.priceFilter == 0 ? styles.itemTextActive : styles.itemText}> Tất cả </Text>
                    </Pressable>
                </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        backgroundColor: COLORS.bg
    }, 

    header: {
        width: width,
        paddingBottom: 20,
        paddingTop: 15,
    },

    headerText: {
        color: COLORS.white,
        fontSize: 18
    },

    body: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },

    item: {
        marginRight: 15,
        marginBottom: 15,
        padding: 10,
        borderColor: COLORS.borderButton,
        borderWidth: 0.5
    },

    itemActive: {
        marginRight: 15,
        marginBottom: 15,
        padding: 10,
        borderColor: COLORS.secondary,
        borderWidth: 0.5
    },

    itemText: {
        fontSize: 14,
        color: COLORS.blue
    },

    itemTextActive: {
        fontSize: 14,
        color: COLORS.secondary,
    }
});


export default PriceFilter;