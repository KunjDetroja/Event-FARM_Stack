import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import api from './api'

const App = () => {
  const [organization, setorganization] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    since: '',
    members: []
  });

  const fetchorganization = async () => {
    const response = await api.get('/');
    setorganization(response.data)
  };

  useEffect(() => {
    fetchorganization();
  }, []);

  const handleInputChange = (event) => {
    console.log('handleInputChange')
    console.log(event.target.name + ' ' + event.target.value)
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;

        try {
          // Parse the JSON content and update the 'members' field in your state
          const jsonData = JSON.parse(fileContent);
          setFormData({
            ...formData,
            members: jsonData
          });
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleFormSubmit = async (event) => {
    console.log('Submit')
    event.preventDefault();
    try {
      await api.post('/', formData);
      fetchorganization();
      setFormData({
        name: '',
        since: '',
        members: []
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error('Validation error:', error.response.data);
      } else {
        console.error('Error submitting form:', error.message);
      }
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      fetchorganization();
      // if (response.ok) {
      //   // Remove the deleted organization from your state
      //   const updatedOrganizations = organization.filter((org) => org.id !== id);
      //   // Update the state to re-render the component
      //   // setOrganization(updatedOrganizations);
      // } else {
      //   console.error('Failed to delete organization:', response.statusText);
      // }
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" >Navbar</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className='container'>
        <h2>Add Organization</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" name='name' id="name" onChange={handleInputChange} value={formData.name} />
          </div>
          <div className="mb-3">
            <label htmlFor="since" className="form-label">Since</label>
            <input type="number" className="form-control" name='since' id="since" onChange={handleInputChange} value={formData.since} />
          </div>
          <div className="mb-3">
            <label htmlFor="jsonFile" className="form-label">Choose a JSON file:</label>
            <input
              type="file"
              className="form-control"
              name='members'
              id="jsonFile"
              accept=".json"
              onChange={handleFileChange}
              multiple={false} // Disable multiple file selection
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Name</th>
              <th scope="col">Since</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {organization.map((organization, index) => (
              <tr key={organization.id}>
                <th scope="row">{index + 1}</th>
                <td>{organization.name}</td>
                <td>{organization.since}</td>
                <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(organization._id)}>Delete</button></td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
