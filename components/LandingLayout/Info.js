import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Body, Right } from 'native-base';
import { WebBrowser } from 'expo';


const Info = (props) => {
    const { navigate } = props.navigation;

    return (
        <Container>
            <Header style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#598c5f' }}>
                <Left style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Button transparent onPress={() => navigate('Home')} style={{ zIndex: 100 }}>
                        <Icon name='arrow-left' type='Feather' />
                    </Button>
                </Left>
                <Body style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#fff' }}>INFO</Text>
                </Body>
                <Right style={{ flex: 1 }}></Right>
            </Header>
            <Content>
                <View style={{ width: '100%', height: '100%', justifyContent: 'space-between' }}>
                    <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>WELCOME!</Text>
                        <Text style={{ textAlign: 'center' }}>Glue adalah sebuah aplikasi berbasis android yang berguna untuk menyampaikan informasi seputar kampus di lingkungan universitas gunadarma</Text>
                    </View>

                    <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
                        <Text style={{ textAlign: 'center', marginBottom: 40 }}>Hai perkenalkan saya ilham cendana, saya adalah developer dari aplikasi <Text style={{ color: '#598c5f', fontWeight: 'bold' }}>Glue</Text></Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 15, textAlign: 'center' }}>Follow me on</Text>
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{ alignItems: 'center' }}
                                onPress={() => WebBrowser.openBrowserAsync('https://instagram.com/ceendanaa')}>
                                <Icon type='Feather' name='instagram' />
                                <Text>Instagram</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }}
                                onPress={() => WebBrowser.openBrowserAsync('https://github.com/ilhamcendana')}>
                                <Icon type='Feather' name='github' />
                                <Text>Github</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Content>
        </Container>
    );
}

export default Info;