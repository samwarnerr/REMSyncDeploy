import React, { useState } from 'react';
import { Navbar } from '../../components';
import './logsleep.css';

const logsleep = () => {
  const today = new Date().toISOString().split('T')[0];
  const [sleepInput, setSleepInput] = useState({
    date: today, 
    bedtime: '',
    wakeTime: '',
    sleepQuality: '',
    notes: '',
    syncToFHIR: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSleepInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!sleepInput.bedtime || !sleepInput.wakeTime || !sleepInput.date) {
      alert('Please fill in date, bedtime, and wake time');
      return;
    }
  
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
  
    if (!userId) {
      alert('No user ID found. Please log in again.');
      return;
    }
  
    const bedtimeFormatted = new Date(`${sleepInput.date}T${sleepInput.bedtime}:00`).toISOString();
  
    const bedtimeHours = parseInt(sleepInput.bedtime.split(':')[0], 10);
    const wakeTimeHours = parseInt(sleepInput.wakeTime.split(':')[0], 10);
  
    let wakeTimeFormatted;
    if (wakeTimeHours < bedtimeHours) {
      const selectedDate = new Date(sleepInput.date);
      selectedDate.setDate(selectedDate.getDate() + 1);
      const nextDayStr = selectedDate.toISOString().split('T')[0];
      wakeTimeFormatted = `${nextDayStr} ${sleepInput.wakeTime}:00`;
    } else {
      wakeTimeFormatted = `${sleepInput.date} ${sleepInput.wakeTime}:00`;
    }
  
    try {
      const res = await fetch('https://remsyncdeploybackend-production.up.railway.app/api/sleep/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, // ✅ now dynamically from logged-in user
          bedtime: bedtimeFormatted,
          wakeTime: wakeTimeFormatted,
          sleepQuality: sleepInput.sleepQuality,
          notes: sleepInput.notes
        })
      });
  
      if (!res.ok) throw new Error(`Failed to submit: ${res.status} ${res.statusText}`);
  
      alert('Sleep entry submitted successfully!');
      setSleepInput({ date: today, bedtime: '', wakeTime: '', sleepQuality: '', notes: '', syncToFHIR: false});
    } catch (err) {
      alert('Error submitting sleep entry');
      console.error(err);
    }


    if (sleepInput.syncToFHIR) {
      const observation = {
        resourceType: "Observation",
        status: "final",
        category: [{
          coding: [{
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "sleep",
            display: "Sleep"
          }]
        }],
        code: {
          coding: [{
            system: "http://loinc.org",
            code: "93832-4",
            display: "Sleep quality"
          }]
        },
        subject: { reference: "Patient/example-user" },
        effectiveDateTime: bedtimeFormatted,
        valueQuantity: {
          value: Number(sleepInput.sleepQuality),
          unit: "Sleep Quality",
          system: "http://unitsofmeasure.org",
          code: "%"
        },
        note: [
          {
            text: sleepInput.notes || "No additional notes"
          }
        ]
      };
      console.log("FHIR Observation Payload:", JSON.stringify(observation, null, 2));
      try {
        const resFHIR = await fetch("https://server.fire.ly/r4/Observation", {
          method: "POST",
          headers: {
            "Content-Type": "application/fhir+json"
          },
          body: JSON.stringify(observation)
        });
    
        if (!resFHIR.ok) {
          throw new Error(`FHIR post failed: ${resFHIR.status}`);
        }
    
        console.log("Synced to FHIR!");
      } catch (err) {
        console.warn("Optional FHIR sync failed:", err);
        alert("Optional FHIR sync failed. Please check the console for details.");}
    }
    
  };
  

  return (
    <div className='login-wrapper'>
      <div className="log-sleep-container">
        <form className="sleep-input-form" onSubmit={handleSubmit}>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={sleepInput.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Bedtime (24-hour):
            <input
              type="time"
              name="bedtime"
              value={sleepInput.bedtime}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Wake Time (24-hour):
            <input
              type="time"
              name="wakeTime"
              value={sleepInput.wakeTime}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Sleep Quality (0-100):
            <input
              type="number"
              name="sleepQuality"
              min="0"
              max="100"
              value={sleepInput.sleepQuality}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Notes:
            <textarea
              name="notes"
              value={sleepInput.notes}
              onChange={handleInputChange}
              placeholder="How did you sleep?"
            />
          </label>
          <label className='checkbox-label'>
          <input
              type="checkbox"
              name="syncToFHIR"
              className='sync-checkbox'
              checked={sleepInput.syncToFHIR}
              onChange={(e) =>
                setSleepInput((prev) => ({
                  ...prev,
                  syncToFHIR: e.target.checked,
                }))
              }
            />
            Sync this entry to FHIR server
          </label>
          <button type="submit">Submit Sleep Data</button>
        </form>
      </div>
    </div>
  );
};

export default logsleep;