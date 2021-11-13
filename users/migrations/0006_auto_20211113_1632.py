# Generated by Django 3.2.9 on 2021-11-13 16:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_customuser_is_new_message'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mentorrequest',
            name='end_time',
        ),
        migrations.RemoveField(
            model_name='mentorrequest',
            name='start_time',
        ),
        migrations.RemoveField(
            model_name='mentorrequest',
            name='total_time',
        ),
        migrations.CreateModel(
            name='MentorRequestTime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('weekday', models.IntegerField(blank=True, choices=[(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday')], null=True)),
                ('from_hour', models.TimeField(blank=True, null=True)),
                ('to_hour', models.TimeField(blank=True, null=True)),
                ('from_date', models.DateField(blank=True, null=True)),
                ('to_date', models.DateField(blank=True, null=True)),
                ('from_weekday', models.IntegerField(blank=True, choices=[(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday')], null=True)),
                ('to_weekday', models.IntegerField(blank=True, choices=[(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday')], null=True)),
                ('total_hours', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=99999, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('request', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.mentorrequest')),
            ],
        ),
        migrations.CreateModel(
            name='MentorAvailability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weekday', models.IntegerField(choices=[(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday')])),
                ('from_hour', models.TimeField(blank=True, null=True)),
                ('to_hour', models.TimeField(blank=True, null=True)),
                ('mentor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mentor_availablity', to='users.mentorprofile')),
            ],
            options={
                'ordering': ('weekday', 'from_hour'),
                'unique_together': {('mentor', 'weekday', 'from_hour', 'to_hour')},
            },
        ),
    ]
