import localStorage from 'localStorage';
import { LS_TOKEN } from './constants';

export const getToken = () => localStorage.getItem(LS_TOKEN);

export const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
  dateStyle: 'full',
  timeStyle: 'medium'
});
