import React from 'react';
import './App.css';
import { Admin, Resource } from 'react-admin';
import authProvider from './providers/authProvider';
import dataProvider from './providers/dataProvider';
import UserList from './components/UserList';
import CheckInformationList from './components/CheckInformationList';
import UserEdit from './components/UserEdit';
import CheckInformationEdit from './components/CheckInformationEdit';
import UserCreate from './components/UserCreate';
import CheckInformationCreate from './components/CheckInformationCreate';

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      <Resource name='user' list={UserList} edit={UserEdit} create={UserCreate} />
      <Resource
        name='chkinfo'
        list={CheckInformationList}
        edit={CheckInformationEdit}
        create={CheckInformationCreate}
      />
    </Admin>
  );
}

export default App;
