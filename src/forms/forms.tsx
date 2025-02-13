import { FC, useMemo, useState } from "react";
import { DrawFructs } from "../components/draw-fructs";

interface IForms {
  ref: React.RefObject<HTMLElement | null>;
  handleClick: () => void;
}
export interface IFructsData {
  fructs: string;
  count: string | number;
}

export const Forms: FC<IForms> = ({ ref, handleClick }) => {
  const [isFructsData, setisFructsData] = useState<IFructsData[]>([]);
  const changeRef = () => {
    if (ref.current?.innerHTML.includes("Started")) {
      let text = ref.current.innerHTML.replace(
        "Started",
        "Matn o'zgartirildi!"
      );
      ref.current.innerHTML = text;
    } else if (ref.current?.innerHTML.includes("Matn o'zgartirildi!")) {
      let text = ref.current.innerHTML.replace(
        "Matn o'zgartirildi!",
        "Started"
      );
      ref.current.innerHTML = text;
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fructs = (formData.get("fructs") as string) || "";
    const count = (formData.get("count") as string) || 0;
    const data: IFructsData[] = [
      ...isFructsData,
      { fructs: fructs, count: count },
    ];
    setisFructsData(data);
  };
  const favoriteFruits = useMemo(() => isFructsData, [isFructsData]);

  return (
    <>
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="fructs"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Fructs name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            name="count"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Fructs count
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        <button
          onClick={changeRef}
          type="button"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ml-3"
        >
          Nomini uzgartirish
        </button>
        <button
          onClick={handleClick}
          type="button"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ml-3"
        >
          +1
        </button>
      </form>
      <div className="max-w-sm mx-auto mt-10">
        <DrawFructs isFructsData={favoriteFruits} />
      </div>
    </>
  );
};
