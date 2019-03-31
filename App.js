import React, { Component } from 'react';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, ScrollView, Dimensions, Text, FlatList } from 'react-native';
import { Header, Container, Left, Body, Right, Title, Content, Button, Spinner, Drawer, Icon, H2 } from 'native-base';
import axios from 'axios';

//COMPONENTS
// import SignInPage from './components/SignInPage/SignInPage';
import Feed from './components/Feed/Feed';
import InputPengaduan from './components/InputPengaduan/InputPengaduan';


export default class App extends React.Component {
  state = {
    signEmailValue: '',
    signPassValue: '',
    post: [],
    postOpen: false,
    InputPengaduan: false,
    loaded: 10
  }

  fetching = () => {
    axios.get('https://forumpengaduan.firebaseio.com/data.json').then(data => {
      const posts = Object.values(data.data);
      this.setState({ post: posts, postOpen: true });
    });
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.fetching();
  };



  changeEvent = (e) => {
    const signEmailValue = e.nativeEvent.target === 7 ? 'signEmailValue' : 'signPassValue';
    const signPassValue = e.nativeEvent.text;
    console.log(signEmailValue, signPassValue);
    this.setState({ signEmailValue: signPassValue, signEmailValue: signPassValue });
    console.log(this.state.signEmailValue, this.state.signPassValue);
  };

  render() {
    const sliced = this.state.post.reverse();
    const posts = sliced.map(post => <Feed key={post.aduan} nama={post.nama} body={post.aduan} date={post.date} time={post.time} />);
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.state.postOpen ? this.setState({ InputPengaduan: true, postOpen: false }) : this.setState({ InputPengaduan: false, postOpen: true })}>
              <Icon type='AntDesign' name={this.state.InputPengaduan ? 'home' : 'form'} style={{ color: '#fff', fontSize: 25 }} />
            </Button>
          </Left>
          <Body>
            <Text style={{ fontWeight: '100', color: '#fff', fontSize: 25 }}>Glue</Text>
          </Body>
          <Right>
            <Button transparent>
              <Icon type='Ionicons' name='refresh' style={{ color: '#fff', fontSize: 25 }} onPress={this.fetching} />
            </Button>
          </Right>
        </Header>
        <ScrollView>

          {this.state.postOpen ? posts : null}
          {/* {this.state.postOpen && this.state.loaded <= this.state.post.length ? <Button block light style={{ marginVertical: 30 }} onPress={() => this.setState({
            loaded: this.state.loaded + 10
          })}>
            <Text>See More</Text>
          </Button> : <H2 style={{ textAlign: 'center', marginVertical: 20 }}>That's it</H2>} */}
          {this.state.InputPengaduan ? <InputPengaduan /> : null}

        </ScrollView>


      </Container>






    );
  }
}
let screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  posts: {
    width: '100%',
    backgroundColor: '#6e8272',
  },
  header: {
    backgroundColor: '#0a78af',

  }
});

