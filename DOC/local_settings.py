import sys

DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'spildb',                      # Or path to database file if using sqlite3.
        'USER': 'test_user',                      # Not used with sqlite3.
        'PASSWORD': 'test_pass',         # Not used with sqlite3.
        'HOST': '',           # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',           # Set to empty string for default. Not used with sqlite3.
    }
}

ACCOUNT_ACTIVATION_DAYS = 7
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'crysis.gomez@gmail.com'
EMAIL_HOST_PASSWORD = 'Colegio1'
EMAIL_USE_TLS = True
