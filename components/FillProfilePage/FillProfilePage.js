import React from 'react';
import { View } from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Button,
    Text,
    Label,
    Spinner,
    H1,
    Picker,
    Icon,
    Thumbnail
} from 'native-base';

export default FillProfilePage = (props) => {

    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
    return (
        <Container style={{
            flex: 1,
            width: '100%',
        }}>
            {/* <Content style={{
                flex: 1,
            }}>
                <H1 style={{
                    textAlign: 'center',
                    marginTop: 40
                }}>Lengkapi profile anda</H1>

                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    marginTop: 30,
                    justifyContent: 'center'
                }}>
                    <Thumbnail source={props.image ? { uri: props.image } : require('../../assets/ProfileIcon.png')} style={{ marginTop: 10, width: 150, height: 150 }} />
                    <Text style={{ marginVertical: 5 }}>{props.profilePictCondition}</Text>
                    <View>
                        <Button onPress={props._takeImage} style={{ width: 200, marginVertical: 20, backgroundColor: '#640164' }}>
                            <Text style={{ textAlign: 'center' }}>Take a photo</Text>
                        </Button>
                        <Button onPress={props._pickImage} style={{ width: 200, backgroundColor: '#640164' }}>
                            <Text style={{ textAlign: 'center' }}>Choose from library</Text>
                        </Button>
                    </View>

                </View>

                <Form style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    

                    <Button block onPress={props.saveProfileEvent} style={{
                        marginTop: 40,
                        backgroundColor: '#640164'
                    }}>
                        <Text>Simpan</Text>
                    </Button>

                    {props.cancelOnFill ? <Button block onPress={props.cancelEvent} style={{
                        marginTop: 40,
                        backgroundColor: '#640164'
                    }}>
                        <Text>Cancel</Text>
                    </Button> : null}
                </Form>
            </Content> */}
        </Container>
    );
}

