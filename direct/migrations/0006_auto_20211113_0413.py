# Generated by Django 3.2.9 on 2021-11-13 04:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('direct', '0005_message_room'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='created_user',
        ),
        migrations.RemoveField(
            model_name='room',
            name='updated_user',
        ),
        migrations.AddField(
            model_name='room',
            name='first_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='firstuser_rooms', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='room',
            name='second_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='seconduser_rooms', to=settings.AUTH_USER_MODEL),
        ),
    ]
