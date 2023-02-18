import { useState } from "react";
import { type YTQueryType } from "../types/YTQueryType";

export const QueryTypeSelector: React.FC<{
  ytQueryTypeRef: React.MutableRefObject<YTQueryType>;
}> = ({ ytQueryTypeRef }) => {
  const [ytQueryType, setYTQueryType] = useState<YTQueryType>("TEXT");

  function handleSelectQuery(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "Texto" && ytQueryType === "LINK") {
      setYTQueryType("TEXT");
      ytQueryTypeRef.current = "TEXT";
    } else {
      setYTQueryType("LINK");
      ytQueryTypeRef.current = "LINK";
    }
  }

  return (
    <select
      onChange={(e) => handleSelectQuery(e)}
      className="select-bordered select max-w-[100px] text-white"
    >
      <option disabled>Tipo de busca</option>
      <option defaultValue="true">Texto</option>
      <option>Link</option>
    </select>
  );
};
