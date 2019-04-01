import React from 'react';
import { StyleSheet, View, Image, ScrollView, Dimensions } from 'react-native';
import { Title, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import fire from '../../config';
import Swiper from 'react-native-swiper';
import Feed from '../Feed/Feed';

export default LandingLayout = (props) => {
    let screenWidth = Dimensions.get('window').width;
    return (
        <Swiper loop={false} showsPagination={false} index={1}>
            <View style={{
                flex: 1,
                width: screenWidth,
                backgroundColor: 'lightblue',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    textAlign: 'center'
                }}>A</Text>
            </View>

            <Feed />

            <View style={{
                flex: 1,
                width: screenWidth,
                backgroundColor: 'lightyellow',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    textAlign: 'center'
                }} onPress={() => fire.auth().signOut()}>C</Text>
            </View>
            {/* <Button onPress={() => fire.auth().signOut()}>
                <Text>Sign out</Text>
            </Button> */}
        </Swiper >

    );
}

const styles = StyleSheet.create({
    feed: {
        width: '100%',
        flex: 1,
        backgroundColor: 'green'
    }
});
