import React, { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';

const API_KEY = `AIzaSyCMsslWIYUnU0DXdJF0T-tsc4XCwMVSFsc`;
const SPREADSHEET_ID = `1UebVF2471PlstzOTyW8Bq77sCZ8zJzCqnqisYJcFQ6Y`;
const SHEET_RANGE = `Salary!A2:F`;

const fetchSheetData = async (spreadsheetId, range, apiKey) => {
  let fetchedData = [];

  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data.values.map(row => {
        const record = {
          employer: row[0],
          jobTitle: row[1],
          baseSalary: row[2],
          location: row[3],
          submitDate: row[4],
          startDate: row[5],
          year: new Date(row[5]).getFullYear()
        };
        return record
      });
      
      return  fetchedData
    })
    .catch((error) => {
      console.error(error);
    });
};

function App() {
  const [employer, setEmployer] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [salaryRecords, setSalaryRecords] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fetchedData = await fetchSheetData(SPREADSHEET_ID, SHEET_RANGE, API_KEY);
      setSalaryRecords(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const years = [];

  for (let year = 2023; year >= 2012; year--) {
    years.push(year);
  }

  return (
    <Container
      className="container mt-5 d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '30vh' }}
    >
      <h2 className="justify-content-center align-items-center" style={{ minHeight: '10vh' }}>H1B Salary Database</h2>
      <Form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <Form.Group>
              <Form.Control
                type="text"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                placeholder="Employer"
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Control
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="and/or Job Title"
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Control
                as="select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option>All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <div className="col">
            <Button variant="primary" type="submit">
              Search
            </Button>
          </div>
        </div>
      </Form>
      <Table
        striped
        bordered
        hover
        className="mt-4"
        style={{ maxWidth: '800px' }}
      >
        {
           salaryRecords && salaryRecords.length!==0?(<thead>
            <tr>
              <th>Employer</th>
              <th>Job Title</th>
              <th>Base Salary</th>
              <th>Location</th>
              <th>Submit Date</th>
              <th>Start Date</th>
            </tr>
          </thead>):"" 
        }
        
        <tbody>
          {salaryRecords.map((record, index) => {
            if (
              (record.employer.toLowerCase().includes(employer.toLowerCase()) ||
                employer === '') &&
              (record.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()) ||
                jobTitle === '') &&
              (record.location.toLowerCase().includes(city.toLowerCase()) ||
                city === '') &&
              (selectedYear === 'All Years' ||
                new Date(record.submitDate).getFullYear().toString() ===
                  selectedYear)
            ) {
              return (
                <tr key={index}>
                  <td>{record.employer}</td>
                  <td>{record.jobTitle}</td>
                  <td>${record.baseSalary.toLocaleString()}</td>
                  <td>{record.location}</td>
                  <td>{record.submitDate}</td>
                  <td>{record.startDate}</td>
                </tr>
              );
            }

            return null;
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
