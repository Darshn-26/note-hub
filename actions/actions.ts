"use server";

import liveblocks from "@/lib/liveblocks";
import { adminDb } from "../firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
    // Get the auth session
    const { userId, sessionClaims } = await auth();

    // Check if user is authenticated
    if (!userId || !sessionClaims?.email) {
        throw new Error("Please sign in to create a document");
    }

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc",
        userId: userId, // Add userId to the document
        createdAt: new Date()
    });

    await adminDb
        .collection("users")
        .doc(sessionClaims?.email!)
        .collection("rooms")
        .doc(docRef.id)
        .set({
            userId: sessionClaims.email,
            role: "owner",
            createdAt: new Date(),
            roomId: docRef.id
        });

    return { docId: docRef.id };
}

export async function deleteDocument(documentId: string) {
    auth();
    console.log("Deleting Document",documentId);

    try{
        await adminDb.collection("documents").doc(documentId).delete();
        const query=await adminDb
        .collection("users")
        .where("roomId", "==", documentId)
        .get();

        const batch=adminDb.batch();
        //delete all the rooms
        query.docs.forEach((doc)=>{
            batch.delete(doc.ref);
        })

        await batch.commit();
        //delete in live block ! 
        await liveblocks.deleteRoom(documentId);

        return { success: true };
    }catch(error){
        console.error("Error deleting document:", error);
        return { error: "Error deleting document" };
    }
    
}

export async function adduser(roomId:string,email:string) {
    //auth();
    console.log("Adding user",email);

    try{
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .set({
            userId: email,
            role: "editor",
            createdAt: new Date(),
            roomId,
        });
        return { success: true };
    }catch(error){
        console.error("Error adding user:", error);
        return { error: "Error adding user" };
    }
     
}

export async function removeuser(roomId:string,email:string) {
    //auth();
    console.log("Removing user",email);

    try{
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .delete();
        
        return { success: true };
    }catch(error){
        console.error("Error removing user:", error);
        return { error: "Error removing user" };
    }
     
}
