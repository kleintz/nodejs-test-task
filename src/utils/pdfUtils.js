const pdf = require('pdf-creator-node')
const fs = require('fs')
const path = require('path')

const generatePDF = (user) => {
  const templatePath = path.join(__dirname, '..', 'templates', 'userPDF.html'),
    html = fs.readFileSync(templatePath, 'utf8'),
    options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm'
    },
    document = {
      html: html,
      data: {
        user
      },
      type: 'buffer'
    }
  return pdf.create(document, options)
}

module.exports.generatePDF = generatePDF
