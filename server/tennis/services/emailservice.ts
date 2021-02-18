// Import required AWS SDK clients and commands for Node.js
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Set the AWS Region
const REGION = "us-east-1"; // e.g. "us-east-1"
// Create SES service object
const ses = new SESClient({ region: REGION });


const fns = {
  /**
     * @description Attempt to send an email
     * @param emailConfig {object} Object containing all required fields to
     * send email
     * @returns {Promise<{success: boolean, error: *}|{success: boolean, body: *}>}
     */
  sendEmail: async ( emailConfig: any ) => {
    try {
      const data = await ses.send(new SendEmailCommand(emailConfig));
      console.log('Success', data);
      return { success: true, body: data };
    } catch ( err ) {
      return { success: false, error: err };
    }
  },
  buildPasswordResetEmailConfig : (from: string, to: string, passtext: string): any => {
      // send email to the user
      // Set the parameters
      const params = {
        Destination: {
          /* required */
          CcAddresses: [
            /* more items */
          ],
          ToAddresses: [
            to, // RECEIVER_ADDRESS
            /* more To-email addresses */
          ],
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: "UTF-8",
              Data: "<head></head><body>Your password has been reset. Your new password is " + passtext + "</body>",
            },
            Text: {
              Charset: "UTF-8",
              Data: "",
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Tennis Reservations Password Reset",
          },
        },
        Source: from, // SENDER_ADDRESS
        ReplyToAddresses: [
          /* more items */
        ],
      };

      return params;
    }
};

export default fns;
