// import './App.css';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import { Provider } from 'react-redux'
import store from './Store/store';
import {  collection, getDocs } from 'firebase/firestore/lite';
import { useEffect } from 'react';
import db from './Helper/Firebase';
import { Route, Routes } from 'react-router-dom';

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
      <div style={styles.rootContaner}>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />        
      </Routes>  
    </Provider>
      </div>
  );
}

const styles = {
  rootContaner: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'red',
    height: '100vh'
  }
}


export default App;
