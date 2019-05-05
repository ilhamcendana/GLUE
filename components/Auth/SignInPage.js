import React, { Component } from 'react';
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
import * as firebase from 'firebase';

class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signEmailValue: '',
            signPassValue: '',
            spinner: false,
            errorLoginSignupMessage: '',
            isLogin: false

        }

    }

    static navigationOptions = {
        header: null,
    };



    //ALL LOGIN EVENT
    inputEmailValChange = (e) => {
        this.setState({ signEmailValue: e });
    };

    inputPassValChange = (e) => {
        this.setState({ signPassValue: e });
    };

    loginEvent = () => {
        const { signEmailValue, signPassValue } = this.state;

        this.setState({ spinner: true });
        firebase.auth().signInWithEmailAndPassword(signEmailValue, signPassValue)
            .then(() => {
                if (firebase.auth().currentUser.emailVerified) {

                } else {
                    this.setState({ spinner: false });
                    alert('verifikasi dulu');
                }
            }).catch((e) => {
                if (e === 'The email address is badly formatted.' || 'The password is invalid or the user does not have a password.') {
                    this.setState({ errorLoginSignupMessage: 'Email atau Password salah!' });
                } else {
                    this.setState({ errorLoginSignupMessage: e });
                }
                alert(e);
            });
    }


    //END ALL LOGIN EVENT -----------------------------
    render() {
        return (
            <Container style={{
                flex: 1,
                width: '100%',
            }}>

                {this.state.spinner ? (
                    <View style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        top: 40,
                        backgroundColor: '#fff'
                    }}>
                        <Spinner color='#598c5f' />
                    </View>
                ) : null}

                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <Text style={{
                        textAlign: 'center',
                        fontWeight: '500',
                        fontSize: 50,


                    }}>Masuk</Text>

                    <KeyboardAvoidingView behavior="padding" enabled>
                        <Form style={{
                            padding: 20,
                            justifyContent: 'center'
                        }}>
                            <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                <Label>Email</Label>
                                <Input
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    returnKeyType='next'
                                    onChangeText={this.inputEmailValChange}
                                    value={this.state.signEmailValue}
                                />
                            </Item>
                            <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                <Label>Password</Label>
                                <Input
                                    secureTextEntry={true}
                                    returnKeyType='go'
                                    onChangeText={this.inputPassValChange}
                                    value={this.state.signPassValue}
                                    autoCapitalize='none'
                                    onSubmitEditing={this.loginEvent}
                                />
                            </Item>
                            <Button rounded bordered onPress={this.loginEvent} style={{
                                marginTop: 40,
                                alignSelf: 'center',
                                width: 150,
                                display: 'flex',
                                justifyContent: 'center',
                                borderColor: '#598c5f',
                                borderWidth: 2
                            }}>
                                <Text style={{ color: '#598c5f' }}>Masuk</Text>
                            </Button>
                            <Text style={{ textAlign: 'center', marginVertical: 15 }}>or</Text>
                            <Button
                                rounded
                                style={{ backgroundColor: '#598c5f', width: 150, display: 'flex', justifyContent: 'center', alignSelf: 'center' }}
                                onPress={() => this.props.navigation.navigate('Signup')} ><Text>Buat akun</Text></Button>
                        </Form>
                    </KeyboardAvoidingView>

                </View>
            </Container>
        );
    }
}

export default SignInPage;

