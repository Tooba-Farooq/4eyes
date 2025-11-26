# 4Eyes

A full-stack e-commerce application with AR virtual try-on functionality using MediaPipe and Three.js for face detection and product visualization.

## 🚀 Features

- Virtual AR try-on for products (glasses, accessories, etc.)
- Face detection using MediaPipe
- 3D product rendering with Three.js
- Stripe payment integration
- User authentication and authorization
- Product catalog and shopping cart
- Order management

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **pip** (Python package manager)
- **Stripe CLI** (for local payment testing) - [Install here](https://stripe.com/docs/stripe-cli)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tooba-Farooq/4eyes.git
cd 4Eyes
```

### 2. Database Setup (PostgreSQL)

#### Windows:

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. During installation, remember the password you set for the `postgres` user
3. Open **pgAdmin** or **psql** command line
4. Create the database and user:

```sql
CREATE DATABASE 4eyes_db;
CREATE USER 4eyes_user WITH PASSWORD 'glasses123';
ALTER ROLE 4eyes_user SET client_encoding TO 'utf8';
ALTER ROLE 4eyes_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE 4eyes_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE 4eyes_db TO 4eyes_user;
```

#### Mac:

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database and user
psql postgres
CREATE DATABASE 4eyes_db;
CREATE USER 4eyes_user WITH PASSWORD 'glasses123';
GRANT ALL PRIVILEGES ON DATABASE 4eyes_db TO 4eyes_user;
\q
```

#### Linux (Ubuntu/Debian):

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE 4eyes_db;
CREATE USER 4eyes_user WITH PASSWORD 'glasses123';
GRANT ALL PRIVILEGES ON DATABASE 4eyes_db TO 4eyes_user;
\q
```

### 3. Backend Setup (Django)

```bash
# Navigate to backend directory
cd For_eyes

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file in backend directory
# Copy the content below and add your keys
```

**Backend `.env` file:**

```env

# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

```

```bash
# Run database migrations
python manage.py migrate

# Load pre-seeded data to populate the database
python manage.py loaddata data_dump.json

# Start backend server
python manage.py runserver
# Backend will run on: http://localhost:8000
```

### 4. Frontend Setup (React)

```bash
# Open a new terminal window
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start frontend development server
npm run dev
# Frontend will run on: http://localhost:5173
```

### 5. Stripe Webhook Setup (for Payment Testing)

```bash
# Open a third terminal window
and go to the directory wherever you have stripe.exe
# Login to Stripe CLI (only needed once)
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:8000/apis/stripe-webhook/

# Copy the webhook signing secret (whsec_...)
# and paste it in your backend .env file as STRIPE_WEBHOOK_SECRET
```

**Keep this terminal running while testing payments!**

## 🗄️ Database Information

This project uses **PostgreSQL** as its database system. The pre-loaded data includes:

- **Sample Products** (glasses, sunglasses, accessories with 3D models)
- **Admin Account** (for management)
- **Sample Categories**

After running migrations, load the sample data using:

```bash
python manage.py loaddata data_dump.json
```

## 🔑 Test Credentials

### Admin Account

- Email: `toobafar004@gmail.com`
- Password: `test@123.com`

### Database Credentials

- Database: `4eyes_db`
- User: `4eyes_user`
- Password: `glasses123`
- Host: `127.0.0.1`
- Port: `5432`

### Stripe Test Cards

Use these card numbers for testing payments:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

## 🎯 Running the Application

**You need 3 terminal windows running simultaneously:**

1. **Backend Server** (Terminal 1):

   ```bash
   cd For_eyes
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   python manage.py runserver
   ```

2. **Frontend Server** (Terminal 2):

   ```bash
   cd frontend
   npm start
   ```

3. **Stripe Webhook Listener** (Terminal 3):
   ```bash
   stripe listen --forward-to localhost:8000/apis/stripe-webhook/
   ```

## 📱 Accessing the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/apis
- **Admin Panel:** http://localhost:8000/admin

## 🧪 Testing the Virtual Try-On Feature

1. Navigate to any product page
2. Click "Virtual Try-On" button
3. Allow camera permissions when prompted
4. Position your face in the frame
5. The product will overlay on your face in real-time
6. Adjust and capture when satisfied

**Note:** Camera access requires:

- HTTPS connection (or localhost)
- Camera permissions granted in browser
- Working webcam

## 💳 Testing Payment Flow

1. Add products to cart
2. Proceed to checkout
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Check order confirmation
6. Verify webhook received in Stripe CLI terminal

## 🐛 Troubleshooting

### PostgreSQL Connection Error

- Make sure PostgreSQL service is running:
  ```bash
  # Windows: Check Services app
  # Mac: brew services list
  # Linux: sudo systemctl status postgresql
  ```
- Verify database credentials in `.env` file
- Check if database `4eyes_db` exists: `psql -U postgres -l`

### Camera Not Working

- Ensure you're using HTTPS or localhost
- Check browser permissions (camera icon in address bar)
- Close other applications using the camera
- Try different browser

### Stripe Webhook Errors

- Make sure Stripe CLI is running
- Verify webhook URL matches your backend route: `localhost:8000/apis/stripe-webhook/`
- Check STRIPE_WEBHOOK_SECRET in .env
- Backend server must be running on port 8000

### Database Errors

- Ensure PostgreSQL is running
- Check if virtual environment is activated
- Verify all migrations are applied: `python manage.py showmigrations`
- Try resetting database:
  ```bash
  python manage.py flush
  python manage.py migrate
  python manage.py loaddata data_dump.json
  ```

### Port Already in Use

```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 8000 (backend)
npx kill-port 8000
```

### Payment Not Processing

- Verify Stripe keys are correct in both frontend and backend
- Check Stripe CLI is forwarding webhooks
- Look for errors in all 3 terminal windows
- Test with different test card numbers

### Module Not Found Errors

```bash
# Make sure virtual environment is activated
# Then reinstall dependencies
pip install -r requirements.txt
```

## 🔧 Additional Commands

### Create New Admin User

```bash
python manage.py createsuperuser
```

### Reset Database

```bash
# Drop and recreate (CAREFUL: deletes all data)
psql -U postgres
DROP DATABASE 4eyes_db;
CREATE DATABASE 4eyes_db;
GRANT ALL PRIVILEGES ON DATABASE 4eyes_db TO 4eyes_user;
\q

# Then run migrations and load data again
python manage.py migrate
python manage.py loaddata data_dump.json
```

### Backup Database

```bash
# Create backup
pg_dump -U 4eyes_user -h localhost 4eyes_db > backup.sql

# Restore backup
psql -U 4eyes_user -h localhost 4eyes_db < backup.sql
```

## 📧 Support

For issues or questions, contact: toobafar004@gmail.com

## 📝 Important Notes

- This is a **development setup**. For production deployment, additional security configurations are required.
- Keep your `.env` file secure and never commit it to version control
- The Stripe keys provided should be test keys only
- PostgreSQL must be installed and running before starting the backend

---

**Happy Coding! 🎉**
