from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields import CharField
from .managers import CustomUserManager
from timezone_field import TimeZoneField

USER_TYPE_CHOICES = (
    ('Mentor', 'Mentor'),
    ('Mentee', 'Mentee'),
)
WEEKDAYS = [
  ("Monday", "Monday"),
  ("Tuesday","Tuesday"),
  ("Wednesday","Wednesday"),
  ("Thursday","Thursday"),
  ("Friday","Friday"),
  ("Saturday", "Saturday"),
  ("Sunday","Sunday"),
]



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
    timezone = TimeZoneField(default='Europe/London', null=True, blank=True)
    is_new_message = models.BooleanField(default=False)
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
        upload_to='profile_pics/mentor', blank=True, null=True, default='default.png')
    reviews_count = models.IntegerField(blank=True, null=True)
    messages_received = models.IntegerField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True,default="#")
    facebook_url = models.URLField(blank=True, null=True,default="#")
    twitter_url = models.URLField(blank=True, null=True,default="#")
    linkedin_url = models.URLField(blank=True, null=True,default="#")
    github_url = models.URLField(blank=True, null=True,default="#")
    website_url = models.URLField(blank=True, null=True,default="#")
    youtube_url = models.URLField(blank=True, null=True,default="#")
    total_money_earned = models.CharField(
        max_length=120, blank=True, null=True,default=0)
    total_hours_teached = models.CharField(
        max_length=120, blank=True, null=True,default=0)

    def __str__(self):
        return self.user.username

class MenteeProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE)

    birth_date = models.DateField(blank=True, null=True)
    image = models.ImageField(
        upload_to='profile_pics/mentee', blank=True, null=True,default='default.png')
    total_money_spent = models.CharField(
        max_length=120, blank=True, null=True, default=0)
    total_hours_learned = models.CharField(
        max_length=120, blank=True, null=True, default=0)
    
    def __str__(self):
        return self.user.username

class Catergory(models.Model):
    name = models.CharField(max_length=120, blank=True, null=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    icon = models.ImageField(
        upload_to='Catergory_icon', blank=True, null=True)

    def __str__(self):
        return self.name
class Skill(models.Model):
    catergory = models.ForeignKey(Catergory, on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=120, blank=True, null=True)
    description = models.TextField(max_length=500, blank=True, null=True)

    def __str__(self):
        return "{} - {}".format(self.catergory.name, self.name)
class Content(models.Model):
    user = models.ForeignKey(MentorProfile, on_delete=models.CASCADE,null=True,blank=True)
    title = models.CharField(max_length=120, blank=True, null=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='content/pics/', blank=True, null=True)
    video_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    price_per_hour = models.DecimalField(
        max_digits=6, decimal_places=2, blank=True, null=True,default=0)
    content_tags = models.ManyToManyField(Skill, blank=True,null=True)

    class Meta:
        ordering = ('-updated_at',)

    def __str__(self):
        return "{} - {}".format(self.title, self.user.user.username)


class MentorPaymentPlans(models.Model):
    amount = models.DecimalField(max_digits=6, decimal_places=2,default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE,null=True, blank=True)
    stripe_plan_id = models.CharField(max_length=200, blank=True, null=True)

class Review(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    message = models.TextField(max_length=500, blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return "{} added review for {}".format(self.user.username, self.content.title)

class CourseCatergory(models.Model):
    content = models.OneToOneField(
        Content, on_delete=models.CASCADE,null=True,blank=True)
    skill = models.ForeignKey(
        Skill, on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return "{} course with {}".format(self.content.title, self.skill.name)



class StripeCustomer(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE)
    stripe_id = models.CharField(max_length=120, blank=True, null=True)

    def __str__(self):
        return self.user.username



class MentorSkill(models.Model):
    mentor = models.OneToOneField(
        MentorProfile, on_delete=models.CASCADE)
    skill = models.ManyToManyField(
        Skill, blank=True, null=True)

    def __str__(self):
        return self.mentor.user.username


class MenteeInterest(models.Model):
    mentee = models.OneToOneField(
        MenteeProfile, on_delete=models.CASCADE)
    interest = models.ManyToManyField(
        Skill, blank=True, null=True)

    def __str__(self):
        return self.mentee.user.username


class MentorMenteeRelations(models.Model):
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name='mentor_relation', null=True, blank=True)
    mentee = models.ForeignKey(
        MenteeProfile, on_delete=models.CASCADE, related_name='mentee_relation', null=True, blank=True)
    amount = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True,default=0)

    def __str__(self):
        return "{} has {} mentee : {}".format(self.mentor.user.username, self.mentee.user.username,self.amount)


class MentorRequest(models.Model):
    mentee = models.ForeignKey(
        MenteeProfile, on_delete=models.CASCADE, related_name='mentee')
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name='mentor')
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    declined = models.BooleanField(default=False)
    time_plan = models.ForeignKey(
        MentorPaymentPlans, on_delete=models.CASCADE, blank=True, null=True)
    total_amount = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True,default=0)

    class Meta:
        ordering = ('-created_at',)
    
    def __str__(self):
        return "{} requested {} content from {}".format(self.mentee.user.username, self.content.title, self.mentor.user.username)

class MentorRequestTime(models.Model):
    request = models.OneToOneField(
        MentorRequest, on_delete=models.CASCADE)
    date = models.DateField(blank=True, null=True)
    weekday = models.CharField(choices=WEEKDAYS, max_length=20, blank=True, null=True)
    mentor_availibility = models.ForeignKey('MentorAvailability', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return "{} requested {} content {}".format(self.request.mentee.user.username, self.request.content.title, self.date)

class MentorAvailability(models.Model):
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name='mentor_availablity')
    weekday = models.CharField(choices=WEEKDAYS, max_length=20, blank=True, null=True)
    from_hour = models.TimeField(null=True, blank=True)
    to_hour = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ('weekday',)
        unique_together = ('mentor','weekday', 'from_hour', 'to_hour')

    def __str__(self):
        return "{} is available on {}".format(self.mentor.user.username, self.weekday)



