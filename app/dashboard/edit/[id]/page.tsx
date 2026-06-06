import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/app/utils/db";
import { notFound, redirect } from "next/navigation";
import EditPostForm from "@/components/general/EditPostForm";

async function getPost(postId: string, userId: string) {
    const data = await prisma.blogPost.findUnique({
        where: {
            id: postId,
        },
        select: {
            id: true,
            title: true,
            content: true,
            imageUrl: true,
            authorId: true,
        }
    });

    if (!data || data.authorId !== userId) {
        return notFound();
    }

    return data;
}

export default async function EditPostRoute({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { getUser, getPermission } = getKindeServerSession();
    const [user, adminPermission] = await Promise.all([getUser(), getPermission("admin:access")]);
    const isAdmin = adminPermission?.isGranted;

    if (!user || !isAdmin) {
        return redirect("/");
    }

    const data = await getPost(id, user.id);

    return (
        <div className="max-w-4xl mx-auto py-10">
            <EditPostForm data={data} />
        </div>
    );
}
