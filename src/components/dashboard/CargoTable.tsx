export default function CargoTable() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <h3 className="font-semibold mb-4">
        Today's Incoming Cargo
      </h3>

      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="text-left">AWB</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t">
            <td>AWB-92841</td>
            <td>Singapore</td>
            <td>Jakarta</td>
            <td className="text-blue-500">In Transit</td>
            <td>14:45</td>
          </tr>

          <tr className="border-t">
            <td>AWB-11932</td>
            <td>Narita</td>
            <td>Surabaya</td>
            <td className="text-orange-500">Pending</td>
            <td>15:12</td>
          </tr>

          <tr className="border-t">
            <td>AWB-88320</td>
            <td>Hong Kong</td>
            <td>Jakarta</td>
            <td className="text-gray-500">Processing</td>
            <td>15:30</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}