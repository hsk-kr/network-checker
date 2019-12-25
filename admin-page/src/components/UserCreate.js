import React from 'react';
import {
  Create,
  TextInput,
  BooleanInput,
  SimpleForm
} from 'react-admin';

const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="password" />
      <BooleanInput source="isAdmin" />
    </SimpleForm>
  </Create>
);

export default UserCreate;