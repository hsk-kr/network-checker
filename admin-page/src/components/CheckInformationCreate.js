import React from 'react';
import {
  Create,
  TextInput,
  BooleanInput,
  NumberInput,
  DateTimeInput,
  SimpleForm
} from 'react-admin';

const CheckInformationCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="user_id" />
      <TextInput source="alias" />
      <TextInput source="address" />
      <NumberInput source="port" />
      <BooleanInput source="state" />
      <DateTimeInput source="lastCheckedAt" />
    </SimpleForm>
  </Create>
);

export default CheckInformationCreate;