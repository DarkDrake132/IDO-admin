import Card from "../Card/Card";
import THeader from "./THeader";
import TBody from "./TBody";
import Spinner from "../ui/Spinner/Spinner"
import TData from "./TData";
import TRow from "./TRow";


const Table = ({title, description, topRightElement, header, body, loading, isSelectable = true, rowNavigate = () => {}}) => {
  return (
    <Card title={title} description={description} topRightElement={topRightElement}>
      <div className="table-responsive">
        <table className="table">
          <THeader header={header} />
          {!loading && (
            <TBody body={body} loading={loading} isSelectable={isSelectable} rowNavigate={rowNavigate}/>
          )}
        </table>
        {
          loading 
          ? <div className="text-center my-3"><Spinner /></div> 
          : body.length === 0 && <p className="text-center">Table is empty !</p>
        }
      </div>
    </Card>
  );
};

export default Table;