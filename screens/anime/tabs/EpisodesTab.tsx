import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { SectionList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import EpisodeCard from '../../../components/molecules/EpisodeCard';
import ExpandableFloatingActionButton from '../../../components/molecules/ExpandableFloatingActionButton';
import SeasonCard from '../../../components/molecules/SeasonCard';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, Episode, Season } from '../../../models';
import EpisodeModal from '../modals/EpisodeModal';
import MarkPreviousAsWatchedModal from '../modals/MarkPreviousAsWatchedModal';
import SeasonModal from '../modals/SeasonModal';

type Props = {
  anime: Anime;
  style?: StyleProp<ViewStyle>;
}

export default function EpisodesTab({ anime, style }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [expandedSeasons, setExpandedSeasons] = useState<{ [seasonId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});
  const [selectedSeason, setSelectedSeason] = useState<Season>();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>();
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
            onPress={() => setSelectedEpisode(item.copy({ season: season }))}
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
        onWatchedChange={(value) => {
          if (!value) return

          const previousUnwatched = findPreviousSeasonsEpisodes(selectedSeason!)
            .filter((value) => value instanceof Season
              ? value.episodes!.some((e) => !e['episode-entry'])
              : !value['episode-entry']
            );

          if (previousUnwatched.length > 0) {
            setPreviousUnwatched(previousUnwatched);
          }
        }}
        updating={selectedSeason ? updating[selectedSeason.id] : false}
        onUpdatingChange={(value) => setUpdating((prev) => ({
          ...prev,
          [selectedSeason!.id]: value,
          ...selectedSeason!.episodes?.reduce((acc, episode) => {
            acc[episode.id] = value;
            return acc;
          }, {} as typeof updating),
        }))}
        onEpisodeUpdatingChange={(id, value) => setUpdating((prev) => ({ ...prev, [id]: value }))}
        onRequestClose={() => setSelectedSeason(undefined)}
        visible={!!selectedSeason}
      />

      <EpisodeModal
        episode={selectedEpisode}
        onWatchedChange={(value) => {
          if (!value) return

          const previousUnwatched = findPreviousSeasonsEpisodes(selectedEpisode!)
            .filter((value) => value instanceof Season
              ? value.episodes!.some((e) => !e['episode-entry'])
              : !value['episode-entry']
            );

          if (previousUnwatched.length > 0) {
            setPreviousUnwatched(previousUnwatched);
          }
        }}
        updating={selectedEpisode ? updating[selectedEpisode.id] : false}
        onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [selectedEpisode!.id]: value }))}
        onRequestClose={() => setSelectedEpisode(undefined)}
        visible={!!selectedEpisode}
      />

      <MarkPreviousAsWatchedModal
        previousUnwatched={previousUnwatched ?? []}
        onUpdatingChange={(updating) => setUpdating((prev) => ({ ...prev, ...updating }))}
        onRequestClose={() => setPreviousUnwatched(undefined)}
        visible={!!previousUnwatched}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
