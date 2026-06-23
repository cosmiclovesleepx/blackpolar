import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Register — Black Polar",
  description: "Create your Black Polar account.",
  icons: { icon: "/assets/main/image/favicon.ico" },
};

export default function RegisterPage() {
  return (
    <>
      <div className="container">
        <div className="login-box">

          <h1 className="title">REGISTER</h1>

          {/* Opción de Google OAuth */}
          <div className="oauth-section">
            <a href="/api/auth/signin/google" className="btn-google">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </a>
            <div className="divider">
              <span>or</span>
            </div>
          </div>

          <form id="registerForm" method="POST" action="/api/auth/sign-up/email">

            <div className="form-grid">

              <div className="input-group">
                <label>First Name*</label>
                <input type="text" name="firstName" placeholder="Your first name" />
              </div>

              <div className="input-group">
                <label>Last Name*</label>
                <input type="text" name="lastName" placeholder="Your last name" />
              </div>

              <div className="input-group">
                <label>ID Type*</label>
                <select name="idType">
                  <option value="">Select</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>ID Number*</label>
                <input type="text" name="idNumber" />
              </div>

              <div className="input-group">
                <label>Gender</label>
                <select name="gender">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>Date of Birth</label>
                <input type="date" name="birthDate" />
              </div>

              <div className="input-group">
                <label>City</label>
                <input type="text" name="city" />
              </div>

              <div className="input-group">
                <label>District</label>
                <input type="text" name="district" />
              </div>

              <div className="input-group full">
                <label>Address</label>
                <input type="text" name="address" />
              </div>

            </div>

            <h2 className="subtitle">Account Access</h2>

            <div className="form-grid">

              <div className="input-group full">
                <label>Email*</label>
                <input type="email" name="email" />
              </div>

              <div className="input-group full">
                <label>Confirm Email*</label>
                <input type="email" name="confirmEmail" />
              </div>

              <div className="input-group full">
                <label>Password*</label>
                <input type="password" name="password" />
              </div>

              <div className="input-group full">
                <label>Confirm Password*</label>
                <input type="password" name="confirmPassword" />
              </div>

            </div>

            <div className="checkbox">
              <input type="checkbox" required />
              <span>I accept the terms and conditions</span>
            </div>

            <div className="buttons">
              <button type="submit" className="btn-primary">Create Account</button>
              <a href="/login" className="btn-secondary">Sign In</a>
            </div>

          </form>

        </div>
      </div>
      <Script src="/js/main/register.js" strategy="afterInteractive" />
    </>
  );
}
