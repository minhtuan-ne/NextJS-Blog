"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { updatePost } from "@/app/actions";
import { Submitbutton } from "@/components/general/Submitbutton";
import { RichTextEditor } from "./RichTextEditor";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface EditPostFormProps {
    data: {
        id: string;
        title: string;
        content: string;
        imageUrl: string;
    }
}

export default function EditPostForm({ data }: EditPostFormProps) {
    const [content, setContent] = useState(data.content);
    const [title, setTitle] = useState(data.title);
    const [imageUrl, setImageUrl] = useState(data.imageUrl);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await res.json();
            if (uploadData.url) {
                setImageUrl(uploadData.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Post</CardTitle>
                <CardDescription>
                    Update your post details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-8" action={updatePost}>
                    <input type="hidden" name="postId" value={data.id} />
                    <div className="flex flex-col gap-2">
                        <Label className="font-semibold text-lg">Title</Label>
                        <Input 
                            name="title" 
                            required 
                            type="text" 
                            placeholder="A catch title..." 
                            className="text-2xl font-bold py-6"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label className="font-semibold text-lg">Post Cover Image</Label>
                        
                        <input 
                            type="hidden" 
                            name="url" 
                            value={imageUrl} 
                            required
                        />

                        {imageUrl ? (
                            <div className="relative w-full h-[300px] rounded-xl overflow-hidden group border">
                                <Image 
                                    src={imageUrl} 
                                    alt="Cover preview" 
                                    fill 
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => setImageUrl("")}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Remove Image
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-[250px] border-2 border-dashed rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
                                            <p className="text-sm text-zinc-500">Uploading...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3">
                                                <Upload className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                                            </div>
                                            <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-300">
                                                <span className="font-semibold">Click to upload</span> cover image
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Recommended: 1200x630px
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="font-semibold text-lg">Content</Label>
                        <RichTextEditor content={content} onChange={setContent} />
                        <input type="hidden" name="content" value={content} />
                    </div>

                    <Submitbutton />
                </form>
            </CardContent>
        </Card>
    );
}
