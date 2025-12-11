"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const db = prisma as any;

export async function handleSubmission(formData: FormData) {
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/register")
    }

    const title = formData.get('title');
    const content = formData.get('content');
    const url = formData.get('url');

    await prisma.blogPost.create({
    data: {
        title: title as string,
        content: content as string,
        imageUrl: url as string,
        authorId: user.id as string,
        authorImage: user.picture as string,
        authorName: user.given_name as string,
    },
   });

   return redirect("/dashboard")

}

export async function toggleLike(postId: string) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/register");
    }

    const existing = await db.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId: user.id,
            },
        },
    });

    if (existing) {
        await db.like.delete({ where: { id: existing.id } });
    } else {
        await db.like.create({
            data: {
                postId,
                userId: user.id,
            },
        });
    }

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
    revalidatePath("/dashboard");
}

export async function addComment(formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect("/api/auth/register");
    }

    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;
    const parentId = formData.get("parentId") as string | null;

    if (!postId || !content?.trim()) {
        throw new Error("Post and content are required");
    }

    if (parentId) {
        const parent = await db.comment.findUnique({
            where: { id: parentId },
            select: { postId: true },
        });

        if (!parent || parent.postId !== postId) {
            throw new Error("Invalid parent comment");
        }
    }

    await db.comment.create({
        data: {
            postId,
            userId: user.id,
            userName: user.given_name ?? user.email ?? "Anonymous",
            userImage: user.picture ?? "",
            content: content.trim(),
            parentId: parentId || undefined,
        },
    });

    revalidatePath(`/post/${postId}`);
    revalidatePath("/");
}