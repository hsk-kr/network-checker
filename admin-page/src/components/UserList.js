import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  Filter,
  TextInput
} from 'react-admin';

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

const UserList = (props) => (
  <List filters={<UserFilter />} {...props}>
    <Datagrid rowClick='edit'>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="password" />
      <BooleanField source="isAdmin" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
)

export default UserList;