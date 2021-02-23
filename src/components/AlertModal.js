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
import { COLORS } from "../constants";
var { width } = Dimensions.get('window');
import AntDesign from 'react-native-vector-icons/AntDesign';

class AlertModal extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const { show, close } = this.props;
        return (
            <Modal transparent={true} animationType={'none'} visible={show}>
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <AntDesign style={styles.icon} name='infocirlceo'/>
                        <Text style={styles.messageText}>{this.props.message}</Text>
                        <TouchableOpacity onPress={() => { close()}} style={styles.button}>
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
    marginBottom: 15,
    fontSize: 70,
    color: COLORS.blue
  },

  messageText:{
	  color: COLORS.title,
	  fontSize: 16,
	  fontWeight: 'bold',
	  marginBottom: 30
  },

  button: {
      paddingTop: 8,
      paddingBottom: 8,
	  width: width * 0.6,
	  backgroundColor: COLORS.blue,
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

export default AlertModal;