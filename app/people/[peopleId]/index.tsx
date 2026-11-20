import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { People } from '../../../models';
import { useAppSelector } from '../../../redux/store';
import PeopleScreen from '../../../screens/people/PeopleScreen';

type Params = {
  peopleId: string;
};

export default function PeoplePage() {
  const params = useLocalSearchParams<Params>();
  const people = useAppSelector((state) => {
    return People.redux.selectors.selectById(state, params.peopleId);
  });

  return (
    <>
      <Head>
        <title>{people && `${people.name} - Personnalité | MangaJap`}</title>
      </Head>

      <PeopleScreen peopleId={params.peopleId} />
    </>
  );
}