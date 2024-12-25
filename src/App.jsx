import React from 'react'
import LineChart from './Charts/LineChart'
import MultiChart from './Charts/MultiChart'
import HumidityTemperature from './Charts/HumidityTemperature'
import Nav from './Charts/Nav' // Correct import for the Nav component

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <>
      <Router>
        <div className='container'><Nav /> {/* Correctly use Nav component here */}
        </div>
        <Routes>
          <Route path="/linechart" element={<LineChart />} />
          <Route path="/multichart" element={<MultiChart />} />
          <Route path="/humiditytemperature" element={<HumidityTemperature />} />
        </Routes>
      </Router>
    </>
  )
}
