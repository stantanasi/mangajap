import { useLocalSearchParams } from 'expo-router';
import FollowsScreen from '../../../../screens/follows/FollowsScreen';

type Params = {
  userId: string;
};

export default function UserFollowersPage() {
  const params = useLocalSearchParams<Params>();

  return (
    <FollowsScreen type="followers" userId={params.userId} />
  );
}
