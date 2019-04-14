import React from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { Text, Button, Icon } from 'native-base';

export default Info = (props) => {
    const widthScreen = Dimensions.get('window').width;
    const HeightScreen = Dimensions.get('window').height;
    return (
        <Animated.View style={{ translateY: props.translateInfo, height: HeightScreen, width: widthScreen, backgroundColor: '#fff', padding: 20, position: 'absolute', zIndex: 100, justifyContent: 'space-between' }}>
            <Text style={{ color: '#660066', textAlign: 'center', fontSize: 35 }}>Welcome to GLU!</Text>
            <View style={{ borderWidth: 2, borderColor: '#660066', paddingVertical: 15, height: 300, justifyContent: 'space-around' }}>
                <Text style={{ textAlign: 'center', color: '#660066' }}>Swipe ke kiri untuk melihat profile</Text>
                <Text style={{ textAlign: 'center', color: '#660066' }}>Swipe ke kanan untuk melihat post yang masuk trend</Text>
                <Text style={{ textAlign: 'center', color: '#660066' }}>Ketuk icon <Icon style={{ color: '#660066' }} type='Feather' name='arrow-up-circle' /> jika menyukai post tersebut</Text>
                <Text style={{ textAlign: 'center', color: '#660066' }}>Ketuk icon <Icon style={{ color: '#660066' }} type='Feather' name='arrow-down-circle' /> jika tidak menyukai post tersebut</Text>
                <Text style={{ textAlign: 'center', color: '#660066' }}>Ketuk icon <Icon style={{ color: '#660066' }} type='Ionicons' name='alert' /> jika ingin melaporkan post tersebut</Text>
                <Text style={{ textAlign: 'center', color: '#660066' }}>Post yang masuk trend adalah post yang mempunyai icon <Icon style={{ color: '#660066' }} type='Ionicons' name='star-outline' /></Text>
            </View>
            <Button rounded style={{ alignSelf: 'center', backgroundColor: '#660066' }} onPress={props.infoClicked}>
                <Text style={{ color: '#fff' }}>Close</Text>
            </Button>
        </Animated.View>
    );
}

