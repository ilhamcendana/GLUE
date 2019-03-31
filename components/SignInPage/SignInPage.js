import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';

export default SignInPage = (props) => {
    return (
        <View style={styles.container}>
            <Input
                placeholder='Email'
                returnKeyType='next'
                leftIcon={
                    <Icon
                        name='user'
                        size={24}
                        color='black'
                        style={{
                            marginRight: 10
                        }}
                    />
                }
                onChange={props.changeEvent}
                value={props.signEmailValue}
            />

            <Input
                placeholder='Password'
                returnKeyType='go'
                leftIcon={
                    <Icon
                        name='unlock-alt'
                        size={24}
                        color='black'
                        style={{
                            marginRight: 10
                        }}
                    />
                }
                onChange={props.changeEvent}
                value={props.signPassValue}
            />

            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    width: '100%',
                    justifyContent: 'space-evenly'
                }}>
                <Button
                    title="Sign in"
                    style={styles.button}
                />
                <Button
                    title="Sign up"
                    type="outline"
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 200
    },
    button: {
        width: 100
    }
});
