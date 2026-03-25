import { useMemo, useState } from "react";

function parseLocalDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function formatDateForDisplay(date) {
  if (!date) return "";
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function formatCurrency(value) {
  if (value === "" || value == null || Number.isNaN(value)) return "";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function utcDayNumber(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
}

function inclusiveDaysBetween(start, end) {
  return utcDayNumber(end) - utcDayNumber(start) + 1;
}

function calculateProratedMonths(start, end) {
  let total = 0;

  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= lastMonth) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const dim = daysInMonth(year, month);

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, dim);

    const segmentStart = start > monthStart ? start : monthStart;
    const segmentEnd = end < monthEnd ? end : monthEnd;

    if (segmentStart <= segmentEnd) {
      const daysCovered = inclusiveDaysBetween(segmentStart, segmentEnd);
      total += daysCovered / dim;
    }

    current = new Date(year, month + 1, 1);
  }

  return total;
}

function generateFiscalSegments(startDateString, endDateString) {
  if (!startDateString || !endDateString) return [];

  const projectStart = parseLocalDate(startDateString);
  const projectEnd = parseLocalDate(endDateString);

  if (!projectStart || !projectEnd || projectStart > projectEnd) return [];

  const segments = [];
  let currentStart = new Date(projectStart);
  let fyIndex = 1;

  while (currentStart <= projectEnd) {
    let fiscalEnd = new Date(currentStart.getFullYear(), 5, 30); // June 30

    if (currentStart.getMonth() > 5) {
      fiscalEnd = new Date(currentStart.getFullYear() + 1, 5, 30);
    }

    const segmentEnd = fiscalEnd < projectEnd ? fiscalEnd : projectEnd;
    const monthsProrated = calculateProratedMonths(currentStart, segmentEnd);

    segments.push({
      label: `FY ${fyIndex}`,
      start: new Date(currentStart),
      end: new Date(segmentEnd),
      monthsProrated,
    });

    currentStart = new Date(segmentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
    fyIndex += 1;
  }

  return segments;
}

export default function CostShareTool() {
  const [projectTitle, setProjectTitle] = useState("");
  const [piName, setPiName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [baseSalary, setBaseSalary] = useState(100000);
  const [growthRate, setGrowthRate] = useState(0.03);
  const [salaryCap, setSalaryCap] = useState(0);
  const [fringeRate, setFringeRate] = useState(0.3);

  const [effortByFy, setEffortByFy] = useState({});

  const segments = useMemo(() => {
    return generateFiscalSegments(startDate, endDate);
  }, [startDate, endDate]);

  const calculationRows = useMemo(() => {
    return segments.map((segment, index) => {
      const actualSalary = baseSalary * Math.pow(1 + growthRate, index);
      const salaryUsed =
        salaryCap > 0 ? Math.min(actualSalary, salaryCap) : actualSalary;

      const effort = effortByFy[segment.label] ?? "";
      const numericEffort = effort === "" ? "" : Number(effort);

      const salaryPortion =
        numericEffort === ""
          ? ""
          : salaryUsed * numericEffort * (segment.monthsProrated / 12);

      const fringe = salaryPortion === "" ? "" : salaryPortion * fringeRate;
      const total = salaryPortion === "" ? "" : salaryPortion + fringe;

      return {
        ...segment,
        actualSalary,
        salaryUsed,
        effort: numericEffort,
        salaryPortion,
        fringe,
        total,
        isCapped: salaryCap > 0 && actualSalary > salaryCap,
      };
    });
  }, [segments, baseSalary, growthRate, salaryCap, fringeRate, effortByFy]);

  const summary = useMemo(() => {
    const rowsWithTotals = calculationRows.filter((row) => row.total !== "");
    const totalCostShare = rowsWithTotals.reduce((sum, row) => sum + row.total, 0);
    const averageCostShare =
      rowsWithTotals.length > 0 ? totalCostShare / rowsWithTotals.length : "";
    const yearsIncluded = rowsWithTotals.length;

    return {
      totalCostShare,
      averageCostShare,
      yearsIncluded,
    };
  }, [calculationRows]);

  function updateEffort(fyLabel, rawValue) {
    setEffortByFy((prev) => ({
      ...prev,
      [fyLabel]: rawValue === "" ? "" : Number(rawValue),
    }));
  }

  return (
    <div className="cost-share-tool">
      <div className="tool-shell">
        <section className="tool-hero">
          <h1>Cost Share Planning Tool</h1>
          <p>
            Build a fiscal-year cost share model using project dates, salary
            assumptions, and effort by fiscal segment.
          </p>
        </section>

        <section className="tool-card">
          <h2>Project Information</h2>
          <p className="section-note">
            Enter project dates to generate fiscal year segments automatically.
          </p>

          <div className="field-grid">
            <label>
              <span>Project Title</span>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Optional"
              />
            </label>

            <label>
              <span>PI Name</span>
              <input
                type="text"
                value={piName}
                onChange={(e) => setPiName(e.target.value)}
                placeholder="Optional"
              />
            </label>

            <label>
              <span>Project Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            <label>
              <span>Project End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="tool-card">
          <h2>Fiscal Year Distribution</h2>
          <p className="section-note">
            FY 1 begins on the project start date and ends on June 30. Each
            subsequent fiscal year runs from July 1 through June 30. Partial
            months are prorated automatically using actual days.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fiscal Segment</th>
                  <th>Segment Start</th>
                  <th>Segment End</th>
                  <th>Months (Prorated)</th>
                </tr>
              </thead>
              <tbody>
                {segments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-row">
                      Enter project start and end dates to generate fiscal segments.
                    </td>
                  </tr>
                ) : (
                  segments.map((segment) => (
                    <tr key={segment.label}>
                      <td>{segment.label}</td>
                      <td>{formatDateForDisplay(segment.start)}</td>
                      <td>{formatDateForDisplay(segment.end)}</td>
                      <td>{segment.monthsProrated.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="tool-card">
          <h2>Key Inputs</h2>
          <p className="section-note">
            Salary growth is applied by fiscal segment. If a salary cap is entered,
            cost share is calculated using the lower of actual salary or salary cap.
            Fringe is applied after salary portion is calculated.
          </p>

          <div className="field-grid">
            <label>
              <span>Base Salary</span>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
              />
            </label>

            <label>
              <span>Annual Salary Growth (%)</span>
              <input
                type="number"
                step="0.01"
                value={(growthRate * 100).toString()}
                onChange={(e) =>
                  setGrowthRate(
                    e.target.value === "" ? 0 : Number(e.target.value) / 100
                  )
                }
              />
            </label>

            <label>
              <span>Salary Cap</span>
              <input
                type="number"
                value={salaryCap}
                onChange={(e) => setSalaryCap(Number(e.target.value))}
              />
            </label>

            <label>
              <span>Fringe Rate (%)</span>
              <input
                type="number"
                step="0.01"
                value={(fringeRate * 100).toString()}
                onChange={(e) =>
                  setFringeRate(
                    e.target.value === "" ? 0 : Number(e.target.value) / 100
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="tool-card">
          <h2>Cost Share Calculation</h2>
          <p className="section-note">
            Actual Salary is calculated by fiscal segment. Salary Used reflects the
            amount used for cost share calculations after applying the salary cap.
            Enter Effort (%) manually for each fiscal segment.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fiscal Segment</th>
                  <th>Actual Salary</th>
                  <th>Salary Used</th>
                  <th>Months (Prorated)</th>
                  <th>Effort (%)</th>
                  <th>Salary Portion</th>
                  <th>Fringe</th>
                  <th>Total Cost Share</th>
                </tr>
              </thead>
              <tbody>
                {calculationRows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-row">
                      Enter project dates to begin calculations.
                    </td>
                  </tr>
                ) : (
                  calculationRows.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>{formatCurrency(row.actualSalary)}</td>
                      <td className={row.isCapped ? "warning-cell" : ""}>
                        {formatCurrency(row.salaryUsed)}
                      </td>
                      <td>{row.monthsProrated.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 10"
                          value={
                            row.effort === ""
                              ? ""
                              : (row.effort * 100).toString()
                          }
                          onChange={(e) =>
                            updateEffort(
                              row.label,
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value) / 100
                            )
                          }
                        />
                      </td>
                      <td>{formatCurrency(row.salaryPortion)}</td>
                      <td>{formatCurrency(row.fringe)}</td>
                      <td>{formatCurrency(row.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="tool-card">
          <h2>Summary</h2>
          <p className="section-note">
            Total Cost Share reflects the sum of all fiscal year cost share amounts.
          </p>

          <div className="summary-grid">
            <div className="summary-item">
              <span>Total Cost Share</span>
              <strong>{formatCurrency(summary.totalCostShare)}</strong>
            </div>
            <div className="summary-item">
              <span>Average Cost Share</span>
              <strong>
                {summary.averageCostShare === ""
                  ? ""
                  : formatCurrency(summary.averageCostShare)}
              </strong>
            </div>
            <div className="summary-item">
              <span>Fiscal Segments Included</span>
              <strong>{summary.yearsIncluded}</strong>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .cost-share-tool {
          width: 100%;
          padding: 2rem 1rem 4rem;
          background: #f7f8fb;
          color: #1d2733;
        }

        .tool-shell {
          max-width: 1100px;
          margin: 0 auto;
        }

        .tool-hero {
          margin-bottom: 1.5rem;
        }

        .tool-hero h1 {
          margin: 0 0 0.5rem;
          font-size: 2rem;
          color: #1f3a5f;
        }

        .tool-hero p {
          margin: 0;
          max-width: 760px;
          line-height: 1.6;
        }

        .tool-card {
          background: #ffffff;
          border: 1px solid #d8e0ea;
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 8px 24px rgba(20, 34, 56, 0.05);
        }

        .tool-card h2 {
          margin: 0 0 0.5rem;
          color: #1f3a5f;
          font-size: 1.2rem;
        }

        .section-note {
          margin: 0 0 1rem;
          color: #516173;
          line-height: 1.5;
        }

        .field-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-weight: 600;
        }

        input {
          border: 1px solid #c8d3e0;
          border-radius: 10px;
          padding: 0.7rem 0.8rem;
          font: inherit;
          background: #fff;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        th {
          background: #1f3a5f;
          color: #fff;
          text-align: left;
          padding: 0.85rem;
          font-weight: 700;
        }

        td {
          border: 1px solid #d8e0ea;
          padding: 0.85rem;
          vertical-align: middle;
          background: #fff;
        }

        .empty-row {
          text-align: center;
          color: #6a7889;
          padding: 1.2rem;
        }

        .warning-cell {
          background: #fff0f0;
          color: #8f1f1f;
          font-weight: 700;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .summary-item {
          border: 1px solid #d8e0ea;
          border-radius: 12px;
          padding: 1rem;
          background: #f9fbfd;
        }

        .summary-item span {
          display: block;
          color: #516173;
          margin-bottom: 0.35rem;
        }

        .summary-item strong {
          font-size: 1.15rem;
          color: #1f3a5f;
        }
      `}</style>
    </div>
  );
}