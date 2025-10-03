"use client";

import { useOptimistic } from "react";
import { BookingType } from "../_types/bookingType";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "../_lib/actions";

interface ReservationListProps {
  bookings: Omit<BookingType, "observations">[];
}

const ReservationList: React.FC<ReservationListProps> = ({ bookings }) => {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currBookings, bookingId) => {
      return currBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  const handleDelete = async (bookingId: BookingType["id"]) => {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  };

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
