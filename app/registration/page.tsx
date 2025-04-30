import { getCurrentUser, getNullLength, getUserData } from '@/backend/formServices';
import { Registration } from '@/components/Registration';

async function Page() {
  const user = await getCurrentUser();
  const progress = await getNullLength();
  const data = await getUserData();

  return <Registration user={user} progress={progress} data={data} />;
}

export default Page;