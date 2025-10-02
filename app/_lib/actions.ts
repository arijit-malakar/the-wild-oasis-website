"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export const updateProfile = async (formData: FormData) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const nationalityData = formData.get("nationality");

  if (typeof nationalID === "string" && typeof nationalityData === "string") {
    const [nationality, countryFlag] = nationalityData.split("%");

    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
      throw new Error("Please provide a valid national ID");

    const updateData = { nationality, countryFlag, nationalID };

    const { error } = await supabase
      .from("guests")
      .update(updateData)
      .eq("id", session.user.guestId)
      .select()
      .single();

    if (error) throw new Error("Guest could not be updated");

    revalidatePath("/account/profile");
  }
};

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
