require("dotenv").config();

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
 
  }
});

const test = async () => {
  try {
    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL,

      Destination: {
        ToAddresses: ["ismailahmedhasssan@gmail.com"],
      },

      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: "DevTinder SES Test",
        },

        Body: {
          Text: {
            Charset: "UTF-8",
            Data: "Hello! This is a test email from DevTinder.",
          },

          Html: {
            Charset: "UTF-8",
            Data: `
              <h1>Hello!</h1>
              <p>This is a test email from <b>DevTinder</b>.</p>
            `,
          },
        },
      },
    });

    const response = await sesClient.send(command);

    console.log("Email sent successfully!");
    console.log(response.MessageId);
  } catch (error) {
    console.error("Email failed:");
    console.error(error);
  }
};

test();