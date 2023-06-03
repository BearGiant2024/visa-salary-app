import React, { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import { fetchSheetData } from './GoogleSheets';

function App() {
  const [employer, setEmployer] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [salaryRecords, setSalaryRecords] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const spreadsheetId = process.env.SPREADSHEET_ID;
      const range = process.env.SHEET_RANGE;

      const fetchedData = await fetchSheetData(spreadsheetId, range);

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
    <Container className="container mt-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '30vh' }}>
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
              <Form.Control as="select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
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
      <Table striped bordered hover className="mt-4" style={{ maxWidth: '800px' }}>
        <thead>
          <tr>
            <th>Employer</th>
            <th>Job Title</th>
            <th>Base Salary</th>
            <th>Location</th>
            <th>Submit Date</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {salaryRecords.map((record, index) => {
            if (
              (record.employer.toLowerCase().includes(employer.toLowerCase()) || employer === '') &&
              (record.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()) || jobTitle === '') &&
              (record.location.toLowerCase().includes(city.toLowerCase()) || city === '') &&
              (selectedYear === 'All Years' || new Date(record.submitDate).getFullYear().toString() === selectedYear)
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
