import React from 'react';
import { List, Datagrid, TextField, BooleanField, DateField, Filter, TextInput } from 'react-admin';

const CheckInformationFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

const CheckInformationList = (props) => (
  <List filters={<CheckInformationFilter />} {...props}>
    <Datagrid rowClick='edit'>
      <TextField source="id" />
      <TextField source="user_id" />
      <TextField source="alias" />
      <TextField source="address" />
      <TextField source="port" />
      <BooleanField source="state" />
      <DateField source="lastCheckedAt" showTime />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
)

export default CheckInformationList;