import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function TableDisplay({ tableName }: { tableName: string }) {
  const tableData = useQuery(api.displayTables.getTableData, { tableName });

  if (!tableData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{tableName} Data</h2>
      <table>
        <thead>
          <tr>
            {Object.keys(tableData.page[0] || {}).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.page.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((value, j) => (
                <td key={j}>{JSON.stringify(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
