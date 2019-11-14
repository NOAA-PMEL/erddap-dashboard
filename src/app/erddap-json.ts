export interface ErddapJson {
  table: Table;
}

interface Table {
  columnNames: string[];
  columnTypes: string[];
  columnUnits: (null | string)[];
  rows: any[][];
  // rows: (number | string)[][];
}
