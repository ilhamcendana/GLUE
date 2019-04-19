import React, { Component } from 'react';
import { View, Switch } from 'react-native';
import { Container, Header, Body, Thumbnail, Text, Icon, Right, Content, List, ListItem, Left, Button, Badge, Footer, FooterTab } from 'native-base';
import { DrawerItems } from 'react-navigation';
import * as firebase from 'firebase';

class CustomDrawer extends Component {
    state = {
        profilPictUrl: '',
        nama: ''
    }

    componentWillMount() {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/profile')
            .on('value', (snapshot) => {
                this.setState({
                    profilPictUrl: snapshot.val().profilPictUrl,
                    nama: snapshot.val().nama
                })
            })
    }

    render() {
        return (
            <Container>
                <Header style={{ height: 200, backgroundColor: '#598c5f' }}>
                    <Body style={{ alignItems: 'center' }}>
                        <View>
                            <View style={{ borderRadius: 15, justifyContent: 'center', alignItems: 'center', width: 30, height: 30, position: 'absolute', right: 0, zIndex: 5, backgroundColor: firebase.auth().currentUser.emailVerified ? '#4ba86a' : '#ce164d', flex: 1 }}><Icon style={{ fontSize: 15, color: '#fff' }} type='Feather' name={firebase.auth().currentUser.emailVerified ? 'check' : 'x'} /></View>
                            <Thumbnail source={this.state.profilPictUrl === '' ? require('../../assets/ProfileIcon.png') : { uri: this.state.profilPictUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        </View>
                        <Text style={{ marginTop: 15, color: '#fff' }}>{this.state.nama}</Text>
                    </Body>

                </Header>

                <Content>
                    <List>
                        <ListItem iconLeft onPress={this.props.gotoHome}>
                            <Icon name='home' type='Feather' style={{ color: 'black' }} />
                            <Body>
                                <Text style={{ color: 'black' }}>Beranda</Text>
                            </Body>
                        </ListItem>

                        <ListItem iconLeft onPress={this.props.gotoProfile}>
                            <Icon name='user' type='Feather' style={{ color: 'black' }} />
                            <Body>
                                <Text style={{ color: 'black' }}>Profil</Text>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: '#598c5f' }}>
                        <Button vertical onPress={() => firebase.auth().signOut()}>
                            <Icon name='log-out' type='Feather' />
                        </Button>
                    </FooterTab>
                    <FooterTab style={{ backgroundColor: '#598c5f' }}>
                        <Button vertical>
                            <Icon name='information-circle-outline' type='Ionicons' />
                        </Button>
                    </FooterTab>
                    <FooterTab style={{ backgroundColor: '#598c5f' }}>
                        <Button vertical>
                            <Icon name='help-circle' type='Feather' />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}


export default CustomDrawer;