-- Disable all email verification requirements
UPDATE auth.config SET value = 'false' WHERE parameter = 'enable_signup_email_confirmation';
UPDATE auth.config SET value = 'false' WHERE parameter = 'enable_email_confirmations';

-- Set auto confirm to true for seamless authentication
UPDATE auth.config SET value = 'true' WHERE parameter = 'enable_auto_confirm';