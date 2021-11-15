# Generated by Django 3.2.9 on 2021-11-14 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mentorprofile',
            name='facebook_url',
            field=models.URLField(blank=True, default='#', null=True),
        ),
        migrations.AlterField(
            model_name='mentorprofile',
            name='github_url',
            field=models.URLField(blank=True, default='#', null=True),
        ),
        migrations.AlterField(
            model_name='mentorprofile',
            name='instagram_url',
            field=models.URLField(blank=True, default='#', null=True),
        ),
        migrations.AlterField(
            model_name='mentorprofile',
            name='linkedin_url',
            field=models.URLField(blank=True, default='#', null=True),
        ),
        migrations.AlterField(
            model_name='mentorprofile',
            name='twitter_url',
            field=models.URLField(blank=True, default='#', null=True),
        ),
        migrations.AlterField(
            model_name='mentorprofile',
            name='website_url',
            field=models.URLField(blank=True, default='#', null=True),
        ),
        migrations.AlterField(
            model_name='mentorprofile',
            name='youtube_url',
            field=models.URLField(blank=True, default='#', null=True),
        ),
    ]