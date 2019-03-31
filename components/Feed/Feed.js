import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default Feed = (props) => {
    const dotdot = props.body.length > 200 ? '...' : '';
    return (

        <Content scrollEnabled={false}>
            <Card style={{ flex: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: 'https://fakeimg.pl/300/' }} />
                        <Body>
                            <Text>{props.nama}</Text>
                            <Text note>{props.time},{' '}{props.date}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Image source={{ uri: 'https://dummyimage.com/600x400/000/fff' }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                        <Text>
                            {props.body + dotdot}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent>
                            <Icon type='AntDesign' name="upcircleo" style={{ color: '#2CAA3F' }} />
                            <Text style={{ color: '#2CAA3F' }}>19</Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button transparent>
                            <Icon type='AntDesign' name="downcircleo" style={{ color: '#b71919' }} />
                            <Text style={{ color: '#b71919' }}>12</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        </Content>

    );
}

const styles = StyleSheet.create({
    feed: {
        width: '100%',
        flex: 1,
        backgroundColor: 'green'
    }
});
