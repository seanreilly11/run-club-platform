"use client";

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AttendanceDataPoint {
  label: string;
  rsvps: number;
  actual: number | null;
  afters: number | null;
}

interface AttendanceChartsProps {
  attendanceData: AttendanceDataPoint[];
  showRateTrend: { label: string; rate: number }[];
  memberHealth: { name: string; value: number; color: string }[];
}

export function AttendanceCharts({
  attendanceData,
  showRateTrend,
  memberHealth,
}: AttendanceChartsProps) {
  const barData = attendanceData.map((d) => ({
    name: d.label,
    RSVPs: d.rsvps,
    Attended: d.actual ?? 0,
    Afters: d.afters ?? 0,
  }));

  const areaData = showRateTrend.map((d) => ({
    name: d.label,
    rate: Math.round(d.rate * 100),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Attendance bar chart */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #F5F0EB",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: "#1C1917",
            marginBottom: "12px",
          }}
        >
          Attendance
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F5F0EB"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: "#A8A29E" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#A8A29E" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #F5F0EB",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <Bar dataKey="RSVPs" fill="#F5F0EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Attended" fill="#16A34A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Afters" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2-col: show rate + member health */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        {/* Show rate area chart */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "#1C1917",
              marginBottom: "12px",
            }}
          >
            Show rate
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={areaData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F5F0EB"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 8, fill: "#A8A29E" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 8, fill: "#A8A29E" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #F5F0EB",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(v) => [`${v}%`, "Show rate"]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="#8B5CF6"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Member health donut */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F5F0EB",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: "#1C1917",
              marginBottom: "12px",
            }}
          >
            Member health
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={memberHealth}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                dataKey="value"
                paddingAngle={2}
              >
                {memberHealth.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #F5F0EB",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: "9px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
