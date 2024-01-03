export function unparseToCsvString(data: any[]): string {
  if (data.length === 0) {
    return '';
  }

  // Extract headers
  const headers = data[0];
  const content = data.slice(1);

  // Build CSV string
  const csvRows = [
    headers.join(','),
    ...content.map((row) =>
      row.map((value: string) => (typeof value === 'string' && value.includes(',') ? `"${value}"` : value)).join(',')
    )
  ];

  return csvRows.join('\n');
}
