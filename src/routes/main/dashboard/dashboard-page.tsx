// import React from "react";
import UserCount from "./user-count";
import UserFeedback from "./user-feedback";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  Line,
  YAxis,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import { User, useUserContext } from "@/context/users-context";

const DashboardPage = () => {
  const { users } = useUserContext();
  const userList = users.userList;

  // Example user data from the database

  // Function to group users by the month of join
  const groupUsersByMonth = (userData: User[]) => {
    const groupedData: Record<string, User[]> = {};

    userData.forEach((user) => {
      const joinMonth = dayjs(user.createdAt).format("MMMM");

      if (!groupedData[joinMonth]) {
        groupedData[joinMonth] = [];
      }

      groupedData[joinMonth].push(user);
    });

    return groupedData;
  };

  // Function to convert grouped data to chart format
  const convertToChartData = (groupedData: Record<string, User[]>) => {
    const chartData: { month: string; userCount: number }[] = [];

    for (const month in groupedData) {
      chartData.push({ month, userCount: groupedData[month].length });
    }

    return chartData;
  };

  // Example: Group users by month and convert to chart data
  const groupedUserData = groupUsersByMonth(userList);
  const chartData = convertToChartData(groupedUserData);
  const userFeedback = userList
    .map((u) => {
      if (u.rating && u.feedback) {
        return {
          fullName: u.fullName,
          feedback: u.feedback,
          photo: u.photo,
          rating: u.rating,
        };
      }
    })
    .filter((fb) => fb !== undefined);

  return (
    <div>
      <h1 className="py-3 text-2xl font-semibold tracking-wider">DASHBOARD</h1>
      <UserCount totalCount={users.count} />
      <div className="w-full h-56 my-5 mb-20">
        <h2 className="my-5 text-xl font-medium tracking-wide">USER GRAPH</h2>
        <ResponsiveContainer width="100%" height="100%" className="text-black">
          <LineChart width={500} height={300} data={chartData}>
            <XAxis dataKey="month" />
            <YAxis dataKey="userCount" />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="userCount" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {userFeedback && userFeedback.length > 0 && (
        <UserFeedback feedback={userFeedback} />
      )}
    </div>
  );
};

export default DashboardPage;
