from django.core.management.utils import get_random_secret_key
import dj_database_url
import dotenv
from pathlib import Path
import django_heroku
import os
import sys
dotenv.load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())


# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = os.getenv("DEBUG", "False") == "True"
DEBUG = True
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS",
                          "127.0.0.1,localhost").split(",")

LOGIN_REDIRECT_URL = '/dashboard/login/'
LOGIN_URL = '/dashboard/login/'


# Application definition
DEVELOPMENT_MODE = os.getenv("DEVELOPMENT_MODE", "False") == "True"
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'debug_toolbar',
    'main',
    'dashboard',
    'users',
    'mentor',
    'crispy_forms',
    'timezone_field',
    'direct',
    'storages',
    'corsheaders',
    'rest_framework',
    'notifications',
    'meeting.apps.MeetingConfig',

]
CORS_ALLOW_ORIGIN = '*'
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MIDDLEWARE = [

    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mezzanine.urls'
INTERNAL_IPS = [
    # ...
    '127.0.0.1',
    # ...
]
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(os.path.dirname(__file__), 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
WSGI_APPLICATION = 'mezzanine.wsgi.application'
#ASGI_APPLICATION = 'mezzanine.asgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# if DEBUG:
#     DATABASES = {
#         'default': {
#             'ENGINE': 'django.db.backends.sqlite3',
#             'NAME': BASE_DIR / 'db.sqlite3',
#         }
#     }


# if DEVELOPMENT_MODE is False:
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}
# elif len(sys.argv) > 0 and sys.argv[1] != 'collectstatic':
#     if os.getenv("DATABASE_URL", None) is None:
#         raise Exception("DATABASE_URL environment variable not defined")
#     DATABASES = {
#         "default": dj_database_url.parse(os.environ.get("DATABASE_URL")),
#     }


# if DEBUG:

#     DATABASES = {
#         "default": {
#             "ENGINE": "django.db.backends.postgresql",
#             "NAME": 'defaultdb',
#             "USER": 'doadmin',
#             "PASSWORD": 'uVS7qDiOdgqCo8Sw',
#             "HOST": 'db-postgresql-sfo2-80924-do-user-10501756-0.b.db.ondigitalocean.com',
#             "PORT": "25060",
#         }
#     }
# DATABASES['default'] = dj_database_url.config(
#     conn_max_age=600, ssl_require=True)


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/


# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


LOGIN_URL = '/dashboard/login/'

AUTH_USER_MODEL = 'users.CustomUser'

# STATIC_URL = '/static/'a

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]
MEDIA_ROOT = os.path.join(BASE_DIR, "images/")


CRISPY_TEMPLATE_PACK = 'bootstrap4'
DJANGO_NOTIFICATIONS_CONFIG = {
    'USE_JSONFIELD': True,
}
# live

# STRIPE_SECRET_KEY = "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"
# STRIPE_PUBLISHABLE_KEY = "pk_live_51GadadExWTjX75uFNZcxdwdGeMvUQCQAnxo1xicutlZd9i90Vn19l2TqPTP607peHTp36hFC1HgcUETm1RcuD7nf00zzcHGsCP"
# STRIPE_ENDPOINT_SECRET = "whsec_CZWBekTjZwYHeKiePoqxbLfqhXeemvHi"

# test

STRIPE_SECRET_KEY = "sk_test_51GadadExWTjX75uFGi8HJDnVtz1xsoPqSlVu5C1HQNK5DjdN9ANTXlxinjF9hF7UffAcRpwfOcDtXbxw4jTi8jIk00TqleQ5pg"
STRIPE_PUBLISHABLE_KEY = "pk_test_51GadadExWTjX75uFcS3TQPfUUSt3dkT1Bh92FLcpB3gBUlTI40JU2xp1VPCzktdISjy0dtM14E6WxZP7IoSxlZK100KQEFLvyV"
STRIPE_ENDPOINT_SECRET = "whsec_dFr4164bMwyi6hTS5KCmWzvanOGGlIVi"


EMAIL_BACKEND = 'django_ses.SESBackend'
DEFAULT_FROM_EMAIL = 'info@kleui.com'
AWS_ACCESS_KEY_ID = 'AKIAQVPXYDDKO66DFQWP'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'findamentorapp'
AWS_SES_REGION_NAME = 'us-east-1'  # (ex: us-east-2)
AWS_SES_REGION_ENDPOINT = 'email.us-east-1.amazonaws.com'


AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_DEFAULT_ACL = None

# s3 static settings

STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
AWS_S3_FILE_OVERWRITE = False

AWS_DEFAULT_ACL = None
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'


django_heroku.settings(locals())
