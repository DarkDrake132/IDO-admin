import TData from "./TData";

const TRow = ({ data, isHeader, isSelectable, rowNavigate}) => {
  return (
    <tr className={(!isHeader && isSelectable) ? "t-row" : ""} onClick={rowNavigate}>
      {data?.map((item, index) => {
        return (
          <TData key={index} data={item} isHeader={isHeader} />
        );
      })}
    </tr>
  );
};

export default TRow;
