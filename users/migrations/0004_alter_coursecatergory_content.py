# Generated by Django 3.2.6 on 2021-11-11 20:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20211111_1700'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursecatergory',
            name='content',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.content'),
        ),
    ]
