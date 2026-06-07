import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function GET() {
  try {
    const result = await sql.begin(async (sql) => {
      // DROP TABLE LAMA
      await sql`DROP TABLE IF EXISTS tracking_logs, shipment_items, shipment_details, shipments, items, flights, customers, users CASCADE`;

      // ================= 1. MASTER: USERS =================
      await sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          email TEXT UNIQUE,
          password TEXT,
          role TEXT,
          emp_id TEXT,
          terminal TEXT,
          status TEXT DEFAULT 'ACTIVE',
          verified BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      const usersData = [
        { name: "Boas Salosa", email: "op1@nimbus.cargo", empId: "ADM-99210", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "12 minutes" },
        { name: "Jay Idzes", email: "op2@nimbus.cargo", empId: "ADM-88432", role: "ADMIN", terminal: "CGK-Main", status: "ACTIVE", verified: true, lastLogin: "2 hours" },
        { name: "Bambang Pamungkas", email: "op3@nimbus.cargo", empId: "OPR-77001", role: "OPERATOR", terminal: "DPS-Terminal", status: "INACTIVE", verified: false, lastLogin: "3 days" },
        { name: "Justin Hubner", email: "op4@nimbus.cargo", empId: "OPR-88544", role: "OPERATOR", terminal: "KNO-Gateway", status: "ACTIVE", verified: true, lastLogin: "5 minutes" },
        { name: "Ayu Kartika", email: "op5@nimbus.cargo", empId: "OPR-92184", role: "OPERATOR", terminal: "SUB-Terminal", status: "ACTIVE", verified: true, lastLogin: "28 minutes" },
        { name: "Raka Pratama", email: "op6@nimbus.cargo", empId: "ADM-11872", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "47 minutes" },
        { name: "Maya Santoso", email: "op7@nimbus.cargo", empId: "OPR-45821", role: "OPERATOR", terminal: "CGK-Cargo", status: "ACTIVE", verified: true, lastLogin: "1 hour" },
        { name: "Fajar Akbar", email: "op8@nimbus.cargo", empId: "OPR-61339", role: "OPERATOR", terminal: "BDO-Gateway", status: "ACTIVE", verified: true, lastLogin: "4 hours" },
        { name: "Nadia Putri", email: "op9@nimbus.cargo", empId: "OPR-50218", role: "OPERATOR", terminal: "MES-Station", status: "INACTIVE", verified: false, lastLogin: "5 days" },
        { name: "Dimas Surya", email: "op10@nimbus.cargo", empId: "ADM-34980", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "6 hours" },
        { name: "Lina Kartika", email: "op11@nimbus.cargo", empId: "OPR-73042", role: "OPERATOR", terminal: "CGK-Main", status: "ACTIVE", verified: true, lastLogin: "8 hours" },
        { name: "Seno Wibowo", email: "op12@nimbus.cargo", empId: "OPR-64127", role: "OPERATOR", terminal: "DPS-Terminal", status: "ACTIVE", verified: true, lastLogin: "9 hours" },
        { name: "Clara Wijaya", email: "op13@nimbus.cargo", empId: "ADM-27091", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "11 hours" },
        { name: "Yusuf Hadi", email: "op14@nimbus.cargo", empId: "OPR-87420", role: "OPERATOR", terminal: "KNO-Gateway", status: "ACTIVE", verified: true, lastLogin: "1 day" },
        { name: "Rani Amelia", email: "op15@nimbus.cargo", empId: "OPR-39514", role: "OPERATOR", terminal: "SUB-Terminal", status: "ACTIVE", verified: false, lastLogin: "1 day" },
        { name: "Kevin Sanjaya", email: "op16@nimbus.cargo", empId: "OPR-55418", role: "OPERATOR", terminal: "CGK-Cargo", status: "INACTIVE", verified: false, lastLogin: "8 days" },
        { name: "Siti Rahma", email: "op17@nimbus.cargo", empId: "OPR-20773", role: "OPERATOR", terminal: "BDO-Gateway", status: "ACTIVE", verified: true, lastLogin: "2 days" },
        { name: "Andi Wijaya", email: "op18@nimbus.cargo", empId: "ADM-77845", role: "ADMIN", terminal: "Global Access", status: "ACTIVE", verified: true, lastLogin: "2 days" },
        { name: "Dewi Lestari", email: "op19@nimbus.cargo", empId: "OPR-69034", role: "OPERATOR", terminal: "MES-Station", status: "ACTIVE", verified: true, lastLogin: "3 days" },
        { name: "Hendra Gunawan", email: "op20@nimbus.cargo", empId: "OPR-81163", role: "OPERATOR", terminal: "CGK-Main", status: "ACTIVE", verified: true, lastLogin: "4 days" },
      ].map((user) => ({
        ...user,
        password: "password123",
      }));

      for (const u of usersData) {
        const hash = await bcrypt.hash(u.password, 10);
        await sql`
          INSERT INTO users (name, email, password, role, emp_id, terminal, status, verified, last_login)
          VALUES (${u.name}, ${u.email}, ${hash}, ${u.role}, ${u.empId}, ${u.terminal}, ${u.status}, ${u.verified}, NOW() - (${u.lastLogin})::interval)
        `;
      }

      // ================= 2. MASTER: CUSTOMERS =================
      await sql`
        CREATE TABLE customers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          company TEXT
        );
      `;
      const customersData = [
        { name: "Andi Wijaya", company: "PT Tech Corp" },
        { name: "Siti Rahma", company: "CV Logistik Jaya" },
        { name: "Budi Sentosa", company: "PT Budi Sentosa Utama" },
        { name: "Dewi Lestari", company: "PT Global Impor" },
        { name: "Faisal Akbar", company: "Toko Maju" },
        { name: "Rina Melati", company: "Koperasi Makmur" },
        { name: "Hendra Gunawan", company: "PT Ekspor Cepat" },
        { name: "Maya Sari", company: "Sinar Mas" },
        { name: "Tono Supriatna", company: "Indo Trading" },
        { name: "Kevin Sanjaya", company: "PT Karya Anak Bangsa" }
      ];

      for (const cust of customersData) {
        await sql`INSERT INTO customers (name, company) VALUES (${cust.name}, ${cust.company})`;
      }

      // ================= 3. MASTER: FLIGHTS (KEMBALI KE STRUKTUR AWAL) =================
      await sql`
        CREATE TABLE flights (
          id SERIAL PRIMARY KEY,
          code TEXT UNIQUE,
          status TEXT
        );
      `;
      const flights = ["PT-882", "PT-914", "PT-115", "PT-552", "PT-771", "PT-330", "PT-999", "PT-202", "PT-404", "PT-505"];
      for (const code of flights) {
        await sql`INSERT INTO flights (code, status) VALUES (${code}, 'ACTIVE')`;
      }

      // ================= 4. MASTER: ITEMS =================
      await sql`
        CREATE TABLE items (
          id SERIAL PRIMARY KEY,
          name TEXT,
          category TEXT
        );
      `;
      const items = ["Elektronik", "Pakaian", "Makanan Kering", "Obat-obatan", "Dokumen", "Suku Cadang Mesin", "Kosmetik", "Mainan Anak", "Perabotan", "Bahan Kimia Aman"];
      for (const item of items) {
        await sql`INSERT INTO items (name, category) VALUES (${item}, 'General Cargo')`;
      }

      // ================= 5. TRANSAKSI: SHIPMENTS (DITAMBAH 3 KRITERIA BARU) =================
      // Menambahkan: shipping_date, service_level, description
      await sql`
        CREATE TABLE shipments (
          id SERIAL PRIMARY KEY,
          awb TEXT UNIQUE,
          customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
          flight_id INT REFERENCES flights(id) ON DELETE CASCADE,
          sender_name TEXT,
          weight INT,
          pieces INT,
          price INT,
          status TEXT,
          shipping_date DATE,
          service_level TEXT,
          description TEXT,
          item_type TEXT,
          vehicle_type TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      const awbs = ["AWB-001", "AWB-002", "AWB-003", "AWB-004", "AWB-005", "AWB-006", "AWB-007", "AWB-008", "AWB-009", "AWB-010"];
      const weights = [120, 450, 80, 1500, 310, 620, 95, 1100, 240, 500];
      const prices = [1500000, 4200000, 900000, 12500000, 3200000, 5800000, 1100000, 9800000, 2100000, 4500000];
      const senders = ["Raka Pratama", "Maya Santoso", "Nadia Putri", "Fajar Akbar", "Dimas Surya", "Lina Kartika", "Seno Wibowo", "Clara Wijaya", "Yusuf Hadi", "Rani Amelia"];
      const itemTypes = ["Dokumen", "Elektronik", "Pakaian", "Suku Cadang Mesin", "Kosmetik", "Makanan Kering", "Obat-obatan", "Mainan Anak", "Perabotan", "Bahan Kimia Aman"];

      for (let i = 0; i < 10; i++) {
        const custId = i < 3 ? 1 : i + 1; 
        const flightId = i + 1;
        
        // Data dummy untuk 3 kolom baru
        const tglKirim = `2026-05-${String(i + 1).padStart(2, '0')}`;
        const serviceLvl = i % 2 === 0 ? 'Express Priority' : 'Standard Cargo';
        const desc = `Barang kargo batch ${i + 1} dalam kondisi baik.`;

        await sql`
          INSERT INTO shipments (
            awb,
            customer_id,
            flight_id,
            sender_name,
            weight,
            pieces,
            price,
            status,
            shipping_date,
            service_level,
            description,
            item_type,
            vehicle_type
          ) 
          VALUES (
            ${awbs[i]},
            ${custId},
            ${flightId},
            ${senders[i]},
            ${weights[i]},
            ${i + 1},
            ${prices[i]},
            'In Transit',
            ${tglKirim},
            ${serviceLvl},
            ${desc},
            ${itemTypes[i]},
            'Air Cargo'
          )
        `;
      }

      // ================= 6. DETAIL TRANSAKSI: SHIPMENT_DETAILS (DITAMBAH 1 KRITERIA BARU) =================
      // Menambahkan: phone_number
      await sql`
        CREATE TABLE shipment_details (
          id SERIAL PRIMARY KEY,
          shipment_id INT UNIQUE REFERENCES shipments(id) ON DELETE CASCADE, 
          origin TEXT,
          destination TEXT,
          recipient_name TEXT,
          phone_number TEXT
        );
      `;
      for (let i = 1; i <= 10; i++) {
        const namaPenerima = `Penerima ${i}`;
        const noTelp = `0812345678${i.toString().padStart(2, '0')}`;
        
        await sql`INSERT INTO shipment_details (shipment_id, origin, destination, recipient_name, phone_number) VALUES (${i}, 'Jakarta', 'Singapore', ${namaPenerima}, ${noTelp})`;
      }

      // ================= 7. JUNCTION TABLE: SHIPMENT_ITEMS =================
      await sql`
        CREATE TABLE shipment_items (
          shipment_id INT REFERENCES shipments(id) ON DELETE CASCADE,
          item_id INT REFERENCES items(id) ON DELETE CASCADE,
          quantity INT,
          PRIMARY KEY (shipment_id, item_id)
        );
      `;
      const junctionData = [
        [1, 1], [1, 2], [1, 3],
        [2, 1], [2, 4],
        [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10], [9, 1], [10, 2]
      ];
      for (const data of junctionData) {
        await sql`INSERT INTO shipment_items (shipment_id, item_id, quantity) VALUES (${data[0]}, ${data[1]}, 10)`;
      }

      await sql`
        CREATE TABLE tracking_logs (
          id SERIAL PRIMARY KEY,
          shipment_id INT REFERENCES shipments(id) ON DELETE CASCADE,
          status TEXT NOT NULL,
          location TEXT,
          note TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;

      for (let i = 1; i <= 10; i++) {
        await sql`
          INSERT INTO tracking_logs (shipment_id, status, location, note, created_at)
          VALUES (${i}, 'Received', 'Jakarta', 'Cargo received at origin hub', NOW() - INTERVAL '3 hours')
        `;
        await sql`
          INSERT INTO tracking_logs (shipment_id, status, location, note, created_at)
          VALUES (${i}, 'Sortation', 'CGK Hub', 'Cargo processed through sorting facility', NOW() - INTERVAL '2 hours')
        `;
        await sql`
          INSERT INTO tracking_logs (shipment_id, status, location, note, created_at)
          VALUES (${i}, 'In Transit', 'Air Network', 'Cargo is currently in transit', NOW() - INTERVAL '1 hour')
        `;
      }

    });

    return Response.json({ message: "Database seeded successfully! 4 Kriteria Tambahan (Tanpa detail kendaraan) berhasil ditambahkan 🚀" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Seeding failed ❌" }, { status: 500 });
  }
}
