# Generated by Django 3.2.9 on 2021-11-18 17:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('direct', '0002_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='room',
            options={'ordering': ('-updated_at',)},
        ),
    ]
