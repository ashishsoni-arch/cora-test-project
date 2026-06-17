export type ReportStatus = 'pending' | 'completed' | 'review';

const statusClasses: Record<ReportStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  review: 'bg-sky-100 text-sky-700',
};

interface StatusChipProps {
  status: ReportStatus;
}

const StatusChip = ({ status }: StatusChipProps) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}
  >
    {status}
  </span>
);

export default StatusChip;
