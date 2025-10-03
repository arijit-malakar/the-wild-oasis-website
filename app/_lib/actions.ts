"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

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

export const createBooking = async (
  bookingData: Record<string, number | Date | undefined>,
  formData: FormData
) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
};

export const updateBooking = async (formData: FormData) => {
  const bookingId = Number(formData.get("bookingId"));

  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated");

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
};

export const deleteBooking = async (bookingId: number) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBokings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBokings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
};

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
