import TRow from "./TRow";

const TBody = ({ body, isSelectable, rowNavigate }) => {
  return (
    <tbody>
      {body?.map((row, index) => {
        return (
          <TRow 
            key={index} 
            isSelectable={isSelectable} 
            data={Object.entries(row)} 
            rowNavigate={ e => rowNavigate(e, row.id)}
          />
        )
      })}
    </tbody>
  );
};

export default TBody;
