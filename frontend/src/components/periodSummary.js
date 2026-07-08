import React from 'react';
import ActivityStats from './activityStats';
import UserActivities from './userActivities';

// zsumuj aktywnosci po typie (dla rozbicia per aktywnosc)
const aggregateByType = (activities) => Object.values(
  activities.reduce((acc, a) => {
    if (!acc[a.activity_type_id]) acc[a.activity_type_id] = { activity_type_id: a.activity_type_id, time: 0 };
    acc[a.activity_type_id].time += a.time;
    return acc;
  }, {}));

// Reuzywalne podsumowanie okresu: statystyki (ActivityStats) + opcjonalne rozbicie per typ.
// stats: [{ icon, value, label }]
// breakdownActivities: surowa lista aktywnosci - jesli podana, pod statystykami pojawi sie rozbicie per typ
const PeriodSummary = ({ stats, breakdownActivities, activityTypes = [] }) => (
  <>
    <ActivityStats stats={stats} />
    {breakdownActivities && (
      <UserActivities
        activityTypes={activityTypes}
        deleteActivity={() => {}}
        activities={aggregateByType(breakdownActivities)}
        hideTotal
      />
    )}
  </>
);

export default PeriodSummary;
