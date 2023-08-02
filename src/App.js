import ReactApexChart from "react-apexcharts";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import AdRevenueCalculation from "./pages";
import moment from "moment";
import Datepicker from "react-tailwindcss-datepicker";

function App() {
  const [profaseeData, setProfaseeData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(moment().endOf("week").isoWeekday(1)),
  });

  const handleValueChange = (newValue) => setDateRange(newValue);

  const fetchProfaseeData = useCallback(() => {
    fetch("https://dev-api2.profasee.com/reports/test-data")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProfaseeData(data.payload.results);
        setDateRange({
          ...dateRange,
          startDate: data.payload.results[0].date,
          endDate: data.payload.results[7].date,
        });
      });
  }, [dateRange]);

  useEffect(() => {
    if (profaseeData.length <= 0) fetchProfaseeData();
  }, [fetchProfaseeData, profaseeData.length]);

  const recordsBetweenDates = profaseeData.filter((item) => {
    const itemDate = moment(item.date);
    return itemDate.isBetween(
      dateRange.startDate,
      dateRange.endDate,
      "day",
      "[]"
    );
  });
  return (
    <>
      <header className="sticky top-0 z-10 py-5 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="relative z-50 flex justify-between">
            <div className="flex items-center md:gap-x-3">
              <a aria-label="Home" href="/">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 40 40"
                  className="h-10 w-auto"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 20c0 11.046 8.954 20 20 20s20-8.954 20-20S31.046 0 20 0 0 8.954 0 20Zm20 16c-7.264 0-13.321-5.163-14.704-12.02C4.97 22.358 6.343 21 8 21h24c1.657 0 3.031 1.357 2.704 2.98C33.32 30.838 27.264 36 20 36Z"
                    fill="#2563EB"
                  ></path>
                </svg>
              </a>
              <div className="text-lg">
                Pro<span className="text-blue-700">fasee</span>
              </div>
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-8">
              <div className="hidden md:block">
                <a
                  className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  href="/"
                >
                  Home
                </a>
              </div>

              <div className="-mr-1 md:hidden">
                <div>
                  <button
                    className="relative z-10 flex h-8 w-8 items-center justify-center [&amp;:not(:focus-visible)]:focus:outline-none"
                    aria-label="Toggle Navigation"
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path
                        d="M0 1H14M0 7H14M0 13H14"
                        className="origin-center transition"
                      ></path>
                      <path
                        d="M2 2L12 12M12 2L2 12"
                        className="origin-center transition scale-90 opacity-0"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <section className="bg-slate-50 pt-20 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/4">
            <div className="flex justify-between pb-5 items-center">
              <div className="text-lg">Informative Chart</div>
              <div className="border rounded">
                <Datepicker
                  showShortcuts={true}
                  value={dateRange}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            {recordsBetweenDates.length ? (
              <>
                <ReactApexChart
                  series={[
                    {
                      name: "Units",
                      data: recordsBetweenDates.map((item) =>
                        parseInt(item.units)
                      ),
                    },
                    {
                      name: "Revenue",
                      data: recordsBetweenDates.map((item) =>
                        parseFloat(item.revenue).toFixed(2)
                      ),
                    },
                    {
                      name: "Cogs",
                      data: recordsBetweenDates.map((item) =>
                        parseFloat(item.cogs).toFixed(2)
                      ),
                    },
                    {
                      name: "Ads Cost",
                      data: recordsBetweenDates.map((item) =>
                        parseFloat(item.ads_cost).toFixed(2)
                      ),
                    },
                    // {
                    //   name: "Best Sellers Rank",
                    //   data: recordsBetweenDates.map(
                    //     (item) => item.best_sellers_rank
                    //   ),
                    // },
                    {
                      name: "PPC Revenue Adjusted",
                      data: recordsBetweenDates.map((item) =>
                        parseFloat(item.ppc_revenue_adjusted).toFixed(2)
                      ),
                    },
                    {
                      name: "Ads Cost Adjusted",
                      data: recordsBetweenDates.map((item) =>
                        parseFloat(item.ads_cost_adjusted).toFixed(2)
                      ),
                    },
                  ]}
                  options={{
                    stroke: {
                      curve: "smooth",
                    },
                    fill: {
                      type: "gradient",
                    },
                    xaxis: {
                      categories: recordsBetweenDates.map((item) =>
                        moment(item.date).format("DD MMM, YYYY")
                      ),
                      type: "date",
                    },
                    chart: {
                      height: 350,
                      type: "area",
                    },
                  }}
                  height={364}
                  type="area"
                />
              </>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
                disabled=""
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Data...
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 pt-20 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
            <div className="flex justify-between pb-5 items-center">
              <div className="text-lg">
                Profit And Loss (This Year vs Last Year)
              </div>
              <div className="border rounded">
                <Datepicker
                  showShortcuts={true}
                  value={dateRange}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            {recordsBetweenDates.length ? (
              <>
                <div className="pt-10 overflow-scroll">
                  <AdRevenueCalculation data={recordsBetweenDates} />
                </div>
              </>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
                disabled=""
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Data...
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 pt-20 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/4">
            <div className="flex justify-between pb-5 items-center">
              <div className="text-lg">
                Comparison Units (Last Year vs This Year)
              </div>
              <div className="border rounded">
                <Datepicker
                  showShortcuts={true}
                  value={dateRange}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            {recordsBetweenDates.length ? (
              <>
                <ReactApexChart
                  series={[
                    {
                      name: "Units",
                      data: recordsBetweenDates.map((item) =>
                        parseInt(item.units)
                      ),
                    },
                    {
                      name: "Last Year Units",
                      data: recordsBetweenDates.map((item) =>
                        parseFloat(item.units_lastyear).toFixed(2)
                      ),
                    },
                  ]}
                  options={{
                    stroke: {
                      curve: "smooth",
                    },
                    fill: {
                      type: "gradient",
                    },
                    xaxis: {
                      categories: recordsBetweenDates.map((item) =>
                        moment(item.date).format("DD MMM, YYYY")
                      ),
                      type: "date",
                    },
                    chart: {
                      height: 350,
                      type: "area",
                    },
                  }}
                  height={364}
                  type="area"
                />
              </>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
                disabled=""
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Data...
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 pt-20 sm:pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/4">
            <div className="flex justify-between pb-5 items-center">
              <div className="text-lg">
                Comparison Revenue (Last Year vs This Year)
              </div>
              <div className="border rounded">
                <Datepicker
                  showShortcuts={true}
                  value={dateRange}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            {recordsBetweenDates.length ? (
              <>
                <ReactApexChart
                  series={[
                    {
                      name: "Revenue",
                      data: recordsBetweenDates.map((item) =>
                        parseInt(item.revenue)
                      ),
                    },
                    {
                      name: "Last Year Revenue",
                      data: recordsBetweenDates.map((item) =>
                        parseFloat(item.revenue_lastyear).toFixed(2)
                      ),
                    },
                  ]}
                  options={{
                    stroke: {
                      curve: "smooth",
                    },
                    fill: {
                      type: "gradient",
                    },
                    xaxis: {
                      categories: recordsBetweenDates.map((item) =>
                        moment(item.date).format("DD MMM, YYYY")
                      ),
                      type: "date",
                    },
                    chart: {
                      height: 350,
                      type: "area",
                    },
                  }}
                  height={364}
                  type="area"
                />
              </>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
                disabled=""
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Data...
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
