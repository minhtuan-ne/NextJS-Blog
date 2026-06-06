import CreatePostForm from "@/components/general/CreatePostForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateBlogRoute() {
    const { getUser, getPermission } = getKindeServerSession();
    const [user, adminPermission] = await Promise.all([getUser(), getPermission("admin:access")]);
    const isAdmin = adminPermission?.isGranted;

    if (!user || !isAdmin) {
        redirect("/");
    }

    return (
        <div className="py-10">
            <CreatePostForm />
        </div>
    )
}