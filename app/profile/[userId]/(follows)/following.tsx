import { useLocalSearchParams } from 'expo-router';
import FollowsScreen from '../../../../screens/follows/FollowsScreen';

type Params = {
  userId: string;
};

export default function UserFollowingPage() {
  const params = useLocalSearchParams<Params>();

  return (
    <FollowsScreen type="following" userId={params.userId} />
  );
}
