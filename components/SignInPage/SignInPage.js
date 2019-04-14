import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
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

            {props.spinner ? (
                <View style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    top: 40
                }}>
                    <Spinner color='#660066' />
                </View>
            ) : null}

            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <Text style={{
                    textAlign: 'center',
                    fontWeight: '500',
                    fontSize: 50,

                }}>Log in</Text>

                <KeyboardAvoidingView behavior="padding" enabled>
                    <Form style={{
                        padding: 20,
                        justifyContent: 'center'
                    }}>
                        <Item floatingLabel style={{ borderColor: '#660066', paddingBottom: 10 }}>
                            <Label>Email</Label>
                            <Input
                                autoCapitalize='none'
                                keyboardType='email-address'
                                returnKeyType='done'
                                onChangeText={props.inputEmailValChange}
                                value={props.signEmailValue} />
                        </Item>
                        <Item floatingLabel style={{ borderColor: '#660066', paddingBottom: 10 }}>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                returnKeyType='go'
                                onChangeText={props.inputPassValChange}
                                value={props.signPassValue}
                                autoCapitalize='none' />
                        </Item>
                        <Button rounded onPress={props.loginEvent} style={{
                            marginTop: 40,
                            backgroundColor: '#640164',
                            alignSelf: 'center',
                            width: 150,
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Text>Sign in</Text>
                        </Button>
                        <Text style={{ textAlign: 'center', marginVertical: 15 }}>or</Text>
                        <Button
                            rounded
                            style={{ borderColor: '#660066', width: 150, borderWidth: 1, display: 'flex', justifyContent: 'center', backgroundColor: 'none', alignSelf: 'center' }}
                            onPress={props.gotoSignup} ><Text style={{ color: '#640164' }}>Sign up</Text></Button>
                    </Form>
                </KeyboardAvoidingView>

            </View>
        </Container>
    );
}

const styles = StyleSheet.create({

});
