
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useSleepRecords } from '@/hooks/use-sleep-records';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
const RADIAN = Math.PI / 180;

// Custom label for the pie chart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SleepQualityChart = () => {
  const { records } = useSleepRecords();

  // If no records, show placeholder data
  if (records.length === 0) {
    const placeholderData = [
      { name: 'Poor', value: 0 },
      { name: 'Fair', value: 0 },
      { name: 'Good', value: 1 },
      { name: 'Excellent', value: 0 },
    ];
    
    return (
      <div className="h-60 w-full">
        <div className="text-muted-foreground text-center mb-4">
          No sleep records yet. Start tracking to see your statistics.
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={placeholderData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {placeholderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Process data for the chart
  const qualityCounts: Record<string, number> = { 'Poor': 0, 'Fair': 0, 'Good': 0, 'Excellent': 0 };
  
  records.forEach(record => {
    qualityCounts[record.quality] += 1;
  });
  
  const data = Object.keys(qualityCounts).map(quality => ({
    name: quality,
    value: qualityCounts[quality]
  }));

  // Average hours slept
  const totalHours = records.reduce((sum, record) => sum + record.hoursSlept, 0);
  const avgHours = records.length > 0 ? (totalHours / records.length).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h4 className="text-muted-foreground text-sm">Records</h4>
          <p className="text-2xl font-medium">{records.length}</p>
        </div>
        <div>
          <h4 className="text-muted-foreground text-sm">Avg. Hours</h4>
          <p className="text-2xl font-medium">{avgHours}</p>
        </div>
        <div>
          <h4 className="text-muted-foreground text-sm">Woke Up</h4>
          <p className="text-2xl font-medium">
            {records.filter(r => r.wokeUpDuringNight).length}
          </p>
        </div>
      </div>
      
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SleepQualityChart;
