CREATE TABLE IF NOT EXISTS public.form_answers(
  ID  SERIAL PRIMARY KEY,
  first_names     VARCHAR(255) NOT NULL, 
  last_names      VARCHAR(255) NOT NULL, 
  zip_code        VARCHAR(5) NOT NULL, 
  phone_number    VARCHAR(20) NOT NULL, 
  email           VARCHAR(255), 
  initiative      VARCHAR(100) NOT NULL
);

COMMENT ON TABLE public.form_answers IS 'Answers from the contact form';