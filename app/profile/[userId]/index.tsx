import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { User } from '../../../models';
import { useAppSelector } from '../../../redux/store';
import ProfileScreen from '../../../screens/profile/ProfileScreen';

type Params = {
  userId: string;
};

export default function ProfilePage() {
  const params = useLocalSearchParams<Params>();
  const user = useAppSelector((state) => {
    return User.redux.selectors.selectById(state, params.userId);
  });

  return (
    <>
      <Head>
        <title>{user && `${user.name} (@${user.pseudo}) - Profil | MangaJap`}</title>
      </Head>

      <ProfileScreen userId={params.userId} />
    </>
  );
}
