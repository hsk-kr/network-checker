import React from 'react';
import {
  Edit,
  TextInput,
  BooleanInput,
  DateTimeInput,
  SimpleForm
} from 'react-admin';

const UserEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="_id" />
      <TextInput source="username" />
      <TextInput source="password" />
      <BooleanInput source="isAdmin" />
      <DateTimeInput source="createdAt" />
    </SimpleForm>
  </Edit>
);

export default UserEdit;