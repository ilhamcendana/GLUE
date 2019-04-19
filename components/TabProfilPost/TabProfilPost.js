import React from 'react';
import { Image } from 'react-native';
import { Card, CardItem, Left, Body, Right, Text, Button, Icon, Thumbnail, Content } from 'native-base';

export default TabProfilPost = (props) => {
    return (
        <Content padder>
            <Card style={{ flex: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                        <Body>
                            <Text>Ilham Cendana</Text>
                            <Text note>April 15, 2019</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Image source={{ uri: 'https://placeimg.com/740/580/tech' }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero recusandae, reprehenderit, delectus itaque inventore, reiciendis est ratione repellat facere cupiditate assumenda harum quae ducimus quibusdam. Ex, fugit! A, rem quo.
                                </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="arrow-up-circle" type='Feather'
                                style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>10</Text>

                        </Button>
                    </Left>

                    <Body>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="arrow-down-circle" type='Feather'
                                style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>1</Text>
                        </Button>
                    </Body>

                    <Right>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="chatbubbles" style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>123</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>

            <Card style={{ flex: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                        <Body>
                            <Text>Ilham Cendana</Text>
                            <Text note>April 15, 2019</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Image source={{ uri: 'https://placeimg.com/740/580/tech' }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero recusandae, reprehenderit, delectus itaque inventore, reiciendis est ratione repellat facere cupiditate assumenda harum quae ducimus quibusdam. Ex, fugit! A, rem quo.
                                </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="arrow-up-circle" type='Feather'
                                style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>10</Text>

                        </Button>
                    </Left>

                    <Body>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="arrow-down-circle" type='Feather'
                                style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>1</Text>
                        </Button>
                    </Body>

                    <Right>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="chatbubbles" style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>123</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>

            <Card style={{ flex: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                        <Body>
                            <Text>Ilham Cendana</Text>
                            <Text note>April 15, 2019</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Image source={{ uri: 'https://placeimg.com/740/580/tech' }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero recusandae, reprehenderit, delectus itaque inventore, reiciendis est ratione repellat facere cupiditate assumenda harum quae ducimus quibusdam. Ex, fugit! A, rem quo.
                                </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="arrow-up-circle" type='Feather'
                                style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>10</Text>

                        </Button>
                    </Left>

                    <Body>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="arrow-down-circle" type='Feather'
                                style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>1</Text>
                        </Button>
                    </Body>

                    <Right>
                        <Button transparent style={{ justifyContent: 'center' }}>
                            <Icon name="chatbubbles" style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>123</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        </Content>
    );
}

