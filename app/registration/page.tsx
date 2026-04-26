import { getCurrentUser, getNullLength, getUserData } from '@/backend/formServices';
import { Registration } from '@/components/Registration';

async function Page() {
  const [user, progress, data] = await Promise.all([
    getCurrentUser(),
    getNullLength(),
    getUserData(),
  ]);

  return <Registration user={user} progress={progress} data={data} />;
}

export default Page;