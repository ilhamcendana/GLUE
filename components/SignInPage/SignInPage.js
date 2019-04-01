import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    H1
} from 'native-base';

export default SignInPage = (props) => {
    return (
        <Container style={{
            flex: 1,
            width: '100%'
        }}>
            <H1 style={{
                textAlign: 'center',
                marginTop: 40
            }}>Sign in</H1>

            <Content style={{
                flex: 1,
            }}>
                {props.spinner ? (
                    <View style={{
                        position: 'absolute',
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        <Spinner />
                    </View>
                ) : null}

                <Form style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input onChangeText={props.inputEmailValChange} value={props.signEmailValue} />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Password</Label>
                        <Input secureTextEntry={true} onChangeText={props.inputPassValChange} value={props.signPassValue} />
                    </Item>
                    <Button block onPress={props.loginEvent} style={{
                        marginTop: 40
                    }}>
                        <Text>Sign in</Text>
                    </Button>
                    <View style={{
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text>or</Text>
                        <Button transparent onPress={props.gotoSignup} block><Text>Sign up</Text></Button>
                    </View>
                </Form>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({

});
