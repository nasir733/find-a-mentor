
import dj_database_url
import dotenv
from pathlib import Path
import django_heroku
import os
dotenv.load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-s85)mgqbzhu_0^jml%q*dkxpyp$4n)ptji3zw)o(ve@*9tm*eh'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []
LOGIN_REDIRECT_URL = '/dashboard/login/'
LOGIN_URL = '/dashboard/login/'



# Application definition

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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
DATABASES['default'] = dj_database_url.config(
    conn_max_age=600, ssl_require=True)


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

AWS_ACCESS_KEY_ID = 'AKIAQVPXYDDKO66DFQWP'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'findamentorapp'

AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

    # s3 static settings

STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
AWS_S3_FILE_OVERWRITE = False

AWS_DEFAULT_ACL = None
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'



django_heroku.settings(locals())

"""
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
"""
