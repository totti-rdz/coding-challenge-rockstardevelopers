import { Data } from "../../interfaces/table";
import EmployeeInfo from "./components/EmployeeInfo";
import ProjectInfo from "./components/ProjectInfo";

interface Props {
  data: Data;
}

const Table = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
      {data.employees.map((employee) => (
        <>
          <EmployeeInfo employee={employee} />
          <ProjectInfo employee={employee} data={data} />
        </>
      ))}
    </div>
  );
};

export default Table;
