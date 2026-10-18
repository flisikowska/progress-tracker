import React from 'react';
import ActivityStats from './activityStats';
import UserActivities from './userActivities';

const aggregateByType = (activities) => Object.values(
  activities.reduce((acc, a) => {
    if (!acc[a.activity_type_id]) acc[a.activity_type_id] = { activity_type_id: a.activity_type_id, time: 0 };
    acc[a.activity_type_id].time += a.time;
    return acc;
  }, {}));
  
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
