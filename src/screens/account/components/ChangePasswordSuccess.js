import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import { COLORS } from "../../../constants";
var { width, height } = Dimensions.get('window');

class ChangePasswordSuccess extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            show: false
        }
    }

    componentDidMount() {
        this.setState({ show: this.props.show });
    }

    render() {
        return (
            <Modal transparent={true} animationType={'none'} visible={this.props.show}>
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <Image style={styles.icon} source={require('../../../assets/icons/lock-overturning.png')}/>
                        <Text style={styles.messageText}>Đổi mật khẩu thành công</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Account')} style={styles.button}>
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
	backgroundColor: '#00000040'
  },

  container: {
    backgroundColor: '#FFFFFF',
    width: width * 0.75,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
	justifyContent: 'space-around',
	zIndex: 1011,
	opacity: 1,
	paddingHorizontal: 10,
	paddingVertical: 30
  },

  icon: {
	marginBottom: 15
  },

  messageText:{
	  color: COLORS.title,
	  fontSize: 18,
	  fontWeight: 'bold',
	  marginBottom: 30
  },

  button: {
      paddingTop: 8,
      paddingBottom: 8,
	  width: width * 0.6,
	  backgroundColor: COLORS.primary,
	  borderRadius: 30,
	  justifyContent: 'center',
	  alignItems: 'center'
  },
  buttonText: {
	  color: COLORS.white,
	  fontWeight: '600',
	  fontSize: 16,
  }
});

export default ChangePasswordSuccess;