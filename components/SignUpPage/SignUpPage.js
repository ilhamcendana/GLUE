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

export default SignUpPage = (props) => {
    return (
        <Container style={{
            flex: 1,
            width: '100%'
        }}>
            <Content style={{
                flex: 1,
            }}>
            
            <H1 style={{
                textAlign: 'center',
                marginTop: 40
            }}>Sign up</H1>

                {props.spinner ? (
                    <View style={{
                        position: 'absolute',
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        <Spinner color='blue' />
                    </View>
                ) : null}

                <Form style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                            autoCapitalize='none'
                            keyboardType='email-address'
                            returnKeyType='done'
                            onChangeText={props.signupEmailValChange}
                            value={props.signupEmailValue} />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Password</Label>
                        <Input
                            returnKeyType='go'
                            secureTextEntry={true}
                            onChangeText={props.signupPassValChange}
                            value={props.signupPassValue} />
                    </Item>
                    <Button block onPress={props.signupEvent} style={{
                        marginTop: 40
                    }}>
                        <Text>Sign up</Text>
                    </Button>
                    <View style={{
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text>Already have an account?</Text>
                        <Button transparent onPress={props.gotoSignup} block><Text>Sign in</Text></Button>
                    </View>
                </Form>
            </Content>
        </Container>
    );
}

