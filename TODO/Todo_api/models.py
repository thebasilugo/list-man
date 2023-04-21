from djongo import models

class User(models.Model):
    username = models.CharField(max_length=20, unique=False)
    email = models.EmailField(max_length=250)
    password = models.CharField(max_length=100)
