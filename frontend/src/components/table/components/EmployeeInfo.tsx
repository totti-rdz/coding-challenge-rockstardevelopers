import { Employee } from "../../../interfaces/table";

interface Props {
  employee: Employee;
}

const EmployeeInfo = ({ employee }: Props) => (
  <div className="bg-gray-400 p-5 mt-10" key={employee.id}>
    <div className="text-3xl font-bold">
      {[employee.firstName, employee.lastName].filter(Boolean).join(" ")}
    </div>
    <div>{employee.email}</div>
  </div>
);

export default EmployeeInfo;
