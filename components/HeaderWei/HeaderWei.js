import React from 'react';
import { StyleSheet } from 'react-native';
import { Header, Left, Right, Body, Button, Text, Icon } from 'native-base';
import Swiper from 'react-native-swiper';
import { Constants } from 'expo';

export default HeaderWei = (props) => {
    return (
        <Header>
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={props.openDrawer}>
                    <Icon name='menu' type='Feather' />
                </Button>
            </Left>
            <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff' }}>GLUE</Text></Body>
            <Right style={{ flex: 1 }}>
                <Button transparent>
                    <Icon type='Feather' name='more-horizontal' />
                </Button>
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