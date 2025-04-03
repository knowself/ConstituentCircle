import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../lib/convex/api';

interface TableRow {
  [key: string]: any; // Or define specific properties if known
}

export function TableDisplay({ tableName }: { tableName: string }) {
  const tableData = useQuery(api.displayTables.getTableData, { tableName });

  if (!tableData) return React.createElement('div', null, 'Loading...');

  return React.createElement(
    'div',
    null,
    React.createElement('h2', null, `${tableName} Data`),
    React.createElement(
      'table',
      null,
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          Object.keys(tableData.page[0] || {}).map((key) => (
            React.createElement('th', { key }, key)
          ))
        )
      ),
      React.createElement(
        'tbody',
        null,
        tableData.page.map((row: TableRow, index: number) => (
          React.createElement(
            'tr',
            { key: index },
            Object.values(row).map((value, i) => (
              React.createElement('td', { key: i }, String(value))
            ))
          )
        ))
      )
    )
  );
}
