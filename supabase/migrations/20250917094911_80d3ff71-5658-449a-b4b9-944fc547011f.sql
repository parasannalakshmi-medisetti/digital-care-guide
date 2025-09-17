-- Remove email confirmation requirement
UPDATE auth.config SET value = 'false' WHERE parameter = 'enable_signup_email_confirmation';