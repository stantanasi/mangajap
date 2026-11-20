import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../guards/AuthGuard';
import { People } from '../../../models';
import { useAppSelector } from '../../../redux/store';
import PeopleSaveScreen from '../../../screens/people-save/PeopleSaveScreen';

type Params = {
  peopleId: string;
};

export default function PeopleUpdatePage() {
  const params = useLocalSearchParams<Params>();
  const people = useAppSelector((state) => {
    return People.redux.selectors.selectById(state, params.peopleId);
  });

  return (
    <AuthGuard>
      <Head>
        <title>{people && `Modifier - ${people.name} - Personnalité | MangaJap`}</title>
      </Head>

      <PeopleSaveScreen peopleId={params.peopleId} />
    </AuthGuard>
  );
}
