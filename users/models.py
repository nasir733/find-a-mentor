from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from timezone_field import TimeZoneField

USER_TYPE_CHOICES = (
    ('Mentor', 'Mentor'),
    ('Mentee', 'Mentee'),
)


class CustomUser(AbstractUser):
    username = models.CharField(
        max_length=120, unique=True, blank=True, null=True)
    password = models.CharField(max_length=120, blank=True, null=True)
    email = models.EmailField(max_length=120, blank=True, null=True)
    user_type = models.CharField(
        max_length=120, blank=True, null=True, choices=USER_TYPE_CHOICES)
    phone_number = models.CharField(max_length=120, blank=True, null=True)
    address = models.CharField(max_length=120, blank=True, null=True)
    country = models.CharField(max_length=120, blank=True, null=True)
    city = models.CharField(max_length=120, blank=True, null=True)
    first_name = models.CharField(max_length=120, blank=True, null=True)
    last_name = models.CharField(max_length=120, blank=True, null=True)
    timezone = TimeZoneField(default='Europe/London', null=True, blank=True)
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.username


class MentorProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    meeting_did = models.IntegerField(blank=True, null=True)
    image = models.ImageField(
        upload_to='profile_pics/mentor', blank=True, null=True)
    reviews_count = models.IntegerField(blank=True, null=True)
    messages_received = models.IntegerField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    total_money_earned = models.CharField(
        max_length=120, blank=True, null=True)
    total_hours_teached = models.CharField(
        max_length=120, blank=True, null=True)


class MenteeProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE)

    birth_date = models.DateField(blank=True, null=True)
    image = models.ImageField(
        upload_to='profile_pics/mentee', blank=True, null=True)
    total_money_spent = models.CharField(
        max_length=120, blank=True, null=True, default=0)
    total_hours_learned = models.CharField(
        max_length=120, blank=True, null=True, default=0)


class Tag(models.Model):
    name = models.CharField(max_length=120, blank=True, null=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    icon = models.ImageField(
        upload_to='tag_icon', blank=True, null=True)


class Content(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=120, blank=True, null=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='content/pics/', blank=True, null=True)
    video = models.FileField(
        upload_to='content/videos', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    price_per_hour = models.DecimalField(
        max_digits=999, decimal_places=2, blank=True, null=True)


class Review(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    message = models.TextField(max_length=500, blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Message(models.Model):
    sender = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='receiver')
    message = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class MentorPaymentCharge(models.Model):
    mentor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=999, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class MentorMenteeRelations(models.Model):
    mentor = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='mentor_relation', null=True, blank=True)
    mentee = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='mentee_relation', null=True, blank=True)
    amount = models.DecimalField(
        max_digits=999, decimal_places=2, null=True, blank=True)


class MentorRequest(models.Model):
    mentee = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='mentee')
    mentor = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='mentor')
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    total_time = models.CharField(max_length=120, blank=True, null=True)
    time_plan = models.ForeignKey(
        MentorPaymentCharge, on_delete=models.CASCADE, blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return "{} requested {} content from {}".format(self.mentee.username, self.content.title, self.mentor.username)


class Card(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=120, blank=True, null=True)
    expiry_date = models.CharField(max_length=120, blank=True, null=True)
    cvv = models.CharField(max_length=120, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "{} has {} card".format(self.user.username, self.card_number)


class MentorSkill(models.Model):
    mentor = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE)
    skill = models.ForeignKey(
        Tag, on_delete=models.CASCADE)

    def __str__(self):
        return "{} has {} skill".format(self.mentor.username, self.skill.name)


class MenteeInterest(models.Model):
    mentee = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE)
    skill = models.ForeignKey(
        Tag, on_delete=models.CASCADE)

    def __str__(self):
        return "{} has {} skill".format(self.mentee.username, self.skill.name)


class CourseTag(models.Model):
    content = models.OneToOneField(
        Content, on_delete=models.CASCADE)
    skill = models.ForeignKey(
        Tag, on_delete=models.CASCADE)

    def __str__(self):
        return "{} course with {}".format(self.content.title, self.skill.name)


class StripeCustomer(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE)
    stripe_id = models.CharField(max_length=120, blank=True, null=True)

    def __str__(self):
        return self.user.username
