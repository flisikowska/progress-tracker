import { data_V1 } from "./data_v1";
import { parseISO, differenceInCalendarWeeks, endOfISOWeek, subWeeks, format } from 'date-fns';

const getWeekNumber = (dateString) => {
    // const formattedDateString = dateString.replace(/\./g, '-');
    const date = parseISO(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const weekNumber = differenceInCalendarWeeks(date, startOfYear, { weekStartsOn: 1 }) + 1;
    return weekNumber;
};


const generateWeeklyData = (data_V1) => {
    const weeklyData = {};
    const people = data_V1.map(person => person.Type);

    // Determine the current week number and generate the last 10 weeks
    const currentDate = new Date();
    const endWeek = getWeekNumber(format(endOfISOWeek(currentDate), 'yyyy-MM-dd'));
    const startWeek = endWeek - 9;

    for (let week = startWeek; week <= endWeek; week++) {
        weeklyData[week] = { x: `${week}` };
        people.forEach(person => {
            weeklyData[week][person] = 0;
        });
    }

    // Populate the weekly data with actual values from activities
    data_V1.forEach(person => {
        person.activities.forEach(activity => {
            const weekNumber = getWeekNumber(activity.date);
            if (weekNumber !== null && weekNumber >= startWeek && weekNumber <= endWeek) {
                const timeInMinutes =activity.time ;
                weeklyData[weekNumber][person.Type] += timeInMinutes;
            }
        });
    });

    return Object.values(weeklyData).sort((a, b) => a.x.localeCompare(b.x));
};

// Export the generated data
export const data = generateWeeklyData(data_V1);