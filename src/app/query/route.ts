import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getRelationalShipments() {
  const data = await sql`
    SELECT 
      s.awb AS "Nomor Resi",
      c.name AS "Nama Pelanggan",
      f.code AS "Penerbangan",
      sd.origin AS "Asal",
      sd.destination AS "Tujuan",
      s.weight AS "Berat (kg)",
      s.price AS "Harga (Rp)",
      STRING_AGG(i.name, ', ') AS "Daftar Barang (M:M)"
    FROM shipments s
    JOIN customers c ON s.customer_id = c.id
    JOIN flights f ON s.flight_id = f.id
    JOIN shipment_details sd ON s.id = sd.shipment_id
    JOIN shipment_items si ON s.id = si.shipment_id
    JOIN items i ON si.item_id = i.id
    GROUP BY s.awb, c.name, f.code, sd.origin, sd.destination, s.weight, s.price
    ORDER BY s.awb ASC;
  `;
  return data;
}

export async function GET() {
  try {
    return Response.json(await getRelationalShipments());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

