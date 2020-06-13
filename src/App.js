import React, { useState } from "react";
import Map from "./components/Map.js";
import StatBox from "./components/StatBox.js";

const img = require("./logo.svg");
function App(){
  const [sideBar,setSideBar] = useState(false);
    const dummy = {
      indiaData:[],
      showTestCenters:[],
      dimensions:[],
      selectedLocationData:[],
      newsSearchKeyword:[],
      selectedLocationDataDisplay:[],
      selectedLocCoordinate:{}
    }
    let {
      indiaData,
      showTestCenters,
      dimensions,
      selectedLocationData,
      newsSearchKeyword,
      selectedLocationDataDisplay,
      selectedLocCoordinate
    } = dummy;
    const [dashboardData, setDashboardData] = useState();
    return (
      <div className="h-screen flex overflow-hidden bg-gray-100">
      {
        sideBar &&
        <div className="md:hidden">
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
            </div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-200">
              <div className="absolute top-0 right-0 -mr-14 p-1">
                <button onClick={_ => setSideBar(false)} className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600" aria-label="Close sidebar">
                  <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4">
                <a href="/">
                  <img className="h-8 w-auto" src={img} alt="care logo" />
                </a>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2">
                  {[{link:"", title:"title"}].map(item => {
                    const selectedClasses = false
                      ? "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-white rounded-md bg-green-900 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150"
                      : "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-green-300 rounded-md hover:text-white hover:bg-green-700 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150";
                    return (
                      <span
                        key={item.title}
                        className={selectedClasses}
                      >
                        <i className={item.icon + false ? " text-white" : " text-green-400" + " mr-3 text-md group-hover:text-green-300 group-focus:text-green-300 transition ease-in-out duration-150"}>
                        </i>
                        {item.title}
                      </span>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-green-700 p-4">
                <sapn href="#" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <div className="rounded-full h-8 w-8 flex items-center bg-white justify-center">
                        <i className="inline-block fas fa-user text-xl text-green-700"></i>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs leading-4 font-medium text-green-300 group-hover:text-green-100 transition ease-in-out duration-150">
                        Attribution
                      </p>
                    </div>
                  </div>
                </sapn>
              </div>
            </div>
            <div className="flex-shrink-0 w-14">
            </div>
          </div>
        </div>
      }

      <div className="hidden md:flex md:flex-shrink-0 w-1/5 bg-gray-200">
        <div className="flex flex-col pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <a href="/">
              <img className="h-8 w-auto" src={img} alt="care logo" />
            </a>
          </div>
          <div className="mt-5 h-0 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2">
              {[{link:"", title:"title"}].map(item => {
                const selectedClasses = false
                  ? "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-white rounded-md bg-green-900 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150"
                  : "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-green-300 rounded-md hover:text-white hover:bg-green-700 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150";
                return (
                  <button
                    key={item.title}
                    className={selectedClasses}
                  >
                    <i className={item.icon + (false ? " text-white" : " text-green-400") + " mr-3 text-lg group-hover:text-green-300 group-focus:text-green-300 transition ease-in-out duration-150"}>
                    </i>
                    {item.title}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-700 p-4">
            <a href="/" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                </div>
                <div className="ml-3">
                  <p className="text-xs leading-4 font-medium text-gray-900 group-hover:text-green-100 transition ease-in-out duration-150">
                    Attribution
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full flex-1 overflow-hidden">
        <div className="flex md:hidden relative z-10 flex-shrink-0 h-16 bg-white shadow">
          <button onClick={_ => setSideBar(true)} className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden" aria-label="Open sidebar">
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <a href="/" className="md:hidden flex h-full w-full items-center px-4">
            <img className="h-6 w-auto" src={img} alt="care logo" />
          </a>
        </div>

        <main className="flex-1 relative z-0 overflow-y-scroll pb-4 md:py-0 focus:outline-none" >
          <Map
            viewTestCenters={showTestCenters}
            selectedLocCoordinate={selectedLocCoordinate}
            setDashboardData={setDashboardData}
          />
          <div className="absolute inset-x-0 h-screen bg-gray-700 w-full" style={{marginTop:"80vh"}}>
            <div id="wrapper" className="max-w-xl px-4 py-4 mx-auto">
              <div className="grid h-32 grid-flow-row gap-4 grid-cols-4">
                  {[
                    {type: "+", name: "Active", change: "5", value:dashboardData?.active | "0"},
                    {type: "+", name: "Cases", change: "5", value:dashboardData?.confirmed | "0"},
                    {type: "+", name: "Death", change: "1", value:dashboardData?.deceased | "0"},
                    {type: "+", name: "Death", change: "1", value:dashboardData?.recovered | "0"},
                  ].map(stat => <StatBox type={stat.type} name={stat.name} change={stat.change} value={stat.value} />)}
              </div>
          </div>
          </div>
        </main>
      </div>
    </div>
    );
}

export default App;
