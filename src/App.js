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
    const [selectedTab, setSelectedTab] = useState("World");
    const [dashboardData, setDashboardData] = useState();
    const [rootData, setRootData] = useState({});
    const [pan, setPan] = useState({zoom:7, position: {lat: 9.5915668,lng: 76.5221531}, geoJson:null});
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
                  <img className="h-8 w-auto" src={img} alt="coronasafe logo" />
                </a>
              </div>
              <div className="p-2">
                <ul className='flex cursor-pointer'>
                  {["Kerala","India","World"].map(tab=>
                      <li 
                        className={'py-2 px-6 bg-white rounded-t-lg' + (selectedTab===tab ? "":" text-gray-500 bg-gray-200")}
                        onClick={()=>setSelectedTab(tab)}
                      >{tab}</li>
                    )}
                </ul>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2">
                  {Object.entries(rootData?.data || {}).map(([name,item]) => {
                    const selectedClasses = name === (dashboardData?.name || "")
                      ? "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-white rounded-md bg-green-900 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150"
                      : "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-green-700 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150";
                    return (
                      <button
                        key={name}
                        className={selectedClasses}
                        onClick={()=>{
                          setPan({geoJson:item.geojson_feature, location:name, position:{lat:item.latitude, lng:item.longitude}})
                          setDashboardData({...item, name:name})
                        }}
                      >
                        {name}
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-green-700 p-4">
                <sapn href="#" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-xs leading-4 font-medium text-gray-900 group-hover:text-green-100 transition ease-in-out duration-150">
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
        <div className="flex flex-col pt-5 w-full">
          <div className="flex items-center flex-shrink-0 px-4">
            <a href="/">
              <img className="h-8 w-auto" src={img} alt="care logo" />
            </a>
          </div>
          <div className="mt-5 h-0 flex-1 flex flex-col overflow-y-auto">
            <div>
              <ul className='p-2 flex cursor-pointer'>
                {["Kerala","India","World"].map(tab=>
                    <li 
                      className={"py-2 px-6 bg-white rounded-t-lg" + (selectedTab===tab ? "":" text-gray-500 bg-gray-200")}
                      onClick={()=>setSelectedTab(tab)}
                    >{tab}</li>
                  )}
              </ul>
            </div>
            <nav className="flex-1 px-2">
              {Object.entries(rootData?.data || {}).map(([name,item]) => {
                const selectedClasses = name === (dashboardData?.name || "")
                  ? "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-white rounded-md bg-green-900 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150"
                  : "mt-2 group flex w-full items-center px-2 py-2 text-base leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-green-700 focus:outline-none focus:bg-green-900 transition ease-in-out duration-150";
                return (
                  <button
                    key={name}
                    className={selectedClasses}
                    onClick={()=>{
                      setPan({geoJson:item.geojson_feature, location:name, position:{lat:item.latitude, lng:item.longitude}})
                      setDashboardData({...item, name:name})
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-700 p-4">
            <a href="/" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
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
            setDashboardData={setDashboardData}
            setRootData={setRootData}
            pan={pan}
            setPan={setPan}
          />
          <div className="absolute inset-x-0 h-screen bg-gray-700 w-full" style={{marginTop:"70vh"}}>
            <div id="wrapper" className="max-w-xl px-4 py-4 mx-auto">
            <h4 className="text-white py-1">{dashboardData?.name}</h4>
              <div className="grid h-32 grid-flow-row gap-4 grid-cols-4">
                  {[
                    {type: "+", name: "Active", change: dashboardData?.delta?.active | "0", value:dashboardData?.active | "0"},
                    {type: "+", name: "Cases", change: dashboardData?.delta?.confirmed | "0", value:dashboardData?.confirmed | "0"},
                    {type: "+", name: "Death", change: dashboardData?.delta?.deceased | "0", value:dashboardData?.deceased | "0"},
                    {type: "+", name: "Death", change: dashboardData?.delta?.recovered | "0", value:dashboardData?.recovered | "0"},
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
