import React from 'react';
import {
  Edit,
  TextInput,
  BooleanInput,
  NumberInput,
  DateTimeInput,
  SimpleForm
} from 'react-admin';

const CheckInformationEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="_id" />
      <TextInput source="user_id" />
      <TextInput source="alias" />
      <TextInput source="address" />
      <NumberInput source="port" />
      <BooleanInput source="state" />
      <DateTimeInput source="lastCheckedAt" />
      <DateTimeInput source="createdAt" />
      <DateTimeInput source="updatedAt" />
    </SimpleForm>
  </Edit>
);

export default CheckInformationEdit;