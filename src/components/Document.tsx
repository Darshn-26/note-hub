"use client";

import React, { FormEvent, useState, useEffect, useTransition } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUsers from './ManageUsers';
import Avatars from './Avatars';
import { toast } from 'sonner';
import GenAI from './GenAI';

interface RoomUser {
    email: string;
    userId: string;
    roomId: string;
}

function Document({ id }: { id: string }) {
    const [input, setInput] = useState("");
    const [isPending, startTransition] = useTransition();
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
    const isOwner = useOwner();

    useEffect(() => {
        const q = query(
            collection(db, "users"),
            where("roomId", "==", id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users: RoomUser[] = [];
            snapshot.forEach((doc) => {
                users.push(doc.data() as RoomUser);
            });
            setRoomUsers(users);
        });

        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        if (data) {
            setInput(data.title);
        }
    }, [data]);

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Current room users:', roomUsers);
        }
    }, [roomUsers]);

    const updateTitle = async (e: FormEvent) => {
        e.preventDefault();
        
        if (input.trim()) {
            startTransition(() => {
                updateDoc(doc(db, "documents", id), {
                    title: input,
                })
                .then(() => {
                    toast.success('Title Updated', {
                        position: 'top-center',
                        duration: 3000,
                        style: {
                            background: '#22c55e',
                            color: '#ffffff',
                            border: 'none'
                        },
                    });
                })
                .catch(error => {
                    console.error("Error updating document:", error);
                    toast.error('Update Failed', {
                        description: 'Failed to update document title',
                        position: 'top-center',
                        duration: 5000,
                    });
                });
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='bg-white flex-1 h-full p-5'>
            <div className="flex max-w-6xl mx-auto justify-between pb-5">
                <form className='flex flex-1 space-x-2' onSubmit={updateTitle}>
                    <Input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <Button disabled={isPending} type="submit">
                        {isPending ? "Updating..." : "Update"}
                    </Button>

                    {isOwner && (
                        <>
                            <InviteUser/>
                            <DeleteDocument/>
                        </>
                    )}
                </form>
            </div>

            <div className='flex max-w-6xl mx-auto items-center gap-2 justify-between mb-5'>
                <ManageUsers/>
                <Avatars/>
            </div>

            <hr className='pb-10 my-2' />

            <Editor />
            <GenAI/>
        </div>
    );
}

export default Document;