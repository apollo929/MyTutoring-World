export interface IColumns {
  title: string;
  dataIndex: string;
  sorter: boolean;
  sortBy: string;
  render: (data: any, record?: any) => void;
}
