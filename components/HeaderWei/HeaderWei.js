import React from 'react';
import { StyleSheet } from 'react-native';
import { Header, Left, Right, Body, Button, Text, Icon } from 'native-base';
import Swiper from 'react-native-swiper';
import { Constants } from 'expo';

export default HeaderWei = (props) => {
    return (
        <Header style={styles.header} >
            <Left style={{ flex: 1 }}>
            </Left>
            <Body style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '100', marginTop: Constants.statusBarHeight }}>GLU!</Text>
            </Body>
            <Right style={{ flex: 1 }}>
                {props.fillProfilePage ? null : <Button transparent onPress={props.infoClickedOpen}>
                    <Icon type='Feather' name='info' style={{ color: '#fff', marginTop: Constants.statusBarHeight }} />
                </Button>}
            </Right>
        </Header>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#660066',
        alignItems: 'center',
        justifyContent: 'center',
        height: Constants.statusBarHeight + 50,
        zIndex: 100
    }
});