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
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>();
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>();
  const [previousUnwatched, setPreviousUnwatched] = useState<(Season | Episode)[]>();

  const findPreviousSeasonsEpisodes = (item: Season | Episode) => {
    const sections = [
      ...anime.seasons!.filter((s) => s.number !== 0),
      ...anime.seasons!.filter((s) => s.number === 0),
    ].map((season) => ({
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
        sections={[
          ...anime.seasons!.filter((s) => s.number !== 0),
          ...anime.seasons!.filter((s) => s.number === 0),
        ].map((season) => ({
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
            onPress={() => setSelectedSeasonId(season.id)}
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
            onPress={() => setSelectedEpisodeId(item.id)}
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
        season={anime.seasons?.find((season) => season.id === selectedSeasonId)}
        onWatchedChange={(value) => {
          if (!value) return

          const selectedSeason = anime.seasons?.find((season) => season.id === selectedSeasonId);
          if (!selectedSeason) return

          const previousUnwatched = findPreviousSeasonsEpisodes(selectedSeason)
            .filter((value) => value instanceof Season
              ? value.episodes!.some((e) => !e['episode-entry'])
              : !value['episode-entry']
            );

          if (previousUnwatched.length > 0) {
            setPreviousUnwatched(previousUnwatched);
          }
        }}
        updating={selectedSeasonId ? updating[selectedSeasonId] : false}
        onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [selectedSeasonId!]: value }))}
        onEpisodeUpdatingChange={(id, value) => setUpdating((prev) => ({ ...prev, [id]: value }))}
        onRequestClose={() => setSelectedSeasonId(undefined)}
        visible={!!selectedSeasonId}
      />

      <EpisodeModal
        episode={(() => {
          for (const season of anime.seasons ?? []) {
            for (const episode of season.episodes ?? []) {
              if (episode.id === selectedEpisodeId) {
                return episode.copy({ season: season });
              }
            }
          }
        })()}
      onWatchedChange={(value) => {
        if (!value) return

        const selectedEpisode = anime.seasons
          ?.flatMap((season) => season.episodes ?? [])
          .find((episode) => episode.id === selectedEpisodeId);
        if (!selectedEpisode) return

        const previousUnwatched = findPreviousSeasonsEpisodes(selectedEpisode)
          .filter((value) => value instanceof Season
            ? value.episodes!.some((e) => !e['episode-entry'])
            : !value['episode-entry']
          );

        if (previousUnwatched.length > 0) {
          setPreviousUnwatched(previousUnwatched);
        }
      }}
      updating={selectedEpisodeId ? updating[selectedEpisodeId] : false}
      onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [selectedEpisodeId!]: value }))}
      onRequestClose={() => setSelectedEpisodeId(undefined)}
      visible={!!selectedEpisodeId}
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
