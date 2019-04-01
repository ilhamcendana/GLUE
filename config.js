import firebase from 'firebase';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyD5G90qLMlefr8JpU9hLLXIEuK76qq4Pz4",
    authDomain: "forumpengaduan.firebaseapp.com",
    databaseURL: "https://forumpengaduan.firebaseio.com",
    projectId: "forumpengaduan",
    storageBucket: "forumpengaduan.appspot.com",
    messagingSenderId: "227703932306"
};
const fire = firebase.initializeApp(config);
export default fire;