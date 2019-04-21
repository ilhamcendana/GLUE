import React from 'react';
import { Header, Left, Body, Right, Text, Icon, Button } from 'native-base';

const InputPengaduanCustomHeader = (props) => {
    return (
        <Header style={{ backgroundColor: '#598c5f' }}>
            <Left style={{ flex: 1 }}>
                <Button bordered rounded onPress={props.backToFeed} style={{ alignItems: 'center', borderColor: '#fff' }} small>
                    <Text style={{ color: '#fff' }}>Cancel</Text>
                </Button>
            </Left>
            <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff' }}>Create Post</Text></Body>
            <Right style={{ flex: 1 }}>

            </Right>
        </Header>
    );
}

export default InputPengaduanCustomHeader;