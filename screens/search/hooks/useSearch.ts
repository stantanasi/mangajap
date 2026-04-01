import { ComponentProps, useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, Manga, People, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import SearchScreen from '../SearchScreen';

export const useSearch = (params: ComponentProps<typeof SearchScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useContext(AuthContext);
  const [animeTab, setAnimeTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [mangaTab, setMangaTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [peopleTab, setPeopleTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });
  const [userTab, setUserTab] = useState<{
    activeQuery: string;
    isLoading: boolean;
    ids: string[];
    isLoadingMore: boolean;
    offset: number;
    hasMore: boolean;
  }>({ activeQuery: '', isLoading: true, ids: [], isLoadingMore: false, offset: 0, hasMore: true });

  const animes = useAppSelector((state) => {
    return Anime.redux.selectors.selectByIds(state, animeTab.ids, {
      include: {
        'anime-entry': isAuthenticated,
      },
    });
  });

  const mangas = useAppSelector((state) => {
    return Manga.redux.selectors.selectByIds(state, mangaTab.ids, {
      include: {
        'manga-entry': isAuthenticated,
      },
    });
  });

  const peoples = useAppSelector((state) => {
    return People.redux.selectors.selectByIds(state, peopleTab.ids);
  });

  const users = useAppSelector((state) => {
    return User.redux.selectors.selectByIds(state, userTab.ids);
  });

  return {
    animeTab: {
      ...animeTab,
      list: animes,
      onChangeQuery: () => setAnimeTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setAnimeTab((prev) => ({ ...prev, isLoading: true }));

        const animes = await Anime.find({ query: query })
          .include({
            'anime-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .raw();

        dispatch(Anime.redux.actions.setMany(animes.result));

        setAnimeTab({
          activeQuery: query,
          isLoading: false,
          ids: animes.result.map((anime) => anime.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!animes.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!animeTab.hasMore || animeTab.isLoadingMore) return;

        setAnimeTab((prev) => ({ ...prev, isLoadingMore: true }));

        const animes = await Anime.find({ query: animeTab.activeQuery })
          .include({
            'anime-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .offset(animeTab.offset + 10)
          .raw();

        dispatch(Anime.redux.actions.setMany(animes.result));

        setAnimeTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(animes.result.map((anime) => anime.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!animes.body.links?.next,
        }));
      },
    },
    mangaTab: {
      ...mangaTab,
      list: mangas,
      onChangeQuery: () => setMangaTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setMangaTab((prev) => ({ ...prev, isLoading: true }));

        const mangas = await Manga.find({ query: query })
          .include({
            'manga-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .raw();

        dispatch(Manga.redux.actions.setMany(mangas.result));

        setMangaTab({
          activeQuery: query,
          isLoading: false,
          ids: mangas.result.map((manga) => manga.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!mangas.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!mangaTab.hasMore || mangaTab.isLoadingMore) return;

        setMangaTab((prev) => ({ ...prev, isLoadingMore: true }));

        const mangas = await Manga.find({ query: mangaTab.activeQuery })
          .include({
            'manga-entry': isAuthenticated,
          })
          .sort({ popularity: 'desc' })
          .offset(mangaTab.offset + 10)
          .raw();

        dispatch(Manga.redux.actions.setMany(mangas.result));

        setMangaTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(mangas.result.map((manga) => manga.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!mangas.body.links?.next,
        }));
      },
    },
    peopleTab: {
      ...peopleTab,
      list: peoples,
      onChangeQuery: () => setPeopleTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setPeopleTab((prev) => ({ ...prev, isLoading: true }));

        const peoples = await People.find({ query: query })
          .raw();

        dispatch(People.redux.actions.setMany(peoples.result));

        setPeopleTab({
          activeQuery: query,
          isLoading: false,
          ids: peoples.result.map((people) => people.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!peoples.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!peopleTab.hasMore || peopleTab.isLoadingMore) return;

        setPeopleTab((prev) => ({ ...prev, isLoadingMore: true }));

        const peoples = await People.find({ query: peopleTab.activeQuery })
          .offset(peopleTab.offset + 10)
          .raw();

        dispatch(People.redux.actions.setMany(peoples.result));

        setPeopleTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(peoples.result.map((people) => people.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!peoples.body.links?.next,
        }));
      },
    },
    userTab: {
      ...userTab,
      list: users,
      onChangeQuery: () => setUserTab((prev) => ({ ...prev, isLoading: true })),
      search: async (query: string) => {
        setUserTab((prev) => ({ ...prev, isLoading: true }));

        const users = query !== ''
          ? await User.find({ query: query })
            .sort({ followersCount: 'desc' })
            .raw()
          : {
            result: [],
            body: {},
          };

        dispatch(User.redux.actions.setMany(users.result));

        setUserTab({
          activeQuery: query,
          isLoading: false,
          ids: users.result.map((user) => user.id),
          isLoadingMore: false,
          offset: 0,
          hasMore: !!users.body.links?.next,
        });
      },
      loadMore: async () => {
        if (!userTab.hasMore || userTab.isLoadingMore) return;

        setUserTab((prev) => ({ ...prev, isLoadingMore: true }));

        const users = await User.find({ query: userTab.activeQuery })
          .sort({ followersCount: 'desc' })
          .offset(userTab.offset + 10)
          .raw();

        dispatch(User.redux.actions.setMany(users.result));

        setUserTab((prev) => ({
          ...prev,
          ids: prev.ids.concat(users.result.map((user) => user.id)),
          isLoadingMore: false,
          offset: prev.offset + 10,
          hasMore: !!users.body.links?.next,
        }));
      },
    },
  };
};
