import { useEffect, useState } from "react";
import Table from "./components/table";
import { Data } from "./interfaces/table";
import axios from "axios";

const endpoints = ["employees", "projects", "timeEntries"];

const getData = async (endpoint: string) => await axios(endpoint);

function App() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    (async () => {
      const response = await Promise.all(
        endpoints.map(async (endpoint) => {
          const response = await getData(endpoint);
          return { [endpoint]: response.data };
        })
      );
      setData(
        response.reduce((p, c) => {
          return { ...p, ...c };
        }, {}) as Data
      );
    })();
  }, []);

  return (
    <main className="w-screen p-10">
      {data ? (
        <Table data={data} />
      ) : (
        <div className="grid place-content-center text-5xl font-bold">
          Loading...
        </div>
      )}
    </main>
  );
}

export default App;
