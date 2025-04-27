import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Modal, Pressable, SectionList, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import EpisodeCard from '../../../components/molecules/EpisodeCard';
import ExpandableFloatingActionButton from '../../../components/molecules/ExpandableFloatingActionButton';
import SeasonCard from '../../../components/molecules/SeasonCard';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, Episode, EpisodeEntry, Season, User } from '../../../models';
import SeasonModal from '../modals/SeasonModal';

type Props = {
  anime: Anime;
  onAnimeChange: (anime: Anime) => void;
  style?: StyleProp<ViewStyle>;
}

export default function EpisodesTab({ anime, onAnimeChange, style }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [expandedSeasons, setExpandedSeasons] = useState<{ [seasonId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});
  const [selectedSeason, setSelectedSeason] = useState<Season>();
  const [previousUnwatched, setPreviousUnwatched] = useState<(Season | Episode)[]>();

  const findPreviousSeasonsEpisodes = (item: Season | Episode) => {
    const sections = anime.seasons!.map((season) => ({
      season: season,
      data: season.episodes!,
    }));

    const previous: (Season | Episode)[] = [];

    for (const section of sections) {
      if (section.season.id === item.id) {
        return previous;
      }

      for (const episode of section.data) {
        if (episode.id === item.id) {
          return previous;
        }
        previous.push(episode);
      }

      previous.push(section.season);
    }

    return previous;
  };

  return (
    <View style={[styles.container, style]}>
      <SectionList
        sections={anime.seasons!.map((season) => ({
          season: season,
          data: expandedSeasons[season.id] ? season.episodes! : [],
        }))}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { season } }) => (
          <SeasonCard
            season={season}
            onSeasonChange={(season) => {
              onAnimeChange(anime.copy({
                seasons: anime.seasons?.map((s) => s.id === season.id ? season : s),
              }));
            }}
            onWatchedChange={(value) => {
              if (!value) return

              const previousUnwatched = findPreviousSeasonsEpisodes(season)
                .filter((value) => value instanceof Season
                  ? value.episodes!.some((e) => !e['episode-entry'])
                  : !value['episode-entry']
                );

              if (previousUnwatched.length > 0) {
                setPreviousUnwatched(previousUnwatched);
              }
            }}
            updating={updating[season.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({
              ...prev,
              [season.id]: value,
              ...season.episodes?.reduce((acc, episode) => {
                acc[episode.id] = value;
                return acc;
              }, {} as typeof updating),
            }))}
            onEpisodeUpdatingChange={(id, value) => setUpdating((prev) => ({ ...prev, [id]: value }))}
            expanded={expandedSeasons[season.id]}
            onExpandedChange={(value) => setExpandedSeasons((prev) => ({ ...prev, [season.id]: value }))}
            onPress={() => setSelectedSeason(season)}
            style={{
              marginTop: 5,
              marginHorizontal: 16,
            }}
          />
        )}
        renderSectionFooter={() => <View style={{ height: 5 }} />}
        renderItem={({ item, section: { season } }) => (
          <EpisodeCard
            episode={item}
            onEpisodeChange={(episode) => {
              onAnimeChange(anime.copy({
                seasons: anime.seasons?.map((s) => s.id === season.id
                  ? season.copy({
                    episodes: season.episodes?.map((e) => e.id === episode.id ? episode : e),
                  })
                  : s),
              }));
            }}
            onWatchedChange={(value) => {
              if (!value) return

              const previousUnwatched = findPreviousSeasonsEpisodes(item)
                .filter((value) => value instanceof Season
                  ? value.episodes!.some((e) => !e['episode-entry'])
                  : !value['episode-entry']
                );

              if (previousUnwatched.length > 0) {
                setPreviousUnwatched(previousUnwatched);
              }
            }}
            updating={updating[item.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [item.id]: value }))}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        removeClippedSubviews
        contentContainerStyle={{
          paddingVertical: 11,
        }}
      />

      {user && user.isAdmin ? (
        <ExpandableFloatingActionButton
          icon="add"
          menuItems={[
            {
              icon: 'library-add',
              label: 'Saison',
              onPress: () => navigation.navigate('SeasonCreate', { animeId: anime.id }),
            },
            {
              icon: 'library-add',
              label: 'Épisode',
              onPress: () => navigation.navigate('EpisodeCreate', { animeId: anime.id }),
            },
          ]}
        />
      ) : null}

      <SeasonModal
        season={selectedSeason}
        onRequestClose={() => setSelectedSeason(undefined)}
        visible={!!selectedSeason}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setPreviousUnwatched(undefined)}
        transparent
        visible={!!previousUnwatched}
      >
        <Pressable
          onPress={() => setPreviousUnwatched(undefined)}
          style={{
            alignItems: 'center',
            backgroundColor: '#00000052',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Pressable
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 4,
              padding: 16,
              gap: 12,
            }}
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
                  setUpdating((prev) => ({
                    ...prev,
                    ...Object.fromEntries(previousUnwatched!.map((value) => [value.id, true])),
                  }));

                  Promise.all(previousUnwatched!.map(async (value) => {
                    if (value instanceof Episode) {
                      let episode = value;

                      const episodeEntry = new EpisodeEntry({
                        user: new User({ id: user!.id }),
                        episode: episode,
                      });

                      episode = await episodeEntry.save()
                        .then((entry) => episode.copy({ 'episode-entry': entry }))
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
                      setUpdating((prev) => ({ ...prev, [episode.id]: false }));
                    }
                  }))
                    .catch((err) => console.error(err))
                    .finally(() => setUpdating((prev) => ({
                      ...prev,
                      ...Object.fromEntries(previousUnwatched!.map((value) => [value.id, false])),
                    })));

                  setPreviousUnwatched(undefined);
                }}
                style={{
                  fontWeight: 'bold',
                  padding: 10,
                }}
              >
                Oui
              </Text>

              <Text
                onPress={() => setPreviousUnwatched(undefined)}
                style={{
                  padding: 10,
                }}
              >
                Non
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
