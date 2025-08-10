import { useState, useEffect } from 'react'
import './App.css'
import useLocalStorage from './hooks/useLocalStorage'
import { formatDate, generateId } from './utils/helpers'
import ExportButton from './components/ExportButton'

function App() {
  const [funds, setFunds] = useLocalStorage('ganesh-funds', [])
  const [spending, setSpending] = useLocalStorage('ganesh-spending', [])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMode, setPaymentMode] = useState('cash')
  const [editingId, setEditingId] = useState(null)
  const [editingSpendingId, setEditingSpendingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [spendingSearchTerm, setSpendingSearchTerm] = useState('')
  const [language, setLanguage] = useLocalStorage('language', 'english')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('donations') // 'donations' or 'spending'

  const totalAmount = funds.reduce((sum, fund) => sum + parseFloat(fund.amount), 0)
  const totalSpending = spending.reduce((sum, spend) => sum + parseFloat(spend.amount), 0)
  const netBalance = totalAmount - totalSpending

  // Language translations
  const translations = {
    english: {
      title: '🕉️Shaneshwar Society Ganesh Chaturthi Tracker',
      totalCollection: 'Total Collection',
      totalDonors: 'Total Donors',
      totalSpending: 'Total Spending',
      netBalance: 'Net Balance',
      addDonation: 'Add New Donation',
      editDonation: 'Edit Donation',
      addSpending: 'Add New Spending',
      editSpending: 'Edit Spending',
      name: 'Name',
      amount: 'Amount (₹)',
      date: 'Date',
      paymentMode: 'Payment Mode',
      cash: 'Cash',
      online: 'Online',
      addDonationBtn: 'Add Donation',
      updateDonationBtn: 'Update Donation',
      addSpendingBtn: 'Add Spending',
      updateSpendingBtn: 'Update Spending',
      cancel: 'Cancel',
      searchPlaceholder: 'Search by donor name...',
      spendingSearchPlaceholder: 'Search by spending name...',
      noDonations: 'No donations recorded yet.',
      noSpending: 'No spending recorded yet.',
      noSearchResults: 'No donations found matching your search.',
      noSpendingSearchResults: 'No spending found matching your search.',
      edit: '✏️ Edit',
      delete: '🗑️ Delete',
      deleteConfirm: 'Are you sure you want to delete this record?',
      fillAllFields: 'Please fill in all fields',
      language: 'Language',
      login: 'Login',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      loginBtn: 'Login',
      loginError: 'Invalid email or password',
      addDonationBtn: 'Add New Donation',
      adminAccess: 'Admin Access Required',
      donations: 'Donations',
      spending: 'Spending',
      tableHeaders: {
        name: 'Donor Name',
        amount: 'Amount (₹)',
        date: 'Date',
        paymentMode: 'Payment Mode',
        actions: 'Actions'
      },
      spendingTableHeaders: {
        name: 'Spending Name',
        amount: 'Amount (₹)',
        date: 'Date',
        paymentMode: 'Payment Mode',
        actions: 'Actions'
      }
    },
    hindi: {
      title: '🕉️ गणेश चतुर्थी फंड ट्रैकर',
      totalCollection: 'कुल संग्रह',
      totalDonors: 'कुल दानदाता',
      totalSpending: 'कुल खर्च',
      netBalance: 'शुद्ध बैलेंस',
      addDonation: 'नया दान जोड़ें',
      editDonation: 'दान संपादित करें',
      addSpending: 'नया खर्च जोड़ें',
      editSpending: 'खर्च संपादित करें',
      name: 'नाम',
      amount: 'राशि (₹)',
      date: 'तारीख',
      paymentMode: 'भुगतान का तरीका',
      cash: 'नकद',
      online: 'ऑनलाइन',
      addDonationBtn: 'दान जोड़ें',
      updateDonationBtn: 'दान अपडेट करें',
      addSpendingBtn: 'खर्च जोड़ें',
      updateSpendingBtn: 'खर्च अपडेट करें',
      cancel: 'रद्द करें',
      searchPlaceholder: 'दानदाता के नाम से खोजें...',
      spendingSearchPlaceholder: 'खर्च के नाम से खोजें...',
      noDonations: 'अभी तक कोई दान दर्ज नहीं किया गया।',
      noSpending: 'अभी तक कोई खर्च दर्ज नहीं किया गया।',
      noSearchResults: 'आपकी खोज से मेल खाता कोई दान नहीं मिला।',
      noSpendingSearchResults: 'आपकी खोज से मेल खाता कोई खर्च नहीं मिला।',
      edit: '✏️ संपादित करें',
      delete: '🗑️ हटाएं',
      deleteConfirm: 'क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?',
      fillAllFields: 'कृपया सभी फ़ील्ड भरें',
      language: 'भाषा',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      email: 'ईमेल',
      password: 'पासवर्ड',
      loginBtn: 'लॉगिन करें',
      loginError: 'गलत ईमेल या पासवर्ड',
      addDonationBtn: 'नया दान जोड़ें',
      adminAccess: 'एडमिन एक्सेस आवश्यक',
      donations: 'दान',
      spending: 'खर्च',
      tableHeaders: {
        name: 'दानदाता का नाम',
        amount: 'राशि (₹)',
        date: 'तारीख',
        paymentMode: 'भुगतान का तरीका',
        actions: 'कार्रवाई'
      },
      spendingTableHeaders: {
        name: 'खर्च का नाम',
        amount: 'राशि (₹)',
        date: 'तारीख',
        paymentMode: 'भुगतान का तरीका',
        actions: 'कार्रवाई'
      }
    }
  }

  const t = translations[language]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim() || !amount.trim() || !date) {
      alert(t.fillAllFields)
      return
    }

    if (editingId) {
      // Update existing fund
      setFunds(funds.map(fund => 
        fund.id === editingId 
          ? { ...fund, name: name.trim(), amount: parseFloat(amount), date, paymentMode }
          : fund
      ))
      setEditingId(null)
    } else {
      // Add new fund
      const newFund = {
        id: generateId(),
        name: name.trim(),
        amount: parseFloat(amount),
        date,
        paymentMode,
        createdAt: new Date().toISOString()
      }
      setFunds([...funds, newFund])
    }

    // Reset form
    setName('')
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setPaymentMode('cash')
  }

  const handleSpendingSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim() || !amount.trim() || !date) {
      alert(t.fillAllFields)
      return
    }

    if (editingSpendingId) {
      // Update existing spending
      setSpending(spending.map(spend => 
        spend.id === editingSpendingId 
          ? { ...spend, name: name.trim(), amount: parseFloat(amount), date, paymentMode }
          : spend
      ))
      setEditingSpendingId(null)
    } else {
      // Add new spending
      const newSpending = {
        id: generateId(),
        name: name.trim(),
        amount: parseFloat(amount),
        date,
        paymentMode,
        createdAt: new Date().toISOString()
      }
      setSpending([...spending, newSpending])
    }

    // Reset form
    setName('')
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setPaymentMode('cash')
  }

  const handleEdit = (fund) => {
    setEditingId(fund.id)
    setName(fund.name)
    setAmount(fund.amount.toString())
    setDate(fund.date)
    setPaymentMode(fund.paymentMode || 'cash')
  }

  const handleEditSpending = (spend) => {
    setEditingSpendingId(spend.id)
    setName(spend.name)
    setAmount(spend.amount.toString())
    setDate(spend.date)
    setPaymentMode(spend.paymentMode || 'cash')
  }

  const handleDelete = (id) => {
    if (window.confirm(t.deleteConfirm)) {
      setFunds(funds.filter(fund => fund.id !== id))
    }
  }

  const handleDeleteSpending = (id) => {
    if (window.confirm(t.deleteConfirm)) {
      setSpending(spending.filter(spend => spend.id !== id))
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingSpendingId(null)
    setName('')
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setPaymentMode('cash')
  }

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'hindi' : 'english')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    
    if (email === 'ratnesh11@gmail.com' && password === 'ratnesh12') {
      setIsAuthenticated(true)
      setShowLogin(false)
      setEmail('')
      setPassword('')
    } else {
      setLoginError(t.loginError)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setEditingId(null)
    setEditingSpendingId(null)
    setName('')
    setAmount('')
    setDate(new Date().toISOString().split('T')[0])
    setPaymentMode('cash')
  }

  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSpending = spending.filter(spend =>
    spend.name.toLowerCase().includes(spendingSearchTerm.toLowerCase())
  )

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1>{t.title}</h1>
          <div className="header-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? '🇮🇳 हिंदी' : '🇺🇸 English'}
            </button>
            {!isAuthenticated && (
              <button 
                onClick={() => setShowLogin(true)}
                className="login-btn-header"
              >
                🔐 {t.login}
              </button>
            )}
            {isAuthenticated && (
              <button onClick={handleLogout} className="logout-btn-header">
                🚪 {t.logout}
              </button>
            )}
          </div>
        </div>
        <div className="total-amount">
          <div className="financial-summary">
            <div className="summary-item">
              <h2>{t.totalCollection}: ₹{totalAmount.toFixed(2)}</h2>
              <p>{t.totalDonors}: {funds.length}</p>
            </div>
            <div className="summary-item">
              <h2>{t.totalSpending}: ₹{totalSpending.toFixed(2)}</h2>
              <p>Total Items: {spending.length}</p>
            </div>
            <div className="summary-item net-balance">
              <h2>{t.netBalance}: ₹{netBalance.toFixed(2)}</h2>
              <p className={netBalance >= 0 ? 'positive' : 'negative'}>
                {netBalance >= 0 ? '💰 Surplus' : '💸 Deficit'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && !isAuthenticated && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <div className="login-modal-header">
              <h3>🔐 {t.adminAccess}</h3>
              <button 
                onClick={() => setShowLogin(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">{t.email}:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'english' ? "Enter email" : "ईमेल दर्ज करें"}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">{t.password}:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'english' ? "Enter password" : "पासवर्ड दर्ज करें"}
                  required
                />
              </div>
              {loginError && <p className="error-message">{loginError}</p>}
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {t.loginBtn}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowLogin(false)}
                  className="btn-secondary"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="app-main">
        {isAuthenticated && (
          <div className="admin-panel">
            <div className="admin-header">
              <div className="admin-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('donations')}
                >
                  💰 {t.donations}
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'spending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('spending')}
                >
                  💸 {t.spending}
                </button>
              </div>
              <div className="admin-status">
                <span className="status-indicator">🟢 Admin Mode</span>
              </div>
            </div>
            
            {activeTab === 'donations' && (
              <form onSubmit={handleSubmit} className="fund-form">
                <h4>{editingId ? t.editDonation : t.addDonation}</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t.name}:</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'english' ? "Enter donor name" : "दानदाता का नाम दर्ज करें"}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">{t.amount}:</label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={language === 'english' ? "Enter amount" : "राशि दर्ज करें"}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">{t.date}:</label>
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.paymentMode}:</label>
                    <div className="payment-mode-options">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="paymentMode"
                          value="cash"
                          checked={paymentMode === 'cash'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        />
                        <span className="radio-label">{t.cash}</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="paymentMode"
                          value="online"
                          checked={paymentMode === 'online'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        />
                        <span className="radio-label">{t.online}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    {editingId ? t.updateDonationBtn : t.addDonationBtn}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={handleCancelEdit}
                      className="btn-secondary"
                    >
                      {t.cancel}
                    </button>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'spending' && (
              <form onSubmit={handleSpendingSubmit} className="fund-form">
                <h4>{editingSpendingId ? t.editSpending : t.addSpending}</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="spending-name">{t.name}:</label>
                    <input
                      type="text"
                      id="spending-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'english' ? "Enter spending name" : "खर्च का नाम दर्ज करें"}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="spending-amount">{t.amount}:</label>
                    <input
                      type="number"
                      id="spending-amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={language === 'english' ? "Enter amount" : "राशि दर्ज करें"}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="spending-date">{t.date}:</label>
                    <input
                      type="date"
                      id="spending-date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.paymentMode}:</label>
                    <div className="payment-mode-options">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="spending-paymentMode"
                          value="cash"
                          checked={paymentMode === 'cash'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        />
                        <span className="radio-label">{t.cash}</span>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="spending-paymentMode"
                          value="online"
                          checked={paymentMode === 'online'}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        />
                        <span className="radio-label">{t.online}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    {editingSpendingId ? t.updateSpendingBtn : t.addSpendingBtn}
                  </button>
                  {editingSpendingId && (
                    <button 
                      type="button" 
                      onClick={handleCancelEdit}
                      className="btn-secondary"
                    >
                      {t.cancel}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            💰 {t.donations} ({funds.length})
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'spending' ? 'active' : ''}`}
            onClick={() => setActiveTab('spending')}
          >
            💸 {t.spending} ({spending.length})
          </button>
        </div>

        {activeTab === 'donations' && (
          <div className="funds-section">
            <div className="funds-header">
              <div className="search-section">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <ExportButton funds={funds} language={language} />
            </div>

            <div className="table-container">
              {filteredFunds.length === 0 ? (
                <div className="no-funds">
                  <p>{searchTerm ? t.noSearchResults : t.noDonations}</p>
                </div>
              ) : (
                <table className="funds-table">
                  <thead>
                    <tr>
                      <th>{t.tableHeaders.name}</th>
                      <th>{t.tableHeaders.amount}</th>
                      <th>{t.tableHeaders.date}</th>
                      <th>{t.tableHeaders.paymentMode}</th>
                      {isAuthenticated && <th>{t.tableHeaders.actions}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFunds.map(fund => (
                      <tr key={fund.id} className="fund-row">
                        <td className="donor-name">{fund.name}</td>
                        <td className="amount">₹{fund.amount.toFixed(2)}</td>
                        <td className="date">{formatDate(fund.date)}</td>
                        <td className="payment-mode">
                          <span className={`payment-badge ${fund.paymentMode}`}>
                            {fund.paymentMode === 'online' ? '💳 ' : '💵 '}
                            {translations[language][fund.paymentMode]}
                          </span>
                        </td>
                        {isAuthenticated && (
                          <td className="actions">
                            <button 
                              onClick={() => handleEdit(fund)}
                              className="btn-edit"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDelete(fund.id)}
                              className="btn-delete"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'spending' && (
          <div className="funds-section">
            <div className="funds-header">
              <div className="search-section">
                <input
                  type="text"
                  placeholder={t.spendingSearchPlaceholder}
                  value={spendingSearchTerm}
                  onChange={(e) => setSpendingSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <ExportButton funds={spending} language={language} />
            </div>

            <div className="table-container">
              {filteredSpending.length === 0 ? (
                <div className="no-funds">
                  <p>{spendingSearchTerm ? t.noSpendingSearchResults : t.noSpending}</p>
                </div>
              ) : (
                <table className="funds-table">
                  <thead>
                    <tr>
                      <th>{t.spendingTableHeaders.name}</th>
                      <th>{t.spendingTableHeaders.amount}</th>
                      <th>{t.spendingTableHeaders.date}</th>
                      <th>{t.spendingTableHeaders.paymentMode}</th>
                      {isAuthenticated && <th>{t.spendingTableHeaders.actions}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSpending.map(spend => (
                      <tr key={spend.id} className="fund-row">
                        <td className="donor-name">{spend.name}</td>
                        <td className="amount spending-amount">₹{spend.amount.toFixed(2)}</td>
                        <td className="date">{formatDate(spend.date)}</td>
                        <td className="payment-mode">
                          <span className={`payment-badge ${spend.paymentMode}`}>
                            {spend.paymentMode === 'online' ? '💳 ' : '💵 '}
                            {translations[language][spend.paymentMode]}
                          </span>
                        </td>
                        {isAuthenticated && (
                          <td className="actions">
                            <button 
                              onClick={() => handleEditSpending(spend)}
                              className="btn-edit"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteSpending(spend.id)}
                              className="btn-delete"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App 