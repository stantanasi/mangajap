import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, Episode, EpisodeEntry, Season, User } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  anime: Anime;
  onAnimeChange?: (anime: Anime) => void;
  previousUnwatched: (Season | Episode)[];
  onUpdatingChange: (updating: { [id: string]: boolean }) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function MarkPreviousAsWatchedModal({
  anime,
  onAnimeChange = () => { },
  previousUnwatched,
  onUpdatingChange,
  onRequestClose,
  visible
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const markPreviousAsWatched = async () => {
    if (!user) return

    onUpdatingChange(Object.fromEntries(previousUnwatched!.map((value) => [value.id, true])));

    await Promise.all(previousUnwatched!.map(async (value) => {
      if (value instanceof Episode) {
        let episode = value;

        const episodeEntry = new EpisodeEntry({
          user: new User({ id: user!.id }),
          episode: episode,
        });

        episode = await episodeEntry.save()
          .then((entry) => {
            dispatch(EpisodeEntry.redux.actions.setOne(entry));
            dispatch(Episode.redux.actions.relations['episode-entry'].set(episode.id, entry));

            return episode.copy({ 'episode-entry': entry });
          })
          .catch((err) => {
            console.error(err);
            return episode;
          });

        const season = anime.seasons!.find((season) => season.episodes!.some((e) => e.id === episode.id))!;

        onAnimeChange(anime.copy({
          seasons: anime.seasons?.map((s) => s.id === season.id
            ? s.copy({
              episodes: s.episodes?.map((e) => e.id === episode.id ? episode : e),
            })
            : s),
        }));
        onUpdatingChange({ [episode.id]: false });
      }
    }))
      .catch((err) => console.error(err));
  }

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={styles.container}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        Marquer les épisodes précédents ?
      </Text>

      <Text>
        Voulez-vous marquer les épisodes précédents comme vus ?
      </Text>

      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 16 }}>
        <Text
          onPress={() => {
            onRequestClose();
            markPreviousAsWatched();
          }}
          style={{
            fontWeight: 'bold',
            padding: 10,
          }}
        >
          Oui
        </Text>

        <Text
          onPress={() => onRequestClose()}
          style={{
            padding: 10,
          }}
        >
          Non
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
});
