import { statusLabels } from '../../utils/format';

export default function Badge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {statusLabels[status] || status}
    </span>
  );
}
