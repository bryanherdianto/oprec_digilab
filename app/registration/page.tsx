import {
	getCurrentUser,
	getNullLength,
	getUserData,
} from "@/backend/formServices";
import { Registration } from "@/components/Registration";
import { redirect } from "next/navigation";

async function Page() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login");
	}

	const [progress, data] = await Promise.all([getNullLength(), getUserData()]);

	return <Registration user={user} progress={progress} data={data} />;
}

export default Page;
