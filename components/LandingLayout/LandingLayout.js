import React, { Component } from 'react';
import { StyleSheet, View, Image, ScrollView, Dimensions } from 'react-native';
import { Title, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import * as firebase from 'firebase';
import Swiper from 'react-native-swiper';
import { createDrawerNavigator, createAppContainer, DrawerItems, } from 'react-navigation';



import Feed from '../Feed/Feed';
import ProfilePageStack from '../ProfilePageStack';
import CustomDrawer from './CustomDrawer';
import ProfilePage from '../ProfilePage/ProfilePage';
import FillProfilePage from '../FillProfilePage/FillProfilePage';
import inputPengaduan from '../InputPengaduan/InputPengaduan';



class LandingLayout extends Component {
    state = {
    }

    //WARNING! To be deprecated in React v17. Use componentDidMount instead.
    componentWillMount() {
    }


    render() {
        let screenWidth = Dimensions.get('window').width;
        return (
            <>
                <LandingNavigator />
            </>
        )
    }
}

export default LandingLayout;


const DrawerNav = createDrawerNavigator({
    Home: { screen: Feed },
    Profile: { screen: ProfilePage },
    EditProfile: { screen: FillProfilePage },
    createPost: { screen: inputPengaduan }
},
    {
        drawerPosition: 'left',
        contentComponent: ({ navigation }) => {
            return (<CustomDrawer
                gotoProfile={() => navigation.navigate('Profile')}
                gotoHome={() => navigation.navigate('Home')} />)
        },
    }
);

const LandingNavigator = createAppContainer(DrawerNav);
