import { getCurrentUser, getNullLength, getUserData, downloadFileFromPublicUrl } from '@/backend/formServices';
import { SidebarDashboard } from './SidebarDashboard';

export default async function Registration() {
    const user = await getCurrentUser();
    const progress = await getNullLength();
    const data = await getUserData();

    data.cvFile = data.cv_url ? await downloadFileFromPublicUrl(data.cv_url) : null;
    data.photoFile = data.foto_url ? await downloadFileFromPublicUrl(data.foto_url) : null;

    return <SidebarDashboard user={user} progress={progress} data={data} />;
}