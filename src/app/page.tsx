"use client";

import React, { useState } from "react";

export default function Page() {
  // Assume: This comes from the server / API
  const dates = ["12/1/2023", "12/2/2023", "12/3/2023"];

  // The back end gives us the initial state. In a real implementation we'd probably fetch via route handler and pass as a prop.
  // Assumptions:
  // 1. Each nurse will always have the same dates present
  // 2. each date in the schedule will have an entry whether the nurse is working or not
  // 3. our back end will sort the schedule map for each nurse s.t. its in chrono order.

  const [schedule, setSchedule] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({
    Sanketh: {
      "12/1/2023": true,
      "12/2/2023": false,
      "12/3/2023": true,
    },

    Veeraj: {
      "12/1/2023": false,
      "12/2/2023": true,
      "12/3/2023": false,
    },

    Nikhil: {
      "12/1/2023": true,
      "12/2/2023": true,
      "12/3/2023": true,
    },
    Simarpreet: {
      "12/1/2023": false,
      "12/2/2023": false,
      "12/3/2023": false,
    },
  });

  // toggles in the UI/state only.
  // In the future we can POST to our back end each time  atoggle happens or we can track if the
  // state has been changed and if so have a "save" functionality that overwites the schedule in the DB
  // based on what is in state.
  function toggleNurseShift(nurse: string, date: string) {
    const isWorking = schedule[nurse][date];

    const newNurseSched = {
      [nurse]: { ...schedule[nurse], [date]: !isWorking },
    };

    setSchedule({ ...schedule, ...newNurseSched });
  }

  // basic styling for a cell.
  const styles = { border: "1px solid black" };

  // main rendering fn that constructs a table from the schedule
  function renderTable() {
    // the columns are just the dates. since the backend sorts everything, we assume order is correct.
    // there is an inital label column for the nurse names.
    const columns = (
      <tr>
        {[
          <td style={styles}>Nurse Name:</td>,
          ...dates.map((d) => <td style={styles}>{d}</td>),
        ]}
      </tr>
    );

    const rows = [];
    const nurses = Object.keys(schedule);

    // for each nurse we are creating a row that has:
    // 1. their name in the 1st cell
    // 2. their working status for each date in the requested schedule.
    // again we assume the date order is correct (matches the order in the columns) since our back end is responsible for sorting.
    for (let nurse of nurses) {
      const cells = [];
      cells.push(<td style={styles}>{nurse}</td>);
      for (let date of dates) {
        cells.push(
          <td
            key={nurse + date}
            onClick={() => toggleNurseShift(nurse, date)}
            style={{ cursor: "pointer", ...styles }}
          >
            {schedule[nurse][date] ? "X" : " "}
          </td>
        );
      }
      rows.push(<tr>{cells}</tr>);
    }

    // return a table with the rows and columns
    // in a real world setting we'd probably use a UI lib that handles table
    // functionality and just worry about passing the column and row data in the correct order & shape.
    return (
      <table style={{ width: "100%" }}>
        {columns}
        {rows}
      </table>
    );
  }

  return (
    <div>
      <>
        <h1>Vitalize Care</h1>
        <h3>Nurse Management</h3>
        {renderTable()}
      </>
    </div>
  );
}
