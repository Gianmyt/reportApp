import React, { useState } from 'react';
import './ReportApp.css';

export default function ReportApp() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [reports, setReports] = useState([
      {
        id: 1,
        operator: 'Marco Rossi',
        date: '2025-05-09',
        description: 'Manutenzione attrezzature zona A',
        hours: 8,
        money: 45.50,
        photos: [],
        status: 'completed'
      }
  ]);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [formData, setFormData] = useState({
    description: '',
    hours: '',
    money: '',
    photos: []
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username.toLowerCase() === 'admin') {
      setCurrentUser({ role: 'admin', name: 'Admin' });
      setCurrentPage('dashboard');
    } else if (loginData.username) {
      setCurrentUser({ role: 'operator', name: loginData.username });
      setCurrentPage('form');
    }
    setLoginData({ username: '', password: '' });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, { name: file.name, data: event.target.result }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (formData.description.trim()) {
      const newReport = {
        id: reports.length + 1,
        operator: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        description: formData.description,
        hours: parseFloat(formData.hours),
        money: parseFloat(formData.money),
        photos: formData.photos,
        status: 'completed'
      };
      setReports([newReport, ...reports]);
      setFormData({ description: '', hours: '', money: '', photos: [] });
      alert('Report inviato con successo!');
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="app">
      {currentPage === 'login' && (
        <div className="login-container">
          <div className="login-box">
            <h1>Work Report System</h1>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username (admin per dashboard)"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button type="submit">Accedi</button>
            </form>
            <p className="hint">Usa "admin" per accedere come amministratore</p>
          </div>
        </div>
      )}

      {currentPage === 'form' && currentUser?.role === 'operator' && (
        <div className="form-container">
          <div className="form-header">
            <h1>Nuovo Report Giornaliero</h1>
            <button onClick={handleLogout} className="logout-btn">Esci</button>
          </div>
          <form onSubmit={handleSubmitReport} className="report-form">
            <div className="form-row">
              <div className="form-group">
                <label>Descrizione Attività</label>
                <textarea
                  placeholder="Descrivi cosa hai fatto oggi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ore Lavorate</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="es: 8"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Soldi Utilizzati (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="es: 50.00"
                  value={formData.money}
                  onChange={(e) => setFormData({ ...formData, money: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Carica Foto</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

            {formData.photos.length > 0 && (
              <div className="photos-preview">
                <h3>Foto caricate ({formData.photos.length})</h3>
                <div className="photo-grid">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo.data} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="remove-photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn">Invia Report</button>
          </form>
        </div>
      )}

      {currentPage === 'dashboard' && currentUser?.role === 'admin' && (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Dashboard Amministratore</h1>
            <button onClick={handleLogout} className="logout-btn">Esci</button>
          </div>

          <div className="reports-list">
            <h2>Report Giornalieri ({reports.length})</h2>
            {reports.length === 0 ? (
              <p className="no-reports">Nessun report disponibile</p>
            ) : (
              reports.map(report => (
                <div className="report-card">
                  <div className="report-header">
                    <div className="operator-info">
                      <h3>{report.operator}</h3>
                      <span className="date">{new Date(report.date).toLocaleDateString('it-IT')}</span>
                    </div>
                    <span className={`status ${report.status}`}>{report.status}</span>
                  </div>
                  
                  <div className="report-stats">
                    <div className="stat-item">
                      <span className="stat-label">⏱ Ore</span>
                      <span className="stat-value">{report.hours}h</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">💰 Soldi</span>
                      <span className="stat-value">€{report.money.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="description">{report.description}</p>
                  {report.photos.length > 0 && (
                    <div className="report-photos">
                      <strong>Foto ({report.photos.length})</strong>
                      <div className="photo-grid">
                        {report.photos.map((photo, idx) => (
                          <img key={idx} src={photo.data} alt={`Report ${report.id}`} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
