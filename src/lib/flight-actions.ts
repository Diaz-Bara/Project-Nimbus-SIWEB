"use server";

import { sql } from "./actions";
import { revalidatePath } from "next/cache";

export async function saveFlight(data: {
  code: string;
  aircraft: string;
  origin_code: string;
  origin_city: string;
  destination_code: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  capacity_tons: number;
}, id?: number) {
  try {
    if (id) {
      await sql`
        UPDATE flights SET
          code = ${data.code},
          aircraft = ${data.aircraft},
          origin_code = ${data.origin_code},
          origin_city = ${data.origin_city},
          destination_code = ${data.destination_code},
          destination_city = ${data.destination_city},
          departure_time = ${data.departure_time}::TIME,
          arrival_time = ${data.arrival_time}::TIME,
          status = ${data.status},
          capacity_tons = ${data.capacity_tons},
          updated_at = NOW()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO flights (code, aircraft, origin_code, origin_city, destination_code, destination_city, departure_time, arrival_time, status, capacity_tons, used_tons)
        VALUES (${data.code}, ${data.aircraft}, ${data.origin_code}, ${data.origin_city}, ${data.destination_code}, ${data.destination_city}, ${data.departure_time}::TIME, ${data.arrival_time}::TIME, ${data.status}, ${data.capacity_tons}, 0)
      `;
    }
    revalidatePath("/flights");
    return { success: true };
  } catch (error) {
    console.error("Save flight error:", error);
    return { success: false, error: "Failed to save flight. Check if flight code already exists." };
  }
}

export async function deleteFlightAction(id: number) {
  try {
    await sql`DELETE FROM flights WHERE id = ${id}`;
    revalidatePath("/flights");
    return { success: true };
  } catch (error) {
    console.error("Delete flight error:", error);
    return { success: false, error: "Failed to delete flight." };
  }
}
