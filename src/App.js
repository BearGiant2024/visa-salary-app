import React, { useState } from 'react';
import { Container, Form, Button, Table, Alert } from 'react-bootstrap';

const API_KEY = `AIzaSyCPiVRDxxQFWZjanUQx2oPrnEg3cqMjz3k`;
const SPREADSHEET_ID = `12hKO-ucUdcb7ZPiGdkAW3WxX7proDzH8CCJIr4OlaY0`;

const SHEET_RANGE = "'Form Responses 1'!A2:H";

const fetchSheetData = async (spreadsheetId, range, apiKey) => {
  let fetchedData = [];

  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data.values.map((row) => {
        const record = {
          recruiterInitials: row[0],
          company: row[1],
          year: row[2],
          stage: row[3],
          followUp: row[4],
        };
        return record;
      });

      return fetchedData;
    })
    .catch((error) => {
      console.error(error);
    });
};

function App() {
  const [recruiterInitials, setRecruiterInitials] = useState('');
  const [company, setCompany] = useState('');
  const [year, setYear] = useState('All Years');
  const [ghostingRecords, setGhostingRecords] = useState([]);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!recruiterInitials && !company) {
      setError("Please provide Recruiter's Initials and Company name");
      return;
    }
  
    if (!recruiterInitials) {
      setError("Please enter Recruiter's Initials.");
      return;
    }
  
    if (!company) {
      setError('Please enter Company Name.');
      return;
    }
  
    setError('');
  
    try {
      const fetchedData = await fetchSheetData(SPREADSHEET_ID, SHEET_RANGE, API_KEY);
      
      const filteredData = fetchedData.filter((record) =>{

        const isRecruiterIntitals = record.recruiterInitials.toLowerCase().includes(recruiterInitials.toLowerCase()) 
      
        const isCompany = record.company.toLowerCase().includes(company.toLowerCase())

        const isYear = (year === 'All Years' || parseInt(record.year) === parseInt(year))

        return isRecruiterIntitals && isCompany && isYear
        
      }
        
      );
  
      setGhostingRecords(filteredData);
      setShowResults(true); 
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
      <h1 className="justify-content-center align-items-center" style={{ minHeight: '10vh' }}><b>Ghosting's Database</b></h1>
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      <Form>
        <div className="row">
          <div className="col">
            <Form.Group>
              <Form.Control
                type="text"
                value={recruiterInitials}
                onChange={(e) => setRecruiterInitials(e.target.value)}
                placeholder="Recruiter's Initials"
                required
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Control
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company"
                required
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group>
              <Form.Control
                as="select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
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
            <Button variant="primary" onClick={handleSubmit}>
              Search
            </Button>
          </div>
        </div>
      </Form>
      <Table striped bordered hover className="mt-4" style={{ maxWidth: '800px' }}>
  {showResults && ghostingRecords.length > 0 ? (
    <thead>
      <tr>
        <th>Company</th>
        <th>Recruiter's Initials</th>
        <th>Stage</th>
        <th>Follow Up</th>
        <th>Year</th>
      </tr>
    </thead>
  ) : null}
  <tbody>
    {showResults && ghostingRecords.length > 0 ? (
      ghostingRecords.map((record, index) => {
          return (
            <tr key={index}>
              <td>{record.company}</td>
              <td>{record.recruiterInitials}</td>
              <td>{record.stage}</td>
              <td>{record.followUp}</td>
              <td>{record.year}</td>
            </tr>
          );
      })
    ) : (
      <tr>
        <td colSpan="5">No records found.</td>
      </tr>
    )}
  </tbody>
</Table>
    </Container>
  );
}

export default App;