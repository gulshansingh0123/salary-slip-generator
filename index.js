const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/send-email', upload.single('pdf'), async (req, res) => {
  const { email } = req.body;
  const pdfPath = req.file.path;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourEmail@gmail.com',      // Change to your email
      pass: 'yourAppPassword'           // Use App Password if Gmail
    }
  });

  const mailOptions = {
    from: 'yourEmail@gmail.com',
    to: email,
    subject: 'Your Salary Slip',
    text: 'Attached is your salary slip.',
    attachments: [
      {
        filename: req.file.originalname,
        path: pdfPath,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    fs.unlinkSync(pdfPath); // delete temp file
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));