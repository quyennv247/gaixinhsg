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
import categoryService from '../../../api/categoryNewsService';
import { ScrollView } from 'react-native-gesture-handler';

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            parent: null,
            categoryId: 0
        }
    }

    componentDidMount() {
        this.getData();
    }

    handleClickSearch = (categoryId) => {
        this.setState({
            categoryId: categoryId
        });
        this.props.handleCategorySearch(categoryId);
    }

    getData = () => {
        this.setState({loading: true});

        categoryService.getAll().then((response) => {
            this.setState({loading: false});
            if(response.statusCode == 200){
                this.setState({parent: response.data});
            }
            else{
                alert(response.error);
            }
        }).finally(() => {this.setState({loading: false}); });
    }

    render() {
        
        return (
            <ScrollView style={styles.container}>
                
                <View style={styles.body}>
                    {
                        this.state.parent != null
                        ?
                        this.state.parent.map((item)=>{
                            return(
                                this.renderItem(item)
                            )
                        })
                        : null
                    }
                </View>
                
            </ScrollView>
        );
    }

    renderItem(item){
        return(
            <Pressable key={item.Id} onPress={() => this.handleClickSearch(item.Id)} style={this.state.categoryId == item.Id ? styles.itemActive : styles.item}>
                <Text style={this.state.categoryId == item.Id ? styles.itemTextActive : styles.itemText}>{item.Title}</Text>
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
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

    itemText: {
        fontSize: 14,
        color: COLORS.blue
    },

    itemActive: {
        marginRight: 15,
        marginBottom: 15,
        padding: 10,
        borderColor: COLORS.secondary,
        borderWidth: 0.5
    },

    itemTextActive: {
        fontSize: 14,
        color: COLORS.secondary,
    }
});


export default Category;