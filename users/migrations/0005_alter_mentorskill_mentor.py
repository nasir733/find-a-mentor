# Generated by Django 3.2.9 on 2021-11-15 15:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20211115_1315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mentorskill',
            name='mentor',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.mentorprofile'),
        ),
    ]