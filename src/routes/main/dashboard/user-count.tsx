// import React from "react";
import dayjs from "dayjs";

const UserCount = ({ totalCount }: { totalCount: number }) => {
  return (
    <div className="flex justify-between w-full p-10 text-3xl bg-gray-700 rounded-lg">
      <div>
        <h2>Total Users:</h2>
        <p className="text-base">{dayjs().format("MMMM DD, YYYY  hh:mmA")}</p>
      </div>
      <p>{totalCount.toLocaleString()}</p>
    </div>
  );
};

export default UserCount;
