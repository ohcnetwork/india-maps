import React from 'react';

export default function StatBox({type, change, value, name}){
    switch(type){
        case "+" :
            return (
                <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded">
                    <div>
                        <div>
                            <p className="flex items-center justify-end text-green-500 text-md">
                                <span className="font-bold">{change}%</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"/></svg>
                            </p>
                        </div>
                        <p className="text-3xl font-semibold text-center text-gray-800">{value}</p>
                        <p className="text-lg text-center text-gray-500">{name}</p>
                    </div>
                </div>
            );
        case "-" : 
            return (
                <div id="jh-stats-negative" className="flex flex-col justify-center px-4 py-4 mt-4 bg-white border border-gray-300 rounded sm:mt-0">
                    <div>
                        <div>
                            <p className="flex items-center justify-end text-red-500 text-md">
                            <span className="font-bold">{change}%</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M20 9a1 1 0 012 0v8a1 1 0 01-1 1h-8a1 1 0 010-2h5.59L13 10.41l-3.3 3.3a1 1 0 01-1.4 0l-6-6a1 1 0 011.4-1.42L9 11.6l3.3-3.3a1 1 0 011.4 0l6.3 6.3V9z"/></svg>
                            </p>
                        </div>
                        <p className="text-3xl font-semibold text-center text-gray-800">{value}</p>
                        <p className="text-lg text-center text-gray-500">{name}</p>
                    </div>
                </div>
            );
        default :
            return (
                <div id="jh-stats-neutral" className="flex flex-col justify-center px-4 py-4 mt-4 bg-white border border-gray-300 rounded sm:mt-0">
                    <div>
                        <div>
                            <p className="flex items-center justify-end text-gray-500 text-md">
                                <span className="font-bold">{change}%</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path className="heroicon-ui" d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z"/></svg>
                            </p>
                        </div>
                        <p className="text-3xl font-semibold text-center text-gray-800">{value}</p>
                        <p className="text-lg text-center text-gray-500">{name}</p>
                    </div>
                </div>
            );
    }    
}