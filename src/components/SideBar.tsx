"use client";

import React, { useEffect, useState, useMemo } from 'react';
import NewdocumentButton from './NewdocumentButton';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from 'lucide-react';
import { collectionGroup, DocumentData, query, where, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useUser } from '@clerk/nextjs';
import { db } from '../../firebase';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";

interface RoomDocument extends DocumentData {
    id: string;
    userId: string;
    roomId: string;
    createdAt: string;
    role: "editor" | "owner";
}

interface GroupedData {
    owner: RoomDocument[];
    editor: RoomDocument[];
}

function SidebarOption({ href, id }: { href: string; id: string }) {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const pathname = usePathname();
    const isActive = href.includes(pathname) && pathname !== "/";

    if (!data) return null;

    return (
        <Link 
            href={href} 
            className={`border p-2 rounded-md mb-3 block hover:bg-gray-100 transition-colors ${
                isActive ? "bg-gray-200 font-bold border-black" : "border-gray-500"
            }`}
        >
            <p className="truncate">{data.title}</p>
        </Link>
    );
}

function DocumentsList({ documents, title }: { documents: RoomDocument[], title: string }) {
    if (documents.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <h2 className="text-gray-500 font-semibold text-sm mb-2">
                {title}
            </h2>
            <div className="flex flex-col gap-1">
                {documents.map((doc) => (
                    <SidebarOption 
                        key={doc.id} 
                        id={doc.roomId} 
                        href={`/doc/${doc.roomId}`}
                    />
                ))}
            </div>
        </div>
    );
}

function MenuOptions({ groupedData }: { groupedData: GroupedData }) {
    return (
        <>
            <NewdocumentButton />
            <div className='flex py-4 flex-col w-full'>
                <DocumentsList 
                    documents={groupedData.owner} 
                    title="My Documents"
                />
                <DocumentsList 
                    documents={groupedData.editor} 
                    title="Shared with me"
                />
            </div>
        </>
    );
}

function SideBar() {
    const { user } = useUser();
    const [groupedData, setGroupedData] = useState<GroupedData>({
        owner: [],
        editor: [],
    });

    const userEmail = user?.emailAddresses[0].toString();
    const queryRef = useMemo(() => {
        if (!userEmail) return null;
        return query(
            collectionGroup(db, "rooms"),
            where("userId", "==", userEmail)
        );
    }, [userEmail]);

    const [data, loading, error] = useCollection(queryRef);

    useEffect(() => {
        if (!data) return;

        const grouped = data.docs.reduce<GroupedData>(
            (acc, curr) => {
                const roomData = { id: curr.id, ...curr.data() } as RoomDocument;
                const category = roomData.role === "owner" ? "owner" : "editor";
                acc[category].push(roomData);
                return acc;
            },
            { owner: [], editor: [] }
        );

        setGroupedData(grouped);
    }, [data]);

    const menuOptions = <MenuOptions groupedData={groupedData} />;

    if (loading) {
        return <div className="p-2 md:p-5 bg-gray-300">Loading...</div>;
    }

    if (error) {
        return <div className="p-2 md:p-5 bg-gray-300">Error: {error.message}</div>;
    }

    return (
        <div className='p-2 md:p-5 bg-gray-300 relative'>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon 
                            className='p-2 hover:opacity-30 rounded-lg' 
                            size={40}
                            aria-label="Open menu"
                        />
                    </SheetTrigger>
                    <SheetContent 
                        className="w-[400px] sm:w-[540px]" 
                        side='left'
                    >
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription>
                                Access your documents and create new ones
                            </SheetDescription>
                            <div>{menuOptions}</div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:inline w-full">
                {menuOptions}
            </div>
        </div>
    );
}

export default SideBar;