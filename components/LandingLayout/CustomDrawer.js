import React, { Component } from "react";
import { View, Alert } from "react-native";
import {
  Container,
  Header,
  Body,
  Thumbnail,
  Text,
  Icon,
  Content,
  List,
  ListItem,
  Button,
  Footer,
  FooterTab
} from "native-base";
import * as firebase from "firebase";
import "firebase/firestore";

class CustomDrawer extends Component {
  state = {
    profilPictUrl: "",
    nama: "",
    isVerified: ""
  };

  componentDidMount() {
    this.fetchDrawer();
  }

  fetchDrawer = () => {
    if (firebase.auth().currentUser.emailVerified) {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set({ profile: { isVerified: true } }, { merge: true });
    }
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(snap => {
        this.setState({
          nama: snap.data().profile.nama,
          profilPictUrl: snap.data().profile.profilePict,
          isVerified: snap.data().profile.isVerified
        });
      });
  };

  render() {
    return (
      <Container>
        <Header style={{ height: 200, backgroundColor: "#598c5f" }}>
          <Body style={{ alignItems: "center" }}>
            <View>
              <View
                style={{
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 30,
                  height: 30,
                  position: "absolute",
                  right: 0,
                  zIndex: 5,
                  backgroundColor:
                    this.state.isVerified === true ? "#4ba86a" : "#ce164d",
                  flex: 1
                }}
              >
                <Icon
                  style={{ fontSize: 15, color: "#fff" }}
                  type="Feather"
                  name={this.state.isVerified === true ? "check" : "x"}
                />
              </View>
              <Thumbnail
                source={
                  this.state.profilPictUrl !== ""
                    ? { uri: this.state.profilPictUrl }
                    : require("../../assets/ProfileIcon.png")
                }
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            </View>
            <Text style={{ marginTop: 15, color: "#fff" }}>
              {this.state.nama}
            </Text>
            {this.state.isVerified === true ? null : (
              <Button
                onPress={() => {
                  firebase
                    .auth()
                    .currentUser.sendEmailVerification()
                    .then(() =>
                      Alert.alert(
                        "Verifikasi Email telah dikirim ke email anda",
                        "klik link lalu restart app"
                      )
                    );
                }}
                small
                rounded
                bordered
                style={{ marginTop: 10, borderColor: "#fff" }}
              >
                <Text style={{ color: "#fff" }}>
                  Kirim ulang email verifikasi
                </Text>
              </Button>
            )}
          </Body>
        </Header>

        <Content>
          <List>
            <ListItem iconLeft onPress={this.props.gotoHome}>
              <Icon name="home" type="Feather" style={{ color: "black" }} />
              <Body>
                <Text style={{ color: "black" }}>Beranda</Text>
              </Body>
            </ListItem>

            <ListItem iconLeft onPress={this.props.gotoProfile}>
              <Icon name="user" type="Feather" style={{ color: "black" }} />
              <Body>
                <Text style={{ color: "black" }}>Profil</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
        <Footer>
          <FooterTab style={{ backgroundColor: "#598c5f" }}>
            <Button
              vertical
              onPress={() =>
                Alert.alert("Keluar", "Anda yakin ?", [
                  { text: "Kembali", style: "cancel" },
                  {
                    text: "Ya",
                    onPress: () => {
                      firebase.auth().signOut();
                    }
                  }
                ])
              }
            >
              <Icon name="log-out" type="Feather" />
            </Button>
          </FooterTab>
          <FooterTab style={{ backgroundColor: "#598c5f" }}>
            <Button vertical onPress={this.props.gotoInformation}>
              <Icon name="information-circle-outline" type="Ionicons" />
            </Button>
          </FooterTab>
          <FooterTab style={{ backgroundColor: "#598c5f" }}>
            <Button vertical onPress={this.props.gotoHelp}>
              <Icon name="help-circle" type="Feather" />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default CustomDrawer;
