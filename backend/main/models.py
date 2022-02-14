from django.db import models

class Message(models.Model):
    message = models.CharField(max_length=500)
    sender = models.CharField(max_length=50)
    receiver = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message