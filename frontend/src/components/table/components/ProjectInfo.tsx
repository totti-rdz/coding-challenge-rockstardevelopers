import { Data, Employee } from "../../../interfaces/table";

interface Props {
  employee: Employee;
  data: Data;
}

const ProjectInfo = ({ employee, data }: Props) => {
  const timeEntries = data.timeEntries.filter(
    (timeEntry) => timeEntry.employeeId === employee.id
  );

  const projectIds = Array.from(
    new Set<string>(timeEntries.map((timeEntry) => timeEntry.projectId))
  );

  return (
    <div className="bg-gray-600 flex mt-0 lg:mt-10 flex-col col-span-2 items-stretch p-5 gap-5">
      <div className="grid grid-cols-2">
        <div className="text-2xl font-bold">Projekte</div>
        <div className="text-2xl font-bold hidden sm:block">Zeiteinträge</div>
      </div>
      {projectIds &&
        projectIds.length > 0 &&
        projectIds.map((projectId) => {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="text-xl font-semibold">
                {
                  data.projects.find((project) => {
                    return project.id === projectId;
                  })?.name
                }
              </div>
              <div className="">
                <div className="text-lg font-medium block sm:hidden mt-5">
                  Zeiteinträge
                </div>

                {timeEntries
                  .filter((timeEntry) => timeEntry.projectId === projectId)
                  .map((timeEntry) => (
                    <div className="mb-5">
                      <div>{`date: ${timeEntry.date}`}</div>
                      <div>{`task: ${timeEntry.task}`}</div>
                      <div>{`minutes: ${timeEntry.minutes}`}</div>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ProjectInfo;
