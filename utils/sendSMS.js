// const twilio = require('twilio');
// const client = twilio('ACCOUNT_SID', 'AUTH_TOKEN'); 

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: 'TWILIO_NUMBER',
      to
    });
    console.log("SMS sent successfully");
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = sendSMS;
