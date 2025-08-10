import React from 'react'
import { formatDate } from '../utils/helpers'

function ExportButton({ funds, language }) {
  const translations = {
    english: {
      noData: 'No data to export!',
      exportText: '📊 Export to CSV'
    },
    hindi: {
      noData: 'एक्सपोर्ट करने के लिए कोई डेटा नहीं!',
      exportText: '📊 CSV में निर्यात करें'
    }
  }

  const t = translations[language] || translations.english

  const exportToCSV = () => {
    if (funds.length === 0) {
      alert(t.noData)
      return
    }

    const headers = ['Name', 'Amount (₹)', 'Date', 'Payment Mode', 'Created At']
    const csvContent = [
      headers.join(','),
      ...funds.map(fund => [
        `"${fund.name}"`,
        fund.amount,
        formatDate(fund.date),
        fund.paymentMode || 'cash',
        formatDate(fund.createdAt)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `ganesh-funds-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button onClick={exportToCSV} className="btn-export">
      {t.exportText}
    </button>
  )
}

export default ExportButton 