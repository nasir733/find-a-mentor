from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# Register your models here.
from .models import *
from .forms import CustomUserCreationForm, CustomUserChangeForm

# Register your models here.


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['username', 'email']
    fieldsets = (
        (
            (('User'), {
                'fields': ('username', 'password', 'email', 'user_type',)
            }),
            (('Personal'), {
                'fields': ('phone_number', 'address', 'country', 'city', 'timezone',)
            }),
            (('Permissions'), {
                'fields': ('is_active', 'is_staff', 'is_superuser')
            }),
        ))


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Review)
admin.site.register(MentorProfile)
admin.site.register(MenteeProfile)
admin.site.register(MentorRequest)
admin.site.register(Catergory)
admin.site.register(MentorSkill)
admin.site.register(MenteeInterest)
admin.site.register(CourseCatergory)
admin.site.register(Content)
admin.site.register(Skill)
admin.site.register(MentorPaymentPlans)
admin.site.register(StripeCustomer)
admin.site.register(MentorMenteeRelations)
admin.site.register(MentorAvailability)
admin.site.register(MentorRequestTime)
admin.site.register(MentorRequestTimeSlot)
admin.site.register(MentorBookedEvent)