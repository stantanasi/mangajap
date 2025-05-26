import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Json, JsonApiIdentifier } from '@stantanasi/jsonapi-client';
import { useDispatch, useSelector } from 'react-redux';
import { IAnimeEntry } from '../models/anime-entry.model';
import { IAnime } from '../models/anime.model';
import { IChange } from '../models/change.model';
import { IChapterEntry } from '../models/chapter-entry.model';
import { IChapter } from '../models/chapter.model';
import { IEpisodeEntry } from '../models/episode-entry.model';
import { IEpisode } from '../models/episode.model';
import { IFollow } from '../models/follow.model';
import { IFranchise } from '../models/franchise.model';
import { IGenre } from '../models/genre.model';
import { IMangaEntry } from '../models/manga-entry.model';
import { IManga } from '../models/manga.model';
import { IPeople } from '../models/people.model';
import { IReview } from '../models/review.model';
import { ISeason } from '../models/season.model';
import { IStaff } from '../models/staff.model';
import { ITheme } from '../models/theme.model';
import { IUser } from '../models/user.model';
import { IVolumeEntry } from '../models/volume-entry.model';
import { IVolume } from '../models/volume.model';
import { createModelSlice } from './helpers/createModelSlice';

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


export const slices = {
  anime: createModelSlice<IAnime>('anime', [
    'genres',
    'themes',
    'seasons',
    'episodes',
    'staff',
    'reviews',
    'franchises',
    'changes',
    'anime-entry',
  ]),
  'anime-entries': createModelSlice<IAnimeEntry>('anime-entries', [
    'user',
    'anime',
  ]),
  changes: createModelSlice<IChange>('changes', [
    'document',
    'user',
  ]),
  chapters: createModelSlice<IChapter>('chapters', [
    'manga',
    'volume',
    'changes',
    'chapter-entry',
  ]),
  'chapter-entries': createModelSlice<IChapterEntry>('chapter-entries', [
    'user',
    'chapter',
  ]),
  episodes: createModelSlice<IEpisode>('episodes', [
    'anime',
    'season',
    'changes',
    'episode-entry',
  ]),
  'episode-entries': createModelSlice<IEpisodeEntry>('episode-entries', [
    'user',
    'episode',
  ]),
  follows: createModelSlice<IFollow>('follows', [
    'follower',
    'followed',
  ]),
  franchises: createModelSlice<IFranchise>('franchises', [
    'source',
    'destination',
    'changes',
  ]),
  genres: createModelSlice<IGenre>('genres', [
    'animes',
    'mangas',
    'changes',
  ]),
  manga: createModelSlice<IManga>('manga', [
    'genres',
    'themes',
    'volumes',
    'chapters',
    'staff',
    'reviews',
    'franchises',
    'changes',
    'manga-entry',
  ]),
  'manga-entries': createModelSlice<IMangaEntry>('manga-entries', [
    'user',
    'manga',
  ]),
  peoples: createModelSlice<IPeople>('peoples', [
    'staff',
    'anime-staff',
    'manga-staff',
    'changes',
  ]),
  reviews: createModelSlice<IReview>('reviews', [
    'user',
    'anime',
    'manga',
  ]),
  seasons: createModelSlice<ISeason>('seasons', [
    'anime',
    'episodes',
    'changes',
  ]),
  staff: createModelSlice<IStaff>('staff', [
    'people',
    'anime',
    'manga',
    'changes',
  ]),
  themes: createModelSlice<ITheme>('themes', [
    'animes',
    'mangas',
    'changes',
  ]),
  users: createModelSlice<IUser>('users', [
    'followers',
    'following',
    'anime-library',
    'manga-library',
    'anime-favorites',
    'manga-favorites',
    'reviews',
  ]),
  volumes: createModelSlice<IVolume>('volumes', [
    'manga',
    'chapters',
    'volume-entry',
    'changes',
  ]),
  'volume-entries': createModelSlice<IVolumeEntry>('volume-entries', [
    'user',
    'volume',
  ]),
};

export const reducers = Object.fromEntries(
  Object.entries(slices).map(([key, slice]) => [key, slice.reducer])
) as { [K in keyof typeof slices]: typeof slices[K]['reducer'] };

export const rootReducer = combineReducers(reducers);

const store = configureStore({
  reducer: rootReducer,
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = (dispatch: AppDispatch, getState: () => RootState) => void;


export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();


export default store;
