// import './App.css';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import { Provider } from 'react-redux'
import store from './Store/store';
import {  collection, getDocs } from 'firebase/firestore/lite';
import { useEffect } from 'react';
import db from './Helper/Firebase';

function App() {
  useEffect(()=> {
    getData()
  }, [])
  
  const getData = async () => {
    try {
      const citiesCol = collection(db, 'products');
    const citySnapshot = await getDocs(citiesCol);
    console.log("citySnapshot ", citySnapshot);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    console.log("cityList ", cityList);
    } catch(e){
      console.log("error ",e );
    }
  }

  return (
    <Provider store={store}>
      <div style={{flex: 1, display: 'flex'}}>
        <HomeScreen />
      </div>
    </Provider>
  );
}


export default App;
