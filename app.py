from flask import Flask, request, render_template, redirect, url_for
from flask_mail import Mail, Message

app = Flask(__name__)

# Configure mail server
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'your_email_password'  # Replace with your email password
mail = Mail(app)

# Handle Register
@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    email = request.form['email']
    phone = request.form['phone']
    college = request.form['college']
    program = request.form['program']
    year = request.form['year']

    # Save details to database (example placeholder)
    # Use a database like SQLite or MySQL here for production use.

    # Send email notification
    msg = Message("New Registration on Placement Ready",
                  sender="your_email@gmail.com",  # Replace with your email
                  recipients=["agarwalabhishika2024@gmail.com"])
    msg.body = f"""
    New registration details:
    Name: {name}
    Email: {email}
    Phone: {phone}
    College: {college}
    Program: {program}
    Pass Out Year: {year}
    """
    mail.send(msg)

    return "Registration successful! We'll get in touch soon."

# Handle Login (OTP sending placeholder)
@app.route('/login', methods=['POST'])
def login():
    email_phone = request.form['email_phone']
    # Simulate sending OTP (for production, integrate an SMS/Email service)
    return "OTP sent successfully!"

if __name__ == '__main__':
    app.run(debug=True)
