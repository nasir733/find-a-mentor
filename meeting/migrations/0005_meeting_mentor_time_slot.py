# Generated by Django 3.2.9 on 2021-11-20 01:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_mentorbookedevent_mentee_request'),
        ('meeting', '0004_alter_meeting_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='meeting',
            name='mentor_time_slot',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.mentorrequesttimeslot'),
        ),
    ]
