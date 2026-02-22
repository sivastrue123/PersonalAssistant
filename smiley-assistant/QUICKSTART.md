
## Quick Start for Testing

Since you are running this locally with your own Supabase project, there are no pre-seeded users. You need to create one.

### 1. Disable Email Confirmation (Optional but Recommended for Dev)
To make testing easier without setting up an email server:
1.  Go to your **Supabase Dashboard** > **Authentication** > **Providers** > **Email**.
2.  Turn **OFF** "Confirm email".
3.  Click **Save**.

### 2. Create Your First User
1.  Open the app in your browser (`http://localhost:5173`).
2.  Enter any email (e.g., `test@example.com`).
3.  Enter a password (e.g., `password123`).
4.  Click **Sign Up**.
5.  If you disabled email confirmation, you will be logged in immediately!

### 3. Create Partner User (for Chat/Sharing)
1.  Open an Incognito window.
2.  Sign up with a second email (e.g., `partner@example.com`).
3.  Now you can test chat between the two windows!
