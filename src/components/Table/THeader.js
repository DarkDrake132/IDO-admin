import TRow from "./TRow";

const THeader = ({ header }) => {
  return (
    <thead>
      <TRow data={header} isHeader={true} />
    </thead>
  );
};

export default THeader;
