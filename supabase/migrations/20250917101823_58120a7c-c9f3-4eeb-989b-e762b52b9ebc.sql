-- Completely disable email confirmation and verification
UPDATE auth.config SET value = 'false' WHERE parameter = 'enable_signup';
UPDATE auth.config SET value = 'false' WHERE parameter = 'enable_email_confirmation_signup';  
UPDATE auth.config SET value = 'false' WHERE parameter = 'enable_email_confirmations';
UPDATE auth.config SET value = 'false' WHERE parameter = 'mailer_autoconfirm';

-- Set auto confirm to true for seamless authentication
UPDATE auth.config SET value = 'true' WHERE parameter = 'enable_auto_confirm';

-- Disable all email verification requirements in auth settings
INSERT INTO auth.config (parameter, value) VALUES ('disable_email_signup', 'false') ON CONFLICT (parameter) DO UPDATE SET value = 'false';
INSERT INTO auth.config (parameter, value) VALUES ('enable_email_confirmations', 'false') ON CONFLICT (parameter) DO UPDATE SET value = 'false';