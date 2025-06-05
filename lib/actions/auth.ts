"use server";
import dbConnect from "@/database/dbConnect";
import { UserModel } from "@/database/schemas/UserSchema";
import { hash } from "bcryptjs";
import { signIn, signOut, useSession } from "next-auth/react";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">,
) => {
    const {email , password} = params;
    try {
       
        const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
        

        const {success} = await ratelimit.limit(ip);
        if(!success){
            redirect("/to-fast");
        }
        const result = await signIn("credentials" , {
            email,
            password,
            redirect: false,
        })
        if(result?.error){
            return {
                success: false,
                error: result.error,
            }
        } 
        return {
            success: true
        }
    }catch(error){
        console.log(error , "SignIn error");
        return {
            success: false,
            error: "Signin error"
        }
    }
}


export const signUp = async(params: AuthCredentials) => {
   const {fullName , email , universityId , password , universityCard} = params

   try {
       await dbConnect();
       const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
       const { success } = await ratelimit.limit(ip);
     
       if (!success) return redirect("/too-fast");
     
      
       const existingUser = await UserModel.findOne({email: email});

       if(existingUser){
        return {
            success: false,
            error: "User already exists"
        }
       }     
       const hashPassword = await hash(password,10);
       const newUser  = await UserModel.create({
        email, 
        password: hashPassword,
        universityId,
        fullName,
        universityCard,
       })
       await signInWithCredentials({email,password});
       return {
        success: true
       }
   } catch (error) {
       console.log(error,"SignUp error");
       return {
        success: false,
        error: "Signup error"
       }
   }
}