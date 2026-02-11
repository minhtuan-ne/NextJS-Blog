import CreatePostForm from "@/components/general/CreatePostForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateBlogRoute() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== "phamtranminhtuan2006@gmail.com") {
        redirect("/");
    }

    return (
        <div className="py-10">
            <CreatePostForm />
        </div>
    )
}