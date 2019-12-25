import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import { API_URL, LS_NCTOKEN } from '../constants';

const apiUrl = `${API_URL}/admin`;
const httpClient = fetchUtils.fetchJson;

const getOptions = (options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json ' });
  }
  const token = localStorage.getItem(LS_NCTOKEN);
  options.headers.set('Authorization', `Bearer ${token}`);

  return options;
}

export default {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: field,
      order: order,
      start: (page - 1) * perPage,
      end: page * perPage,
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url, getOptions()).then(({ headers, json }) => ({
      data: json.map(resource => ({ ...resource, id: resource._id })),
      total: parseInt(headers.get('X-Total-Count')),
    }));
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, getOptions()).then(({ json }) => ({
      data: { ...json, id: json._id },
    })),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url, getOptions()).then(({ json }) => ({
      data: json.map(resource => ({ ...resource, id: resource._id })),
    }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: field,
      order: order,
      start: (page - 1) * perPage,
      end: page * perPage,
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url, getOptions()).then(({ headers, json }) => ({
      data: json.map(resource => ({ ...resource, id: resource._id })),
      total: parseInt(headers.get('X-Total-Count')),
    }));
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
      ...getOptions()
    }).then(({ json }) => ({ data: { ...json, id: json._id } })),

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
      ...getOptions()
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
      ...getOptions()
    }).then(({ json }) => ({
      data: { ...params.data, id: json._id },
    })),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
      ...getOptions()
    }).then(({ json }) => ({ data: { ...json, id: json._id } })),

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: 'DELETE',
      body: JSON.stringify(params.data),
      ...getOptions()
    }).then(({ json }) => ({ data: json }));
  }
};