import React, { Component } from 'react';
import { StyleSheet, View, Image, ScrollView, Dimensions } from 'react-native';
import { Title, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import fire from '../../config';
import Swiper from 'react-native-swiper';
import Feed from '../Feed/Feed';
import ProfilePage from '../ProfilePage/ProfilePage';
// import console = require('console');


export default class LandingLayout extends Component {
    state = {
    }

    //WARNING! To be deprecated in React v17. Use componentDidMount instead.
    componentWillMount() {
    }
    render() {
        let screenWidth = Dimensions.get('window').width;
        let verifonfeed = (
            <View style={{ width: screenWidth, flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 80, textAlign: 'center' }}>Verification your email to open feed</Text>
            </View>
        );
        let verifontrends = (
            <View style={{ width: screenWidth, flex: 1, justifyContent: 'center' }}>
                <Text style={{ fontSize: 80, textAlign: 'center' }}>Verification your email to open trends</Text>
            </View>
        );
        return (
            <Swiper loop={false} showsPagination={false} index={this.props.emailVerified ? 0 : 1} bounces={true}
                onIndexChanged={this.props.indexChange}
            >

                <ProfilePage
                    openEdit={this.props.openEdit}
                    namaUser={this.props.namaUser}
                    npmUser={this.props.npmUser}
                    kelasUser={this.props.kelasUser}
                    jurusanUser={this.props.jurusanUser}
                />

                {this.props.emailVerified ? <Feed PickImagePost={this.props.PickImagePost} uid={this.props.uid} /> : verifonfeed}
                {this.props.emailVerified ? <View style={{
                    backgroundColor: 'pink',
                    flex: 1,
                    width: screenWidth,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{ fontSize: 50, color: '#fff', fontWeight: "bold", textAlign: 'center' }}>TRENDS IS ON UNDER CONSTRUCTION</Text>
                    <Button block onPress={() => fire.auth().signOut()} style={{ backgroundColor: '#fff', marginTop: 50 }}>
                        <Text style={{ color: 'black' }}>Sign out</Text>
                    </Button>
                </View> : verifontrends}

            </Swiper>
        )
    }


}


