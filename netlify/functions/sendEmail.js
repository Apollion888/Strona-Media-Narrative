const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    };
  }

  // Check required environment variables
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        ok: false, 
        error: 'Server configuration error' 
      })
    };
  }

  try {
    // Parse request body
    const { name, email, topic, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Missing required fields: name, email, message' 
        })
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Invalid email format' 
        })
      };
    }

    // Validate field lengths
    if (name.length < 2 || name.length > 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Name must be between 2 and 100 characters' 
        })
      };
    }

    if (message.length < 10 || message.length > 2000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Message must be between 10 and 2000 characters' 
        })
      };
    }

    // Send email using Resend
    const emailData = {
      from: 'noreply@yourdomain.com', // You'll need to configure this domain in Resend
      to: [process.env.CONTACT_TO_EMAIL],
      subject: topic ? `Contact Form: ${topic}` : 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from Media Narrative contact form</small></p>
      `,
      reply_to: email
    };

    await resend.emails.send(emailData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        ok: false, 
        error: 'Failed to send email. Please try again later.' 
      })
    };
  }
};
