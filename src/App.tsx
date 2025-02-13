import { useCallback, useRef, useState } from "react";
import { Forms } from "./forms/forms";

export const App = () => {
  const ref = useRef<HTMLInputElement | null>(null); // Barcha actionlarni test qilish
  const [state, setstate] = useState<number>(0);

  const handleClick = useCallback(() => {
    setstate((item) => item + 1);
  }, [state]);

  return (
    <div>
      <div className="flex items-center justify-center gap-4">
        <h1 ref={ref} className="text-3xl font-bold underline text-center mt-6">
          Started
        </h1>
        <p className="text-3xl font-bold underline text-center mt-6">{state}</p>
      </div>
      <Forms ref={ref} handleClick={handleClick} />
    </div>
  );
};
