import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IHomework, defaultValue } from 'app/shared/model/homework.model';

export const ACTION_TYPES = {
  SEARCH_HOMEWORK: 'homework/SEARCH_HOMEWORK',
  FETCH_HOMEWORK_LIST: 'homework/FETCH_HOMEWORK_LIST',
  FETCH_HOMEWORK: 'homework/FETCH_HOMEWORK',
  CREATE_HOMEWORK: 'homework/CREATE_HOMEWORK',
  UPDATE_HOMEWORK: 'homework/UPDATE_HOMEWORK',
  DELETE_HOMEWORK: 'homework/DELETE_HOMEWORK',
  RESET: 'homework/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IHomework>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type HomeworkState = Readonly<typeof initialState>;

// Reducer

export default (state: HomeworkState = initialState, action): HomeworkState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_HOMEWORK):
    case REQUEST(ACTION_TYPES.FETCH_HOMEWORK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_HOMEWORK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_HOMEWORK):
    case REQUEST(ACTION_TYPES.UPDATE_HOMEWORK):
    case REQUEST(ACTION_TYPES.DELETE_HOMEWORK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_HOMEWORK):
    case FAILURE(ACTION_TYPES.FETCH_HOMEWORK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_HOMEWORK):
    case FAILURE(ACTION_TYPES.CREATE_HOMEWORK):
    case FAILURE(ACTION_TYPES.UPDATE_HOMEWORK):
    case FAILURE(ACTION_TYPES.DELETE_HOMEWORK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_HOMEWORK):
    case SUCCESS(ACTION_TYPES.FETCH_HOMEWORK_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_HOMEWORK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_HOMEWORK):
    case SUCCESS(ACTION_TYPES.UPDATE_HOMEWORK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_HOMEWORK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/homework';
const apiSearchUrl = 'api/_search/homework';

// Actions

export const getSearchEntities: ICrudSearchAction<IHomework> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_HOMEWORK,
  payload: axios.get<IHomework>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IHomework> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_HOMEWORK_LIST,
    payload: axios.get<IHomework>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IHomework> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_HOMEWORK,
    payload: axios.get<IHomework>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IHomework> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_HOMEWORK,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IHomework> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_HOMEWORK,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IHomework> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_HOMEWORK,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
