type Props = {
  label: string;
  value: string;
  sub?: React.ReactNode;
};

export default function StatTile({ label, value, sub }: Props) {
  return (
    <div className="tile">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
  );
}
