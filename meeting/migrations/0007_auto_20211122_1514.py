# Generated by Django 3.2.9 on 2021-11-22 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meeting', '0006_meetingrecording'),
    ]

    operations = [
        migrations.AddField(
            model_name='meetingrecording',
            name='resourceId',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='meetingrecording',
            name='sid',
            field=models.TextField(blank=True, null=True),
        ),
    ]
