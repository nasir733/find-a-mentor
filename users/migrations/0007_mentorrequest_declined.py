# Generated by Django 3.2.6 on 2021-11-11 23:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_auto_20211111_2050'),
    ]

    operations = [
        migrations.AddField(
            model_name='mentorrequest',
            name='declined',
            field=models.BooleanField(default=False),
        ),
    ]
