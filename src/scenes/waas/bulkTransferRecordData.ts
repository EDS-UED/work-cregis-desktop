export type BulkTransferStatus = 'Success' | 'Transferring' | 'Partial Failed';

export type BulkTransferRecordRow = {
  id: string;
  token: string;
  networkTag: string;
  address: string;
  status: BulkTransferStatus;
  amount: string;
};

export const BULK_TRANSFER_RECORD_ROWS: BulkTransferRecordRow[] = [
  { id: 'bt1', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '4.02' },
  { id: 'bt2', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Success', amount: '8.04' },
  { id: 'bt3', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '2.01' },
  { id: 'bt4', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '2' },
  { id: 'bt5', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Partial Failed', amount: '4.02' },
  { id: 'bt6', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '8.04' },
  { id: 'bt7', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Success', amount: '2.01' },
  { id: 'bt8', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '2' },
  { id: 'bt9', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '4.02' },
  { id: 'bt10', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '8.04' },
  { id: 'bt11', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Success', amount: '2.01' },
  { id: 'bt12', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '2' },
  { id: 'bt13', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Partial Failed', amount: '4.02' },
  { id: 'bt14', token: 'USDT', networkTag: 'TRON#Shasta', address: 'THqk8zz8XHmbL9G6NMWoJns75QX7kP2mYa', status: 'Transferring', amount: '8.04' },
];

export function bulkTransferStatusKind(status: BulkTransferStatus): 'success' | 'warning' | 'danger' {
  if (status === 'Success') return 'success';
  if (status === 'Partial Failed') return 'danger';
  return 'warning';
}
