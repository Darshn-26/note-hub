import {User}from "./types/types";

declare global{
    interface CustomJwtSessionClaims extends User{}
}