module.exports = {
    // Replace with actual DigiLocker API credentials
    clientId: process.env.DIGILOCKER_CLIENT_ID,
    clientSecret: process.env.DIGILOCKER_CLIENT_SECRET,
    redirectUri: process.env.DIGILOCKER_REDIRECT_URI,
    authorizationURL: 'https://api.digitallocker.gov.in/public/oauth2/1/authorize',
    tokenURL: 'https://api.digitallocker.gov.in/public/oauth2/1/token',
    documentsURL: 'https://api.digitallocker.gov.in/public/oauth2/1/user/files',
    issuedDocumentsURL: 'https://api.digitallocker.gov.in/public/oauth2/1/user/documents'
  };