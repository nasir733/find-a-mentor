# Generated by Django 3.2.9 on 2021-11-17 12:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_mentorskill_mentor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mentorrequesttime',
            name='request',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.mentorrequest'),
        ),
    ]