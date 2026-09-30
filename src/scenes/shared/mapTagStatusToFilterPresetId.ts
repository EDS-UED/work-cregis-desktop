/** EgStatusTag status → EgFilter status preset id（与 eds filterStatusPresets 对齐）。 */
export function mapTagStatusToFilterPresetId(status: string): string {
  switch (status) {
    case 'ready':
      return 'status-waiting';
    case 'warning':
      return 'status-in-progress';
    case 'danger':
      return 'status-error-warning';
    case 'success':
      return 'status-success-done';
    case 'invalid':
      return 'status-canceled-invalid';
    default:
      return 'status-waiting';
  }
}
