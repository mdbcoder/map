import { FC, memo } from "react";
import { IFructsData } from "../forms/forms";

interface IDrawFructs {
  isFructsData: IFructsData[];
}

export const DrawFructs: FC<IDrawFructs> = memo(({ isFructsData }) => {
  return (
    <>
      <div className="text-center">DrawFructs</div>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              №:
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              Meva nomi:
            </th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              Meva soni:
            </th>
          </tr>
        </thead>
        <tbody>
          {isFructsData.map(({ count, fructs }: IFructsData, index: number) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{fructs}</td>
              <td className="p-4">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
});
