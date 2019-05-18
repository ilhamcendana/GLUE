import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Button, Icon, Text } from 'native-base';

class OpenedPostPict extends React.Component {
    state = {
        postPictUrl: this.props.navigation.state.params.postPictUrl,
        username: this.props.navigation.state.params.username
    }

    render() {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        return (
            <Container style={{ backgroundColor: '#333' }}>
                <Header style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('FeedComponent')} style={{ zIndex: 100 }}>
                            <Icon name='x' type='Feather' />
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff', textAlign: 'center' }}>{this.state.username}</Text></Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <View style={{ justifyContent: 'center', width: screenWidth, flex: 1 }}>
                    <Image source={{ uri: this.state.postPictUrl }} style={{ width: '100%', flex: 1 }} />
                </View>
            </Container>


        );
    }
}

export default OpenedPostPict;