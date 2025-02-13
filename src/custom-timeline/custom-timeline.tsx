import { useEffect, useRef, useState } from "react";
import { DataSet, Timeline, TimelineOptions } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

interface TimelineItem {
  id: number;
  content: string;
  start: Date;
  end: Date;
}

const timeData: number[] = [
  1738608320000, 1738628743000, 1738628817000, 1738628820000, 1738628881000,
  1738628958000, 1738628960000, 1738637847000, 1738637894000, 1738637847000,
];

export const CustomTimeline = () => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<Timeline | null>(null);
  const [customDate] = useState<any>(timeData[0]);

  useEffect(() => {
    if (!timelineRef.current) return;
    const container = timelineRef.current;
    const startTime = new Date(timeData[0]);
    const endTime = new Date(timeData[timeData.length - 1]);

    // Create a DataSet with data
    const timelineData = new DataSet<TimelineItem>([
      { id: 1, content: "GPS", start: startTime, end: endTime },
    ]);

    const options: TimelineOptions = {
      showCurrentTime: true,
      start: startTime,
      end: endTime,
      editable: false,
      height: "120px",
      snap: function (date: Date) {
        const hour = 60 * 1000;
        return new Date(Math.round(date.getTime() / hour) * hour);
      },
    };

    timeline.current = new Timeline(container, timelineData, options);

    timeline.current.addCustomTime(customDate, "customTimeBar");

    timeline.current.on("timechange", function (properties) {
      console.log("Ko'k chiziq harakatlandi, yangi vaqt:", properties.time);
    });

    return () => {
      if (timeline.current) {
        timeline.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div ref={timelineRef} style={{ height: "300px" }}></div>
    </>
  );
};
