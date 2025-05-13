import { configureStore } from '@reduxjs/toolkit';
import { Json, JsonApiIdentifier } from '@stantanasi/jsonapi-client';
import { useDispatch, useSelector } from 'react-redux';

export type State<DocType> = {
  entities: {
    [id: string]: Json<DocType> | undefined;
  };

  relations: {
    [relation: string]: {
      [id: string]: JsonApiIdentifier | JsonApiIdentifier[] | null | undefined;
    };
  };
};


const store = configureStore({
  reducer: {},
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = (dispatch: AppDispatch, getState: () => RootState) => void;


export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();


export default store;
